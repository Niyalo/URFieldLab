import {defineField, defineType} from 'sanity'

export const contentGroup = defineType({
  name: 'contentGroup',
  title: 'Content Group',
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
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'A number to determine the order of the content groups. Lower numbers appear first.',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'image',
      options: {
        hotspot: true,
        accept: 'image/svg+xml,image/*',
      },
      description: 'Icon for the content group (SVG recommended)',
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'status',
      media: 'icon',
      mainImage: 'mainImage',
    },
    prepare({title, subtitle, media, mainImage}) {
      return {
        title,
        subtitle,
        media: media || mainImage,
      }
    },
  },
})