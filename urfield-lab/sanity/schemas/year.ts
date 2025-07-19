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
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'year',
      media: 'logo',
    },
  },
})