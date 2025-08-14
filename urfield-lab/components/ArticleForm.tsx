'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Image from 'next/image';
import Select from 'react-select';
import { nanoid } from 'nanoid';
import slugify from 'slugify';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Author, Article, WorkingGroup } from '@/sanity/sanity-utils';
import { SessionData } from '@/lib/session';
import ArticlePreview from './ArticlePreview';
import ArticleBody from './ArticleBody';
import { urlFor } from '@/sanity/sanity-utils';
import RichTextEditor from './RichTextEditor';

// A local, more flexible Article type for previewing purposes
type PreviewArticle = Omit<Article, 'mainImage' | 'authors' | 'year'> & {
    mainImage: string | { asset: { _ref: string; url: string } } | null; // Can be a Sanity image object or a preview URL string
    authors: { name: string, image?: { asset: { url: string; _ref?: string } } | null }[];
    year: { _id: string; slug: { current: string }; _type?: string; year?: number; title?: string } | null;
    externalLinks?: { buttonText: string; url: string }[];
};

// Props definition for the form component
interface ArticleFormProps {
  article: Article | null;
  availableAuthors: Author[];
  availableWGs: WorkingGroup[];
  user: SessionData | null;
  yearSlug: string; // Add yearSlug for preview link
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  onCancel: () => void;
  isPublishing: boolean;
}



// Sortable Item Component for the body editor
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-function-type
function SortableItem({ id, block, index, updateBlock, removeBlock, fileMap }: { id: string, block: any /* TODO: proper type */, index: number, updateBlock: Function /* TODO: proper type */, removeBlock: Function /* TODO: proper type */, fileMap: Map<string, File> }) {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
    } = useSortable({id});
    
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };
    
    const newFile = fileMap.get(id);
    // State for image preview URL
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        let objectUrl: string | null = null;
        if (newFile) {
            objectUrl = URL.createObjectURL(newFile);
            setPreviewUrl(objectUrl);
        } else if (block.asset?.url) {
            setPreviewUrl(block.asset.url);
        } else {
            setPreviewUrl(null);
        }

        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [newFile, block.asset?.url]);


    return (
      <div ref={setNodeRef} style={style} {...attributes} className="p-3 border rounded-md bg-gray-50 dark:bg-gray-700">
        <div className="flex justify-between items-start">
            <div className="flex-grow pr-4">
                {block._type === 'subheading' && (
                    <input type="text" placeholder="Subheading" value={block.text || ''} onChange={e => updateBlock(index, { text: e.target.value })} className="w-full text-xl font-bold bg-transparent border-b dark:border-gray-500" />
                )}
                {block._type === 'sectionTitle' && (
                    <input type="text" placeholder="Section Title" value={block.text || ''} onChange={e => updateBlock(index, { text: e.target.value })} className="w-full text-2xl font-bold text-center bg-transparent border-b dark:border-gray-500" />
                )}
                {block._type === 'textBlock' && (
                    <RichTextEditor 
                        value={block.content} 
                        onChange={newContent => updateBlock(index, { content: newContent })} 
                    />
                )}
                {block._type === 'list' && (
                    <div className="space-y-1">
                        {(block.items || []).map((item: string, i: number) => (
                            <div key={i} className="flex items-center">
                                <input type="text" value={item} onChange={e => {
                                    const newItems = [...(block.items || [])];
                                    newItems[i] = e.target.value;
                                    updateBlock(index, { items: newItems });
                                }} className="w-full bg-transparent border-b" />
                                <button type="button" onClick={() => {
                                    const newItems = [...(block.items || [])];
                                    newItems.splice(i, 1);
                                    updateBlock(index, { items: newItems });
                                }} className="ml-2 text-red-500 text-xs">X</button>
                            </div>
                        ))}
                        <button type="button" onClick={() => updateBlock(index, { items: [...(block.items || []), ''] })} className="text-sm text-blue-500">+ Add item</button>
                    </div>
                )}
                {block._type === 'externalLinksList' && (
                    <div className="space-y-2">
                        <label className="block text-sm font-medium">External Links</label>
                        {(block.links || []).map((link: { buttonText: string, url: string }, i: number) => (
                            <div key={i} className="flex items-center gap-2 p-2 border rounded-md">
                                <input type="text" placeholder="Button Text" value={link.buttonText} onChange={e => {
                                    const newLinks = [...(block.links || [])];
                                    newLinks[i] = { ...newLinks[i], buttonText: e.target.value };
                                    updateBlock(index, { links: newLinks });
                                }} className="w-1/2 bg-transparent border-b" />
                                <input type="url" placeholder="https://example.com" value={link.url} onChange={e => {
                                    const newLinks = [...(block.links || [])];
                                    newLinks[i] = { ...newLinks[i], url: e.target.value };
                                    updateBlock(index, { links: newLinks });
                                }} className="w-1/2 bg-transparent border-b" />
                                <button type="button" onClick={() => {
                                    const newLinks = [...(block.links || [])];
                                    newLinks.splice(i, 1);
                                    updateBlock(index, { links: newLinks });
                                }} className="ml-2 text-red-500 text-xs">X</button>
                            </div>
                        ))}
                        <button type="button" onClick={() => updateBlock(index, { links: [...(block.links || []), { buttonText: '', url: '' }] })} className="text-sm text-blue-500">+ Add Link</button>
                    </div>
                )}
                {(block._type === 'imageObject' || block._type === 'posterObject' || block._type === 'pdfFile') && (
                    <div className="space-y-2">
                        <label className="block text-sm font-medium capitalize">{block._type.replace('Object', '').replace('File', ' File')}</label>
                        <input 
                            type="file" 
                            accept={block._type === 'pdfFile' ? '.pdf' : 'image/*'} 
                            onChange={e => updateBlock(index, {}, e.target.files?.[0])} 
                            className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        {previewUrl && block._type !== 'pdfFile' && (
                            <Image src={previewUrl} alt="Preview" width={160} height={160} className="mt-2 max-h-40 rounded-md shadow-sm object-contain" />
                        )}
                        {newFile && <p className="text-xs text-green-500 mt-1">New file selected: {newFile.name}</p>}
                        {!newFile && block.asset?.originalFilename && (
                            <p className="text-xs text-gray-500 mt-1">
                                Current file: <a href={block.asset.url} target="_blank" rel="noopener noreferrer" className="underline">{block.asset.originalFilename}</a>.
                                <br/>
                                Upload a new one to replace it.
                            </p>
                        )}
                        {block._type !== 'posterObject' && (
                             <input type="text" placeholder="Caption (optional)" value={block.caption || ''} onChange={e => updateBlock(index, { caption: e.target.value })} className="w-full text-sm bg-transparent border-b dark:border-gray-500 mt-2" />
                        )}
                    </div>
                )}
            </div>
            <div className="flex items-center">
              <button type="button" {...listeners} className="ml-4 p-2 cursor-grab active:cursor-grabbing">☰</button>
              <button type="button" onClick={() => removeBlock(index)} className="ml-2 text-red-500 hover:text-red-700 font-bold">X</button>
            </div>
        </div>
      </div>
    );
}

