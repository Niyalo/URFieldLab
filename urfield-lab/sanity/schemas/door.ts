import {defineField, defineType} from 'sanity'

export const door = defineType({
  name: 'door',
  title: 'Door',
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
      name: 'contentGroups',
      title: 'Content Groups',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: {type: 'contentGroup'},
          options: {
            // Filter to only show content groups from the selected year
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
      validation: Rule => Rule.required().min(1).error('At least one content group is required.'),
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      description: 'A brief summary, displayed on the card.',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'image',
      options: {
        accept: 'image/svg+xml',
      },
      description: 'SVG icon for the card.',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'externalLinks',
      title: 'External Links',
      type: 'array',
      description: 'Add external links that will appear as buttons.',
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
              validation: Rule => Rule.required().uri({
                scheme: ['http', 'https']
              }),
            }),
          ],
          preview: {
            select: {
              title: 'buttonText',
              subtitle: 'url'
            }
          }
        }
      ],
      validation: Rule => Rule.required().min(1).error('At least one external link is required.'),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'year.title',
      media: 'icon',
    },
  },
})