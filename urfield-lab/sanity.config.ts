// sanity.config.ts

import {defineConfig} from 'sanity'
import {structureTool, StructureBuilder, DefaultDocumentNodeResolver} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {colorInput} from '@sanity/color-input'
import {schemaTypes} from './sanity/schemas'

// --- 1. DEFINE THE HIERARCHICAL STRUCTURE ---
export const myStructure = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      // A dedicated, structured view for content organized by Year
      S.listItem()
        .title('Content by Year')
        .icon(() => '📅')
        .child(
          S.documentTypeList('year')
            .title('Select a Year')
            .child((yearId) =>
              S.list()
                .title('Content for this Year')
                .items([
                  S.listItem()
                    .title('Authors')
                    .icon(() => '👥')
                    .child(
                      S.documentList()
                        .title('Authors')
                        .filter('_type == "author" && year._ref == $yearId')
                        .params({yearId})
                    ),
                  S.listItem()
                    .title('Working Groups')
                    .icon(() => '📂')
                    .child(
                      S.documentList()
                        .title('Working Groups')
                        .filter('_type == "workingGroup" && year._ref == $yearId')
                        .params({yearId})
                    ),
                  S.listItem()
                    .title('Content Groups')
                    .icon(() => '📚')
                    .child(
                      S.documentList()
                        .title('Content Groups')
                        .filter('_type == "contentGroup" && year._ref == $yearId')
                        .params({yearId})
                    ),
                  S.listItem()
                    .title('Doors')
                    .icon(() => '🚪')
                    .child(
                      S.documentList()
                        .title('Doors')
                        .filter('_type == "door" && year._ref == $yearId')
                        .params({yearId})
                    ),
                  S.listItem()
                    .title('Articles')
                    .icon(() => '📄')
                    .child(
                      S.documentList()
                        .title('Articles')
                        .filter('_type == "article" && year._ref == $yearId')
                        .params({yearId})
                    ),
                ])
            )
        ),

      S.divider(),

      // --- FIX 1: Use S.documentTypeListItem ---
      // The .items() array expects ListItemBuilders. S.documentTypeList() creates a whole pane.
      // S.documentTypeListItem() creates the correct 'ListItemBuilder' that links to a document type list.
      S.documentTypeListItem('year').title('All Years'),
      S.documentTypeListItem('author').title('All Authors'),
      S.documentTypeListItem('workingGroup').title('All Working Groups'),
      S.documentTypeListItem('contentGroup').title('All Content Groups'),
      S.documentTypeListItem('door').title('All Doors'),
      S.documentTypeListItem('article').title('All Articles'),

      ...S.documentTypeListItems().filter(
        (listItem) =>
          !['year', 'author', 'workingGroup', 'article', 'contentGroup', 'door'].includes(listItem.getId() || '')
      ),
    ])

// --- 2. DEFINE CROSS-REFERENCE VIEWS ---
export const myDefaultDocumentNode: DefaultDocumentNodeResolver = (S, {schemaType, documentId}) => {
  // For documents of type 'author', add a view to see their articles.
  if (schemaType === 'author') {
    return S.document().views([
      S.view.form(),

      // FINAL FIX: The filter now explicitly uses the `documentId` from the function's
      // context, which is passed in via the `params` object. This is the most robust way.
      S.documentList()
        .title('Articles by this Author')
        .filter('_type == "article" && $authorId in authors[]._ref')
        .params({ authorId: documentId }) as any,
    ])
  }

  // For documents of type 'workingGroup', add a view to see their articles.
  if (schemaType === 'workingGroup') {
    return S.document().views([
      S.view.form(),

      // Apply the same robust filtering pattern here.
      S.documentList()
        .title('Articles in this Group')
        .filter('_type == "article" && $workingGroupId in workingGroups[]._ref')
        .params({ workingGroupId: documentId }) as any,
    ])
  }

  // For documents of type 'contentGroup', add a view to see their articles and doors.
  if (schemaType === 'contentGroup') {
    return S.document().views([
      S.view.form(),
      S.documentList()
        .title('Content in this Group')
        .filter('_type in ["article", "door"] && $contentGroupId in contentGroups[]._ref')
        .params({ contentGroupId: documentId }) as any,
    ])
  }

  // For all other document types, just return the default form view.
  return S.document().views([S.view.form()])
}

// --- 3. CONFIGURE THE STUDIO ---
export default defineConfig({
  name: 'default',
  title: 'URField Lab',
  basePath: '/studio',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,

  plugins: [
    structureTool({
      structure: myStructure,
      defaultDocumentNode: myDefaultDocumentNode,
    }),
    visionTool(),
    colorInput(),
  ],

  schema: {
    types: schemaTypes,
  },
})