import {defineField, defineType} from 'sanity'

export const post = defineType({
  name: 'post',
  title: 'Article',
  type: 'document',
  fields: [
    defineField({
      name: 'year',
      title: 'Year',
      type: 'reference',
      to: [{type: 'year'}],
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: Rule => Rule.required(),
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
            filter: ({document}) => {
              const yearRef = (document.year as {_ref?: string})?._ref
              if (!yearRef) {
                return {
                  filter: '!defined(year)',
                  params: {},
                }
              }
              return {
                filter: `year._ref == $yearRef`,
                params: {yearRef},
              }
            },
          },
        },
      ],
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
            filter: ({document}) => {
              const yearRef = (document.year as {_ref?: string})?._ref
              if (!yearRef) {
                return {
                  filter: '!defined(year)',
                  params: {},
                }
              }
              return {
                filter: `year._ref == $yearRef`,
                params: {yearRef},
              }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        {
          type: 'block',
        },
        {
          type: 'image',
        },
      ],
    }),
  ],

  preview: {
    select: {
      title: 'title',
      author: 'authors.0.name',
      media: 'mainImage',
    },
    prepare(selection) {
      const {author} = selection
      return {...selection, subtitle: author && `by ${author}`}
    },
  },
})