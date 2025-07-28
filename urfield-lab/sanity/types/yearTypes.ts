import { defineField, defineType } from "sanity";

// Video Section
export const videoSection = defineType({
  name: 'videoSection',
  title: 'Video Section',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: 'Small heading text displayed above the main title',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Main title of the video section',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'linkText',
      title: 'Link Text',
      type: 'string',
      description: 'Text displayed on the call-to-action button',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'linkHref',
      title: 'Link URL',
      type: 'string',
      description: 'URL the button should navigate to',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'videoLink',
      title: 'Video URL',
      type: 'url',
      description: 'URL of the video to be embedded or linked',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Background image for the video section',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'buttonTextColor',
      title: 'Button Text Color',
      type: 'color',
      description: 'Color for button text',
      options: {
        disableAlpha: true,
      },
    }),
  ],
  preview: {
    select: {
      title: 'title',
      heading: 'heading',
      linkText: 'linkText',
      media: 'backgroundImage',
    },
    prepare({title, heading, linkText, media}) {
      return {
        title: `📹 ${title || 'Untitled Video Section'}`,
        subtitle: `${heading || ''} • Button: "${linkText || 'No button text'}"`,
        media,
      }
    },
  },
});

// Quote Section
export const quoteSection = defineType({
  name: 'quoteSection',
  title: 'Quote Section',
  type: 'object',
  fields: [
    defineField({
      name: 'quote',
      title: 'Quote Text',
      type: 'text',
      description: 'The quote text to be displayed prominently',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Background image for the quote section',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      quote: 'quote',
      media: 'backgroundImage',
    },
    prepare({quote, media}) {
      const truncatedQuote = quote ? 
        (quote.length > 60 ? `${quote.substring(0, 60)}...` : quote) : 
        'No quote text';
      return {
        title: `💬 Quote Section`,
        subtitle: `"${truncatedQuote}"`,
        media,
      }
    },
  },
});

// Project Themes Section
export const projectThemesSection = defineType({
  name: 'projectThemes',
  title: 'Project Themes',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Section Title',
      type: 'string',
      description: 'Main heading for the project themes section',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Description text displayed below the section title',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'titleHref',
      title: 'Title Link URL',
      type: 'string',
      description: 'URL for the section title link (optional)',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      description: 'description',
    },
    prepare({title, description}) {
      const truncatedDesc = description ? 
        (description.length > 50 ? `${description.substring(0, 50)}...` : description) : 
        '';
      return {
        title: `🎯 ${title || 'Project Themes'}`,
        subtitle: `Dynamic themes from Working Groups • ${truncatedDesc}`,
      }
    },
  },
});

// Categories Section
export const categoriesSection = defineType({
  name: 'categories',
  title: 'Categories',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Section Title',
      type: 'string',
      description: 'Main heading for the categories section',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Description text displayed below the section title',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'titleHref',
      title: 'Title Link URL',
      type: 'string',
      description: 'URL for the section title link (optional)',
    }),
    defineField({
      name: 'themes',
      title: 'Theme Items',
      type: 'array',
      description: 'Individual theme cards displayed in this section',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Theme Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'href',
              title: 'Link URL',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'image',
              options: {
                accept: 'image/svg+xml,image/*',
              },
              description: 'SVG or image icon for this theme',
            }),
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      description: 'description',
      themes: 'themes',
    },
    prepare({title, description, themes}) {
      const themeCount = themes ? themes.length : 0;
      const truncatedDesc = description ? 
        (description.length > 50 ? `${description.substring(0, 50)}...` : description) : 
        '';
      return {
        title: `📂 ${title || 'Categories'}`,
        subtitle: `${themeCount} theme${themeCount !== 1 ? 's' : ''} • ${truncatedDesc}`,
      }
    },
  },
});

// Featured Outputs Section
export const featuredOutputsSection = defineType({
  name: 'featuredOutputs',
  title: 'Featured Outputs',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Section Title',
      type: 'string',
      description: 'Main heading for the featured outputs section',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'outputs',
      title: 'Output Items',
      type: 'array',
      description: 'Individual output cards displayed in this section',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'imageUrl',
              title: 'Image',
              type: 'image',
              options: {
                hotspot: true,
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              validation: (Rule) => Rule.required().max(250),
              description: 'Brief description of the output item (250 characters max)',
            }),
            defineField({
              name: 'linkText',
              title: 'Link Text',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'linkUrl',
              title: 'Link URL',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      outputs: 'outputs',
    },
    prepare({title, outputs}) {
      const outputCount = outputs ? outputs.length : 0;
      const firstOutputTitle = outputs && outputs.length > 0 ? outputs[0].title : '';
      const subtitle = outputCount > 0 ? 
        `${outputCount} output${outputCount !== 1 ? 's' : ''}${firstOutputTitle ? ` • "${firstOutputTitle}"${outputCount > 1 ? '...' : ''}` : ''}` :
        'No outputs added';
      return {
        title: `📊 ${title || 'Featured Outputs'}`,
        subtitle,
      }
    },
  },
});

