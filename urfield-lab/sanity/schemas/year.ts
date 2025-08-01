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
        { type: 'videoSection' },
        { type: 'quoteSection' },
        { type: 'projectThemes' },
        { type: 'categories' },
        { type: 'featuredOutputs' },
        { type: 'logoViews' },
        { type: 'sectionTitle' },
        { type: 'subheading' },
        { type: 'textBlock' },
        { type: 'imageObject' },
        { type: 'list' },
        { type: 'posterObject' },
        { type: 'pdfFile' },
        { type: 'externalLinksList' },
        { type: 'twoColumnSection' }
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