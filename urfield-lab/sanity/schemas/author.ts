import {defineField, defineType} from 'sanity'

export const author = defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'login_name',
      title: 'Login Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'email',
      description: 'Contact email for the author',
    }),
    defineField({
      name: 'password',
      title: 'Password',
      type: 'string',
      description: 'Store the hashed password here. For internal use only.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'picture',
      title: 'Picture',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      description: 'e.g., Researcher, Coordinator',
    }),
    defineField({
      name: 'institute',
      title: 'Institute',
      type: 'string',
      description: 'Affiliated institute or organization',
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'text',
      description: "Author's biography",
    }),
    defineField({
      name: 'verified',
      title: 'Verified',
      type: 'boolean',
      description: 'Is the author verified by an admin?',
      initialValue: false,
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'reference',
      to: [{type: 'year'}],
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'email',
      media: 'picture',
    },
  },
})
