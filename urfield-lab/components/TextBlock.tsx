'use client';

import { PortableText } from "@portabletext/react";

interface Props {
    content: any;
}

const components = {
    block: {
        h2: ({ children }: any) => <h2 className="text-2xl font-bold my-4">{children}</h2>,
        normal: ({ children }: any) => <p className="mb-4">{children}</p>,
    },
    marks: {
        link: ({ children, value }: any) => {
            const rel = value.target === '_blank' ? 'noopener noreferrer' : undefined;
            return (
                <a href={value.href} target={value.target} rel={rel} className="text-cyan-600 hover:text-cyan-800 dark:text-cyan-400 dark:hover:text-cyan-300 underline">
                    {children}
                </a>
            );
        },
    },
};

export default function TextBlock({ content }: Props) {
    return (
        <div className="prose prose-lg dark:prose-invert max-w-none">
            <PortableText value={content} components={components} />
        </div>
    );
}
