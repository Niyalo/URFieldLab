import {defineField, defineType} from 'sanity'

export const article = defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'reference',
      to: [{type: 'year'}],
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'workingGroups',
      title: 'Working Groups',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: {type: 'workingGroup'},
          options: {
            // Filter to only show working groups from the selected year
            filter: ({document}) => {
              const yearRef = (document.year as {_ref?: string})?._ref
              if (!yearRef) {
                return {filter: '!defined(year)', params: {}}
              }
              return {
                filter: `year._ref == $yearRef`,
                params: {yearRef},
              }
            },
          },
        },
      ],
      validation: Rule => Rule.required().min(1).error('At least one working group is required.'),
    }),
    defineField({
      name: 'authors',
      title: 'Authors',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: {type: 'author'},
          options: {
            // Filter to only show authors from the selected year
            filter: ({document}) => {
              const yearRef = (document.year as {_ref?: string})?._ref
              if (!yearRef) {
                return {filter: '!defined(year)', params: {}}
              }
              return {
                filter: `year._ref == $yearRef`,
                params: {yearRef},
              }
            },
          },
        },
      ],
      validation: Rule => Rule.required().min(1).error('At least one author is required.'),
    }),
    defineField({
      name: 'authorListPrefix',
      title: 'Author List Prefix',
      type: 'string',
      description: 'Text to display before the list of authors (e.g., "Led by", "Created by").',
      initialValue: 'By',
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Cover Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'The primary image for the article, shown in listings.',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      description: 'A brief summary of the article, displayed on overview pages.',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'hasBody',
      title: 'Enable Full Article Page?',
      type: 'boolean',
      description: 'Turn this on to create a separate, detailed page for this article.',
      initialValue: false,
    }),
    defineField({
      name: 'buttonText',
      title: 'Button Text',
      type: 'string',
      description: 'The text for the button that links to the full article page.',
      initialValue: 'Read More',
      hidden: ({document}) => !document?.hasBody,
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      description: 'The unique URL path for the full article page.',
      hidden: ({document}) => !document?.hasBody,
      validation: Rule =>
        Rule.custom((slug, context) => {
          const hasBody = (context.document as {hasBody?: boolean})?.hasBody
          if (hasBody && !slug) {
            return 'A URL slug is required for full article pages.'
          }
          return true
        }),
    }),
    defineField({
      name: 'body',
      title: 'Page Content',
      type: 'array',
      description: 'Add and order content blocks for the full article page.',
      hidden: ({document}) => !document?.hasBody,
      of: [
        {
          name: 'subheading',
          title: 'Subheading',
          type: 'object',
          fields: [
            defineField({
              name: 'text',
              title: 'Text',
              type: 'string',
              validation: Rule => Rule.required(),
            }),
          ],
        },
        {
          name: 'textBlock',
          title: 'Text Block',
          type: 'object',
          fields: [
            defineField({
              name: 'content',
              title: 'Content',
              type: 'array',
              of: [{type: 'block'}],
            }),
          ],
        },
        {
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
        },
        {
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
        },
        {
          name: 'posterObject',
          title: 'Poster',
          type: 'image',
          description: 'A large-format image, displayed without a caption.',
        },
        {
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
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      author: 'authors.0.name',
      hasBody: 'hasBody',
    },
    prepare(selection) {
      const {author, hasBody} = selection
      const subtitles = [
        author && `by ${author}`,
        hasBody ? 'Full Page Enabled' : 'Summary Only',
      ].filter(Boolean)
      return {...selection, subtitle: subtitles.join(' | ')}
    },
  },
})