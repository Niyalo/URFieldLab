import { createClient, SanityAssetDocument } from 'next-sanity';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionOptions, SessionData } from '@/lib/session';
import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import slugify from 'slugify';

// Client with write access, similar to the signup route
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  useCdn: false, // Must be false for mutations
  token: process.env.SANITY_API_WRITE_TOKEN,
});

// Helper to upload any asset from a buffer
async function uploadAsset(buffer: Buffer, filename: string, type: 'image' | 'file') {
  return client.assets.upload(type, buffer, {
    filename,
  });
}

export async function POST(req: NextRequest) {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  if (!session.isLoggedIn || !session._id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const articleId = formData.get('articleId') as string | null;
    const title = formData.get('title') as string;
    const yearId = formData.get('yearId') as string;
    const workingGroups = JSON.parse(formData.get('workingGroups') as string);
    const authors = JSON.parse(formData.get('authors') as string);
    const authorListPrefix = formData.get('authorListPrefix') as string;
    const summary = formData.get('summary') as string;
    const hasBody = formData.get('hasBody') === 'on' || formData.get('hasBody') === 'true';
    const buttonText = formData.get('buttonText') as string;
    const mainImageFile = formData.get('mainImage') as File | null;
    let bodyPayload = formData.get('body') ? JSON.parse(formData.get('body') as string) : [];

    if (!title || !yearId || !workingGroups.length || !authors.length) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Process and upload files within the body payload
    const updatedBody = await Promise.all(bodyPayload.map(async (block: any) => {
        const file = formData.get(block._key) as File | null;
        
        // If a new file is uploaded for this block, process it.
        if (file) {
            const fileBuffer = Buffer.from(await file.arrayBuffer());
            const assetType = (block._type === 'imageObject' || block._type === 'posterObject') ? 'image' : 'file';
            const asset = await uploadAsset(fileBuffer, file.name, assetType);

            // Return the block with the new asset reference, preserving other data like caption.
            return {
                ...block,
                asset: {
                    _type: 'reference',
                    _ref: asset._id,
                }
            };
        }

        // If no new file, and the block already has an asset reference, make sure it's kept.
        // The client now sends the full block, so this should be correct.
        return block;
    }));

    const doc: any = {
      _type: 'article',
      title,
      year: { _type: 'reference', _ref: yearId },
      workingGroups: workingGroups.map((id: string) => ({ _type: 'reference', _ref: id, _key: nanoid() })),
      authors: authors.map((id: string) => ({ _type: 'reference', _ref: id, _key: nanoid() })),
      authorListPrefix,
      summary,
      hasBody,
    };

    if (hasBody) {
      doc.slug = { _type: 'slug', current: slugify(title, { lower: true, strict: true }) };
      doc.buttonText = buttonText;
      doc.body = updatedBody;
    }

    let transaction = client.transaction();

    if (articleId) {
      // Update existing article
      doc._id = articleId;
      if (mainImageFile && mainImageFile.size > 0) {
        const imageAsset = await uploadAsset(Buffer.from(await mainImageFile.arrayBuffer()), mainImageFile.name, 'image');
        doc.mainImage = { _type: 'image', asset: { _type: 'reference', _ref: imageAsset._id } };
      }
      transaction.createOrReplace(doc);
    } else {
      // Create new article
      if (!mainImageFile || mainImageFile.size === 0) {
        return NextResponse.json({ message: 'Main image is required for new articles' }, { status: 400 });
      }
      const imageAsset = await uploadAsset(Buffer.from(await mainImageFile.arrayBuffer()), mainImageFile.name, 'image');
      doc.mainImage = { _type: 'image', asset: { _type: 'reference', _ref: imageAsset._id } };
      transaction.create(doc);
    }

    await transaction.commit();

    return NextResponse.json({ message: `Article ${articleId ? 'updated' : 'created'} successfully` }, { status: 200 });
  } catch (error) {
    console.error('Error processing article:', error);
    return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
  }
}