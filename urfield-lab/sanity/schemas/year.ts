import {defineField, defineType} from 'sanity'

export const year = defineType({
  name: 'year',
  title: 'Year',
  type: 'document',
  fields: [
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
      validation: (Rule) => Rule.required().integer().min(2000).max(2100),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'A descriptive title for the event year, e.g., "URFieldLab\'24"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'email',
      title: 'Contact Email',
      type: 'string',
      description: 'Contact email for this year/event',
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: 'facebook',
      title: 'Facebook Page Link',
      type: 'url',
      description: 'Link to the Facebook page for this year/event',
      validation: (Rule) => Rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'themeColor',
      title: 'Theme Color',
      type: 'color',
      description: 'Primary theme color for the page',
      options: {
        disableAlpha: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'pageTitle',
      title: 'Page Title',
      type: 'string',
      description: 'Main title displayed in the hero section',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Background Image',
      type: 'image',
      options: {
        hotspot: true,
        accept: 'image/*',
      },
      description: 'Background image for the hero section',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'contentDescription',
      title: 'Content Description',
      type: 'text',
      description: 'Main description text displayed below the hero section',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'keyValues',
      title: 'Key Values Section',
      type: 'object',
      description: 'Configure the four key value cards displayed in the main content area of the page',
      fields: [
        defineField({
          name: 'themes',
          title: 'Themes',
          type: 'object',
          description: 'Content for the "Themes" card - links to the "Themes" page',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              description: 'Heading text displayed on the Themes card',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              description: 'Body text displayed below the title on the Themes card',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'image',
              options: {
                accept: 'image/svg+xml,image/*',
              },
              description: 'Icon displayed at the top of the Themes card (SVG recommended)',
            }),
          ],
        }),
        defineField({
          name: 'outputs',
          title: 'Outputs',
          type: 'object',
          description: 'Content for the "Outputs" card - links to the "Outputs" page',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              description: 'Heading text displayed on the Outputs card',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              description: 'Body text displayed below the title on the Outputs card',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'image',
              options: {
                accept: 'image/svg+xml,image/*',
              },
              description: 'Icon displayed at the top of the Outputs card (SVG recommended)',
            }),
          ],
        }),
        defineField({
          name: 'people',
          title: 'People',
          type: 'object',
          description: 'Content for the "People" card - links to the "People" page',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              description: 'Heading text displayed on the People card',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              description: 'Body text displayed below the title on the People card',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'image',
              options: {
                accept: 'image/svg+xml,image/*',
              },
              description: 'Icon displayed at the top of the People card (SVG recommended)',
            }),
          ],
        }),
        defineField({
          name: 'eventStructure',
          title: 'Event Structure',
          type: 'object',
          description: 'Content for the "Event Structure" card - links to the "Event Structure" page',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              description: 'Heading text displayed on the Event Structure card',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              description: 'Body text displayed below the title on the Event Structure card',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'image',
              options: {
                accept: 'image/svg+xml,image/*',
              },
              description: 'Icon displayed at the top of the Event Structure card (SVG recommended)',
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'pageContent',
      title: 'Page Content Sections',
      type: 'array',
      description: 'Add and order content sections for the page.',
      of: [
        {
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
        },
        {
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
        },
        {
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
        },
        {
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
        },
        {
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
        },
        {
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
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'year',
      media: 'logo',
    },
  },
})