// The main Article Form Component
export default function ArticleForm({ article, availableAuthors, availableWGs, user, yearSlug, onSubmit, onCancel, isPublishing }: ArticleFormProps) {
    const formRef = useRef<HTMLFormElement>(null);
    const [hasBody, setHasBody] = useState(article?.hasBody || false);
    const [title, setTitle] = useState(article?.title || '');
    const [mainImagePreview, setMainImagePreview] = useState<string | null>(article?.mainImage ? urlFor(article.mainImage).url() : null);
    const [externalLinks, setExternalLinks] = useState(article?.externalLinks || []);
    
    // State for the preview modal
    const [previewData, setPreviewData] = useState<PreviewArticle | null>(null);
    const [previewType, setPreviewType] = useState<'preview' | 'body' | null>(null);

    const authorOptions = availableAuthors.filter(a => a._id !== user?._id).map(a => ({ value: a._id, label: a.name }));
    const wgOptions = availableWGs.map(wg => ({ value: wg._id, label: wg.title }));
    
    const [selectedAuthors, setSelectedAuthors] = useState(() => 
        authorOptions.filter(opt => article?.authors?.some(a => a._id === opt.value))
    );
    const [selectedWGs, setSelectedWGs] = useState(() => 
        wgOptions.filter(opt => article?.workingGroups?.some(wg => wg._id === opt.value))
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [body, setBody] = useState<(any & { _key: string })[]>(() => article?.body?.map(b => ({...b, _key: b._key || nanoid()})) || []);
    const bodyIds = useMemo(() => body.map(b => b._key), [body]);
    const [fileMap, setFileMap] = useState<Map<string, File>>(new Map());

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    function handleDragEnd(event: DragEndEvent) {
        const {active, over} = event;
        if (over && active.id !== over.id) {
            setBody((items) => {
                const oldIndex = items.findIndex((item) => item._key === active.id);
                const newIndex = items.findIndex((item) => item._key === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    }

    const addBlock = (type: string) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let newBlock: any;
        switch (type) {
            case 'sectionTitle': newBlock = { _type: 'sectionTitle', text: '' }; break;
            case 'subheading': newBlock = { _type: 'subheading', text: '' }; break;
            case 'textBlock': newBlock = { _type: 'textBlock', content: [{ _type: 'block', children: [{ _type: 'span', text: '' }], style: 'normal' }] }; break;
            case 'list': newBlock = { _type: 'list', items: [''] }; break;
            case 'imageObject': newBlock = { _type: 'imageObject', caption: '' }; break;
            case 'posterObject': newBlock = { _type: 'posterObject' }; break;
            case 'pdfFile': newBlock = { _type: 'pdfFile', caption: '' }; break;
            case 'externalLinksList': newBlock = { _type: 'externalLinksList', links: [{ buttonText: '', url: '' }] }; break;
            default: return;
        }
        setBody([...body, { ...newBlock, _key: nanoid() }]);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateBlock = (index: number, newContent: any, file?: File) => {
        const newBody = [...body];
        const block = newBody[index];
        newBody[index] = { ...block, ...newContent };
        setBody(newBody);

        if (file) {
            const newFileMap = new Map(fileMap);
            newFileMap.set(block._key, file);
            setFileMap(newFileMap);
        }
    };

    const removeBlock = (index: number) => {
        const newBody = [...body];
        const blockKey = newBody[index]._key;
        newBody.splice(index, 1);
        setBody(newBody);

        if (fileMap.has(blockKey)) {
            const newFileMap = new Map(fileMap);
            newFileMap.delete(blockKey);
            setFileMap(newFileMap);
        }
    };

    // This function prepares the body data for submission without altering the component's state
    const getBodyForSubmission = () => {
        return body.map(block => {
            // If a new file is being uploaded, the API will handle it. We just remove the old asset ref.
            if (fileMap.has(block._key)) {
                // const { asset, ...rest } = block; // Commented unused variable
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { asset: _asset, ...rest } = block; // Fixed unused variable with underscore
                return rest;
            }
            // If it's a file block with an existing asset, format it as a reference.
            if (block.asset?._id && (block._type === 'imageObject' || block._type === 'posterObject' || block._type === 'pdfFile')) {
                const { asset, ...rest } = block;
                return { ...rest, asset: { _type: 'reference', _ref: asset._id } };
            }
            // Otherwise, return the block as is.
            return block;
        });
    };

    const handleShowPreview = (type: 'preview' | 'body') => {
        if (!formRef.current || !user) return;

        const formData = new FormData(formRef.current);
        const currentUserAuthor = { name: user.name, image: user.pictureURL ? { asset: { url: user.pictureURL } } : undefined };
        const selectedAuthorDetails = selectedAuthors.map(opt => {
            const authorData = availableAuthors.find(a => a._id === opt.value);
            return { name: opt.label, image: authorData?.pictureURL ? { asset: { url: authorData.pictureURL } } : undefined };
        });

        // Create a version of the body with temporary URLs for new images
        const previewBody = body.map(block => {
            if ((block._type === 'imageObject' || block._type === 'posterObject') && fileMap.has(block._key)) {
                const file = fileMap.get(block._key);
                if (file) {
                    // Create a temporary URL for the preview
                    return { ...block, asset: { url: URL.createObjectURL(file), metadata: { dimensions: { width: 800, height: 600 } } } };
                }
            }
            return block;
        });

        const constructedArticle: PreviewArticle = {
            _id: article?._id || 'new-article',
            _type: 'article',
            title: formData.get('title') as string,
            summary: formData.get('summary') as string,
            mainImage: mainImagePreview, // Use the preview URL
            youtubeVideoUrl: formData.get('youtubeVideoUrl') as string,
            hasBody: hasBody,
            buttonText: formData.get('buttonText') as string,
            authorListPrefix: formData.get('authorListPrefix') as string,
            authors: [currentUserAuthor, ...selectedAuthorDetails],
            slug: { current: slugify(title, { lower: true, strict: true }) },
            body: previewBody,
            externalLinks: externalLinks,
            // Dummy data for non-essential fields
            year: article?.year || { _id: '', _type: 'year', year: new Date().getFullYear(), title: '', slug: { current: yearSlug } },
            // Add other required fields from Article that are not in PreviewArticle with dummy data if needed
            workingGroups: [], // Example dummy data
            contentGroups: [], // Example dummy data
        };

        setPreviewData(constructedArticle);
        setPreviewType(type);
    };

    const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setMainImagePreview(URL.createObjectURL(file));
        }
    };

    const PreviewModal = () => {
        if (!previewData || !previewType) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4" onClick={() => setPreviewType(null)}>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-4xl h-full max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                    <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
                        <h3 className="text-lg font-bold">{previewType === 'preview' ? 'Article Preview' : 'Article Body Preview'}</h3>
                        <button onClick={() => setPreviewType(null)} className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 text-2xl font-bold">&times;</button>
                    </div>
                    <div className="p-6 overflow-y-auto flex-grow">
                        {previewType === 'preview' && previewData && (
                            <ArticlePreview article={previewData} yearSlug={yearSlug} imageOrder="md:order-last" textOrder="md:order-first" />
                        )}
                        {previewType === 'body' && previewData && (
                            <ArticleBody body={previewData.body || []} youtubeVideoUrl={previewData.youtubeVideoUrl} />
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="w-full max-w-4xl p-8 space-y-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
            <PreviewModal />
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">{article ? 'Edit Article' : 'Create New Article'}</h2>
                <div className="flex gap-2">
                    <button type="button" onClick={() => handleShowPreview('preview')} className="py-2 px-4 text-sm bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">
                        Show Preview
                    </button>
                    {hasBody && (
                        <button type="button" onClick={() => handleShowPreview('body')} className="py-2 px-4 text-sm bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">
                            Show Body
                        </button>
                    )}
                </div>
            </div>
            <form 
                onSubmit={(e) => {
                    // Attach the fileMap to the form element so the parent handler can access it
                    (e.currentTarget as HTMLFormElement & { fileMap: Map<string, File> }).fileMap = fileMap;
                    onSubmit(e);
                }} 
                ref={formRef} 
                className="space-y-6"
            >
                <input type="hidden" name="authors" value={JSON.stringify(selectedAuthors.map(opt => opt.value))} />
                <input type="hidden" name="workingGroups" value={JSON.stringify(selectedWGs.map(opt => opt.value))} />
                <input type="hidden" name="externalLinks" value={JSON.stringify(externalLinks)} />
                {hasBody && <input type="hidden" name="body" value={JSON.stringify(getBodyForSubmission())} />}

                <div>
                    <label className="block text-sm font-medium">Title</label>
                    <input name="title" type="text" required defaultValue={article?.title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
                </div>
                <div>
                    <label className="block text-sm font-medium">Main Cover Image</label>
                    <input name="mainImage" type="file" accept="image/*" required={!article} onChange={handleMainImageChange} className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                    {mainImagePreview ? (
                        <div className="mt-2">
                            <Image src={mainImagePreview} alt="Main image preview" width={160} height={160} className="max-h-40 rounded-md object-contain" />
                            <p className="text-xs mt-1">{article?.mainImage ? "Current image is set. Upload a new one to replace it." : "New image selected."}</p>
                        </div>
                    ) : (
                       <p className="text-xs mt-1">A cover image is required.</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium">Themes</label>
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    <Select isMulti options={wgOptions} value={selectedWGs} onChange={(selected) => setSelectedWGs(selected as any)} className="react-select-container" classNamePrefix="react-select" />
                </div>
                <div>
                    <label className="block text-sm font-medium">Additional Authors (You are automatically included)</label>
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    <Select isMulti options={authorOptions} value={selectedAuthors} onChange={(selected) => setSelectedAuthors(selected as any)} className="react-select-container" classNamePrefix="react-select" />
                </div>
                <div>
                    <label className="block text-sm font-medium">Summary</label>
                    <textarea name="summary" required defaultValue={article?.summary} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-medium">External Links (for Preview Card)</label>
                    {(externalLinks || []).map((link: { buttonText: string, url: string }, i: number) => (
                        <div key={i} className="flex items-center gap-2 p-2 border rounded-md">
                            <input type="text" placeholder="Button Text" value={link.buttonText} onChange={e => {
                                const newLinks = [...(externalLinks || [])];
                                newLinks[i] = { ...newLinks[i], buttonText: e.target.value };
                                setExternalLinks(newLinks);
                            }} className="w-1/2 bg-transparent border-b" />
                            <input type="url" placeholder="https://example.com" value={link.url} onChange={e => {
                                const newLinks = [...(externalLinks || [])];
                                newLinks[i] = { ...newLinks[i], url: e.target.value };
                                setExternalLinks(newLinks);
                            }} className="w-1/2 bg-transparent border-b" />
                            <button type="button" onClick={() => {
                                const newLinks = [...(externalLinks || [])];
                                newLinks.splice(i, 1);
                                setExternalLinks(newLinks);
                            }} className="ml-2 text-red-500 text-xs">X</button>
                        </div>
                    ))}
                    <button type="button" onClick={() => setExternalLinks([...(externalLinks || []), { buttonText: '', url: '' }])} className="text-sm text-blue-500">+ Add Link</button>
                </div>
                <div>
                    <label className="block text-sm font-medium">YouTube Video URL (Optional)</label>
                    <input name="youtubeVideoUrl" type="url" defaultValue={article?.youtubeVideoUrl || ''} placeholder="https://www.youtube.com/watch?v=..." className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
                </div>
                <div>
                    <label className="block text-sm font-medium">Author List Prefix (e.g., &quot;By&quot;)</label>
                    <input name="authorListPrefix" type="text" defaultValue={article?.authorListPrefix || 'By'} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
                </div>
                <div className="flex items-center">
                    <input name="hasBody" type="checkbox" checked={hasBody} onChange={(e) => setHasBody(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <label className="ml-2 block text-sm">Enable Full Article Page?</label>
                </div>
                {hasBody && (
                    <div className="space-y-4 p-4 border rounded-md">
                        <div>
                            <label className="block text-sm font-medium">URL Slug (auto-generated)</label>
                            <input name="slug" type="text" readOnly value={slugify(title, { lower: true, strict: true })} className="w-full px-3 py-2 border rounded-md bg-gray-100 dark:bg-gray-700 dark:border-gray-600" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Button Text</label>
                            <input name="buttonText" type="text" defaultValue={article?.buttonText || 'Read More'} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Page Content</label>
                            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                <SortableContext items={bodyIds} strategy={verticalListSortingStrategy}>
                                    <div className="space-y-3">
                                        {body.map((block, index) => (
                                            <SortableItem key={block._key} id={block._key} block={block} index={index} updateBlock={updateBlock} removeBlock={removeBlock} fileMap={fileMap} />
                                        ))}
                                    </div>
                                </SortableContext>
                            </DndContext>
                            <div className="mt-4 flex gap-2 flex-wrap">
                                <button type="button" onClick={() => addBlock('sectionTitle')} className="text-sm py-1 px-2 bg-gray-200 dark:bg-gray-600 rounded-md">+ Section Title</button>
                                <button type="button" onClick={() => addBlock('subheading')} className="text-sm py-1 px-2 bg-gray-200 dark:bg-gray-600 rounded-md">+ Subheading</button>
                                <button type="button" onClick={() => addBlock('textBlock')} className="text-sm py-1 px-2 bg-gray-200 dark:bg-gray-600 rounded-md">+ Text Block</button>
                                <button type="button" onClick={() => addBlock('list')} className="text-sm py-1 px-2 bg-gray-200 dark:bg-gray-600 rounded-md">+ List</button>
                                <button type="button" onClick={() => addBlock('imageObject')} className="text-sm py-1 px-2 bg-gray-200 dark:bg-gray-600 rounded-md">+ Image</button>
                                <button type="button" onClick={() => addBlock('posterObject')} className="text-sm py-1 px-2 bg-gray-200 dark:bg-gray-600 rounded-md">+ Poster</button>
                                <button type="button" onClick={() => addBlock('pdfFile')} className="text-sm py-1 px-2 bg-gray-200 dark:bg-gray-600 rounded-md">+ PDF</button>
                                <button type="button" onClick={() => addBlock('externalLinksList')} className="text-sm py-1 px-2 bg-gray-200 dark:bg-gray-600 rounded-md">+ External Links</button>
                            </div>
                        </div>
                    </div>
                )}
                <div className="flex gap-4 pt-4">
                    <button type="button" onClick={onCancel} className="w-full py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600" disabled={isPublishing}>Cancel</button>
                    <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center disabled:bg-blue-400" disabled={isPublishing}>
                        {isPublishing ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Publishing...
                            </>
                        ) : (
                            'Publish'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}