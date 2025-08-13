import { getIronSession } from 'iron-session';
import { sessionOptions, SessionData } from '@/lib/session';
import { cookies } from 'next/headers';
import { createClient } from 'next-sanity';
import { NextRequest, NextResponse } from 'next/server';

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

export async function POST(req: NextRequest) {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);

  if (!session.isLoggedIn || !session.isAdmin) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  const { documentId, type } = await req.json();

  if (!documentId || !['author', 'article'].includes(type)) {
    return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
  }

  try {
    await sanityClient
      .patch(documentId)
      .set({ verified: true })
      .commit();
    
    return NextResponse.json({ message: `${type} verified successfully.` });
  } catch (error) {
    console.error('Verification failed:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}