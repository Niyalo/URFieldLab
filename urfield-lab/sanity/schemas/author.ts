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
      validation: (Rule) =>
        Rule.required().custom(async (loginName, context) => {
          const {getClient, document} = context
          // If we don't have the document context, we can't perform validation
          if (!document) {
            return true
          }
          // Add a type assertion for the year field
          const yearRef = (document.year as { _ref?: string })?._ref

          if (!yearRef || !loginName) {
            return true // Let the required rule handle empty fields
          }
          const client = getClient({apiVersion: '2024-01-01'})
          const params = {
            loginName,
            yearRef: yearRef,
            documentId: document._id.replace('drafts.', ''),
          }
          const query = `!defined(*[_type == "author" && login_name == $loginName && year._ref == $yearRef && _id != $documentId][0]._id)`
          const isUnique = await client.fetch(query, params)

          return isUnique ? true : 'Login name must be unique for this year.'
        }),
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
      name: 'isAdmin',
      title: 'Is Admin',
      type: 'boolean',
      description: 'Admins have extra permissions in the dashboard.',
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
