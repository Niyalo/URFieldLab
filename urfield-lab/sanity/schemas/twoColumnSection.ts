import { defineField, defineType } from "sanity";

export const twoColumnSection = defineType({
  name: 'twoColumnSection',
  title: 'Two Column Section',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Section Title',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'leftColumn',
      title: 'Left Column',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'columnText',
          title: 'Text Block',
          fields: [
            defineField({
              name: 'columnText',
              type: 'array',
              title: 'Text Content',
              description: 'Rich text content with formatting',
              of: [{ type: 'block' }],
              validation: Rule => Rule.required(),
            }),
          ],
          preview: {
            select: {
              content: 'columnText',
            },
            prepare({ content }) {
              const text = content?.[0]?.children?.[0]?.text || '';
              return {
                title: '📝 Text Block',
                subtitle: text ? `${text.substring(0, 50)}...` : 'Empty text block',
              };
            },
          },
        },
        {
          type: 'object',
          name: 'columnImage',
          title: 'Image',
          fields: [
            defineField({
              name: 'image',
              type: 'image',
              title: 'Image',
              options: {
                hotspot: true,
              },
            }),
            defineField({
              name: 'caption',
              type: 'string',
              title: 'Caption',
            }),
          ],
          preview: {
            select: {
              media: 'image',
              caption: 'caption',
            },
            prepare({ media, caption }) {
              return {
                title: '🖼️ Image',
                subtitle: caption || 'No caption',
                media,
              };
            },
          },
        },
        {
          type: 'object',
          name: 'columnButtons',
          title: 'Button List',
          fields: [
            defineField({
              name: 'links',
              title: 'Buttons',
              type: 'array',
              of: [
                {
                  type: 'object',
                  name: 'button',
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
              const buttonCount = links?.length || 0;
              const firstButton = links?.[0]?.buttonText || '';
              return {
                title: '🔘 Button List',
                subtitle: buttonCount > 0 ? 
                  `${buttonCount} button${buttonCount !== 1 ? 's' : ''} • First: "${firstButton}"` : 
                  'No buttons added',
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: 'rightColumn',
      title: 'Right Column',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'columnText',
          title: 'Text Block',
          fields: [
            defineField({
              name: 'columnText',
              type: 'array',
              title: 'Text Content',
              description: 'Rich text content with formatting',
              of: [{ type: 'block' }],
              validation: Rule => Rule.required(),
            }),
          ],
          preview: {
            select: {
              content: 'columnText',
            },
            prepare({ content }) {
              const text = content?.[0]?.children?.[0]?.text || '';
              return {
                title: '📝 Text Block',
                subtitle: text ? `${text.substring(0, 50)}...` : 'Empty text block',
              };
            },
          },
        },
        {
          type: 'object',
          name: 'columnImage',
          title: 'Image',
          fields: [
            defineField({
              name: 'image',
              type: 'image',
              title: 'Image',
              options: {
                hotspot: true,
              },
            }),
            defineField({
              name: 'caption',
              type: 'string',
              title: 'Caption',
            }),
          ],
          preview: {
            select: {
              media: 'image',
              caption: 'caption',
            },
            prepare({ media, caption }) {
              return {
                title: '🖼️ Image',
                subtitle: caption || 'No caption',
                media,
              };
            },
          },
        },
        {
          type: 'object',
          name: 'columnButtons',
          title: 'Button List',
          fields: [
            defineField({
              name: 'links',
              title: 'Buttons',
              type: 'array',
              of: [
                {
                  type: 'object',
                  name: 'button',
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
              const buttonCount = links?.length || 0;
              const firstButton = links?.[0]?.buttonText || '';
              return {
                title: '🔘 Button List',
                subtitle: buttonCount > 0 ? 
                  `${buttonCount} button${buttonCount !== 1 ? 's' : ''} • First: "${firstButton}"` : 
                  'No buttons added',
              };
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      leftItems: 'leftColumn',
      rightItems: 'rightColumn',
    },
    prepare({ title, leftItems, rightItems }) {
      const leftCount = leftItems?.length || 0;
      const rightCount = rightItems?.length || 0;
      
      return {
        title: `📑 ${title || 'Two Column Section'}`,
        subtitle: `Left: ${leftCount} items • Right: ${rightCount} items`,
      };
    },
  },
});