// Section Title
export const sectionTitleSection = defineType({
  name: 'sectionTitle',
  title: 'Section Title',
  type: 'object',
  fields: [
    defineField({
      name: 'text',
      title: 'Title Text',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: 'text' },
    prepare({ title }) {
      return { title: `Section: ${title}` };
    },
  },
});

// Subheading
export const subheadingSection = defineType({
  name: 'subheading',
  title: 'Subheading',
  type: 'object',
  fields: [
    defineField({
      name: 'text',
      title: 'Text',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { text: 'text' },
    prepare({ text }) {
      return { 
        title: '📑 Subheading',
        subtitle: text || 'No text',
      }
    },
  },
});

// Text Block
export const textBlockSection = defineType({
  name: 'textBlock',
  title: 'Text Block',
  type: 'object',
  fields: [
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        {
          type: 'block',
          marks: {
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'External link',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL'
                  },
                  {
                    name: 'target',
                    title: 'Open in new tab',
                    type: 'boolean',
                    initialValue: true
                  }
                ]
              }
            ]
          }
        }
      ],
    }),
  ],
  preview: {
    select: { content: 'content' },
    prepare({ content }) {
      const text = content?.[0]?.children?.[0]?.text || '';
      const preview = text ? 
        (text.length > 50 ? `${text.substring(0, 50)}...` : text) : 
        'No content';
      return {
        title: '📝 Text Block',
        subtitle: preview,
      }
    },
  },
});

// List
export const listBlockSection = defineType({
  name: 'list',
  title: 'List',
  type: 'object',
  fields: [
    defineField({
      name: 'items',
      title: 'List Items',
      type: 'array',
      of: [{type: 'string'}],
    }),
  ],
  preview: {
    select: { items: 'items' },
    prepare({ items }) {
      const itemCount = items?.length || 0;
      const preview = items?.[0] ? 
        (items[0].length > 40 ? `${items[0].substring(0, 40)}...` : items[0]) : 
        'Empty list';
      return {
        title: `📋 List (${itemCount} items)`,
        subtitle: preview,
      }
    },
  },
});

// Image
export const imageBlockSection = defineType({
  name: 'imageObject',
  title: 'Image',
  type: 'image',
  options: {hotspot: true},
  fields: [
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
    }),
  ],
  preview: {
    select: {
      media: 'asset',
      caption: 'caption',
    },
    prepare({ media, caption }) {
      return {
        title: '🖼️ Image',
        subtitle: caption || 'No caption',
        media,
      }
    },
  },
});

// Poster
export const posterSection = defineType({
  name: 'posterObject',
  title: 'Poster',
  type: 'image',
  description: 'A large-format image, displayed without a caption.',
  preview: {
    select: {
      media: 'asset',
    },
    prepare({ media }) {
      return {
        title: '🖼️ Poster Image',
        media,
      }
    },
  },
});

// PDF File
export const pdfFileSection = defineType({
  name: 'pdfFile',
  title: 'PDF File',
  type: 'file',
  fields: [
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
    }),
  ],
  preview: {
    select: {
      fileName: 'asset.originalFilename',
      caption: 'caption',
    },
    prepare({ fileName, caption }) {
      return {
        title: '📄 PDF File',
        subtitle: caption || fileName || 'No caption',
      }
    },
  },
});

// External Links List
export const externalLinksListSection = defineType({
  name: 'externalLinksList',
  title: 'External Links List',
  type: 'object',
  fields: [
    defineField({
      name: 'links',
      title: 'Links',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'externalLink',
          title: 'External Link',
          fields: [
            defineField({
              name: 'buttonText',
              title: 'Button Text',
              type: 'string',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: Rule => Rule.required().uri({ scheme: ['http', 'https'] }),
            }),
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      links: 'links',
    },
    prepare({ links }) {
      const linkCount = links?.length || 0;
      const firstLink = links?.[0]?.buttonText || '';
      return {
        title: `🔗 External Links (${linkCount})`,
        subtitle: firstLink ? `First link: "${firstLink}"` : 'No links added',
      }
    },
  },
});

// Logo Views Section
export const logoViewsSection = defineType({
  name: 'logoViews',
  title: 'Logo Views',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Section Title',
      type: 'string',
      description: 'Main heading for the logo section',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'logos',
      title: 'Logo Items',
      type: 'array',
      description: 'Individual logos displayed in this section',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'imageUrl',
              title: 'Logo Image',
              type: 'image',
              options: {
                hotspot: true,
                accept: 'image/svg+xml,image/*',
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'linkUrl',
              title: 'Link URL',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'width',
              title: 'Width',
              type: 'number',
              description: 'Image width in pixels',
              initialValue: 120,
            }),
            defineField({
              name: 'height',
              title: 'Height',
              type: 'number',
              description: 'Image height in pixels',
              initialValue: 60,
            }),
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      logos: 'logos',
    },
    prepare({title, logos}) {
      const logoCount = logos ? logos.length : 0;
      const firstLogoAlt = logos && logos.length > 0 ? logos[0].alt : '';
      const subtitle = logoCount > 0 ? 
        `${logoCount} logo${logoCount !== 1 ? 's' : ''}${firstLogoAlt ? ` • "${firstLogoAlt}"${logoCount > 1 ? '...' : ''}` : ''}` :
        'No logos added';
      return {
        title: `🏢 ${title || 'Logo Views'}`,
        subtitle,
      }
    },
  },
});

