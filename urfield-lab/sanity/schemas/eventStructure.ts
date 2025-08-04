import { defineField, defineType } from "sanity";

// Reuse section types from yearTypes - we'll import the ones we need
const eventSectionTypes = [
  'sectionTitle',
  'subheading', 
  'textBlock',
  'imageObject',
  'list',
  'externalLinksList',
  'twoColumnSection'
];

export const eventStructure = defineType({
  name: 'eventStructure',
  title: 'Event Structure',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      validation: Rule => Rule.required(),
      description: 'The main title for the event structure page'
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'reference',
      to: [{ type: 'year' }],
      validation: Rule => Rule.required(),
      description: 'The year this event structure belongs to'
    }),
    defineField({
      name: 'content',
      title: 'Page Content',
      type: 'array',
      of: eventSectionTypes.map(type => ({ type })),
      description: 'Content blocks for the event structure page'
    })
  ],
  preview: {
    select: {
      title: 'title',
      year: 'year.year',
      content: 'content'
    },
    prepare({ title, year, content }) {
      const contentCount = content?.length || 0;
      return {
        title: `�️ ${title} (${year})`,
        subtitle: `${contentCount} content block${contentCount !== 1 ? 's' : ''}`
      };
    }
  }
});
