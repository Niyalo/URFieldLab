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
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Optional description text for the event structure page'
    }),
    defineField({
      name: 'sections',
      title: 'Page Sections',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'eventSection',
          title: 'Event Section',
          fields: [
            defineField({
              name: 'sectionTitle',
              title: 'Section Title',
              type: 'string',
              validation: Rule => Rule.required(),
              description: 'Main heading for this section'
            }),
            defineField({
              name: 'sectionId',
              title: 'Section ID',
              type: 'slug',
              description: 'URL-friendly identifier for this section (for navigation)',
              options: {
                source: 'sectionTitle',
                maxLength: 50,
              },
              validation: Rule => Rule.required()
            }),
            defineField({
              name: 'content',
              title: 'Section Content',
              type: 'array',
              of: eventSectionTypes.map(type => ({ type })),
              description: 'Content blocks for this section'
            }),
            defineField({
              name: 'subsections',
              title: 'Subsections',
              type: 'array',
              of: [
                {
                  type: 'object',
                  name: 'eventSubsection',
                  title: 'Subsection',
                  fields: [
                    defineField({
                      name: 'title',
                      title: 'Subsection Title',
                      type: 'string',
                      validation: Rule => Rule.required()
                    }),
                    defineField({
                      name: 'subsectionId',
                      title: 'Subsection ID',
                      type: 'slug',
                      description: 'URL-friendly identifier for this subsection',
                      options: {
                        source: 'title',
                        maxLength: 50,
                      },
                      validation: Rule => Rule.required()
                    }),
                    defineField({
                      name: 'content',
                      title: 'Subsection Content',
                      type: 'array',
                      of: eventSectionTypes.map(type => ({ type })),
                      description: 'Content blocks for this subsection'
                    })
                  ],
                  preview: {
                    select: {
                      title: 'title',
                      content: 'content'
                    },
                    prepare({ title, content }) {
                      const contentCount = content?.length || 0;
                      return {
                        title: `📄 ${title}`,
                        subtitle: `${contentCount} content block${contentCount !== 1 ? 's' : ''}`
                      };
                    }
                  }
                }
              ]
            })
          ],
          preview: {
            select: {
              title: 'sectionTitle',
              content: 'content',
              subsections: 'subsections'
            },
            prepare({ title, content, subsections }) {
              const contentCount = content?.length || 0;
              const subsectionCount = subsections?.length || 0;
              return {
                title: `📋 ${title}`,
                subtitle: `${contentCount} content blocks • ${subsectionCount} subsections`
              };
            }
          }
        }
      ]
    })
  ],
  preview: {
    select: {
      title: 'title',
      year: 'year.year',
      sections: 'sections'
    },
    prepare({ title, year, sections }) {
      const sectionCount = sections?.length || 0;
      return {
        title: `🗓️ ${title} (${year})`,
        subtitle: `${sectionCount} section${sectionCount !== 1 ? 's' : ''}`
      };
    }
  }
});
