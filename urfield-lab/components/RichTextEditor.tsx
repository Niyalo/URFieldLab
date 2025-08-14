'use client';

import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React, { useEffect } from 'react';

// --- Types ---
interface PortableTextSpan {
  _type: 'span';
  text: string;
  marks?: string[];
}

interface PortableTextBlock {
  _type: 'block';
  style?: string;
  children: PortableTextSpan[];
  markDefs?: unknown[];
  listItem?: string;
  level?: number;
}

interface TipTapTextNode {
  type: 'text';
  text: string;
  marks?: { type: string }[];
}

interface TipTapNode {
  type: string;
  content?: (TipTapNode | TipTapTextNode)[];
  text?: string;
  marks?: { type: string }[];
}

interface TipTapDocument {
  type: 'doc';
  content: TipTapNode[];
}

// --- Data Conversion Functions ---

// Converts Sanity's Portable Text to TipTap's JSON format
const toTipTap = (blocks: PortableTextBlock[]): TipTapDocument => {
  if (!blocks || blocks.length === 0) {
    return { type: 'doc', content: [] };
  }
  const content = blocks.map(block => {
    if (block._type === 'block') {
      const blockContent = block.children.map((span: PortableTextSpan) => ({
        type: 'text',
        text: span.text,
        marks: (span.marks || []).map(mark => ({ type: mark })),
      }));
      
      // Handle lists
      if (block.listItem) {
        return {
          type: 'listItem',
          content: [{ type: 'paragraph', content: blockContent }],
        };
      }
      return { type: 'paragraph', content: blockContent };
    }
    return null;
  }).filter((item): item is NonNullable<typeof item> => !!item); // FIX: Use a type guard to remove nulls

  // Group list items
  const groupedContent = [];
  let currentList = null;

  for (const item of content) {
    if (item.type === 'listItem') {
      // This is a simplified grouping. Assumes lists are contiguous.
      if (!currentList) {
        currentList = { type: 'bulletList', content: [item] }; // Default to bullet for now
      } else {
        currentList.content.push(item);
      }
    } else {
      if (currentList) {
        groupedContent.push(currentList);
        currentList = null;
      }
      groupedContent.push(item);
    }
  }
  if (currentList) {
    groupedContent.push(currentList);
  }

  return { type: 'doc', content: groupedContent };
};

// Converts TipTap's JSON to Sanity's Portable Text format
const toPortableText = (doc: unknown): PortableTextBlock[] => {
    const document = doc as TipTapDocument;
    if (!document || !document.content) return [];
    
    const processedBlocks: PortableTextBlock[] = [];
    
    for (const node of document.content) {
        if (node.type === 'paragraph') {
            const children = (node.content || [])
                .filter((textNode): textNode is TipTapTextNode => 
                    'text' in textNode && typeof textNode.text === 'string'
                )
                .map((textNode) => ({
                    _type: 'span' as const,
                    text: textNode.text,
                    marks: (textNode.marks || []).map((mark) => mark.type),
                }));
            processedBlocks.push({ _type: 'block', style: 'normal', children, markDefs: [] });
        } else if (node.type === 'bulletList' || node.type === 'orderedList') {
            const listBlocks = (node.content || []).flatMap((listItem) => {
                if (!('content' in listItem)) return [];
                return (listItem.content || []).map((paragraph) => {
                    if (!('content' in paragraph)) {
                        return { 
                            _type: 'block' as const, 
                            style: 'normal', 
                            level: 1, 
                            listItem: node.type === 'bulletList' ? 'bullet' : 'number', 
                            children: [], 
                            markDefs: [] 
                        };
                    }
                    const children = (paragraph.content || [])
                        .filter((textNode): textNode is TipTapTextNode => 
                            'text' in textNode && typeof textNode.text === 'string'
                        )
                        .map((textNode) => ({
                            _type: 'span' as const,
                            text: textNode.text,
                            marks: (textNode.marks || []).map((mark: { type: string }) => mark.type),
                        }));
                    return {
                        _type: 'block' as const,
                        style: 'normal',
                        level: 1,
                        listItem: node.type === 'bulletList' ? 'bullet' : 'number',
                        children,
                        markDefs: [],
                    };
                });
            });
            processedBlocks.push(...listBlocks);
        }
    }
    
    return processedBlocks;
};


interface RichTextEditorProps {
  value: PortableTextBlock[] | undefined;
  onChange: (value: PortableTextBlock[]) => void;
}

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="p-2 bg-gray-100 dark:bg-gray-800 border-b dark:border-gray-600 flex gap-2 items-center flex-wrap">
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`px-2 py-1 rounded font-bold ${editor.isActive('bold') ? 'bg-blue-500 text-white' : 'bg-gray-300 dark:bg-gray-600'}`}>B</button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`px-2 py-1 rounded italic ${editor.isActive('italic') ? 'bg-blue-500 text-white' : 'bg-gray-300 dark:bg-gray-600'}`}>I</button>
      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`px-2 py-1 rounded ${editor.isActive('bulletList') ? 'bg-blue-500 text-white' : 'bg-gray-300 dark:bg-gray-600'}`}>Bullet List</button>
      <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`px-2 py-1 rounded ${editor.isActive('orderedList') ? 'bg-blue-500 text-white' : 'bg-gray-300 dark:bg-gray-600'}`}>Numbered List</button>
    </div>
  );
};

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit.configure({
        // Disable extensions you don't need to keep it simple
        heading: false,
        blockquote: false,
        codeBlock: false,
        hardBreak: false,
        horizontalRule: false,
    })],
    content: '', // We will set content manually after mount
    onUpdate: ({ editor }) => {
      const pt = toPortableText(editor.getJSON());
      onChange(pt);
    },
    // This is the fix for the SSR error
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && value) {
      const tipTapContent = toTipTap(value);
      // Only update if the content is actually different to avoid cursor jumps and infinite loops
      if (JSON.stringify(tipTapContent) !== JSON.stringify(editor.getJSON())) {
        // FIX: Use the correct options object for the second argument
        editor.commands.setContent(tipTapContent, { emitUpdate: false });
      }
    }
  }, [value, editor]);

  return (
    <div className="border rounded-md dark:border-gray-600 tiptap-editor">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} className="p-4 min-h-[150px]" />
    </div>
  );
}