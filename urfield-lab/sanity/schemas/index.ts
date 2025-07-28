import {article} from './article'
import {year} from './year'
import {author} from './author'
import {workingGroup} from './working-group'
import {contentGroup} from './content-group'
import {door} from './door'
import {
  videoSection,
  quoteSection,
  projectThemesSection,
  categoriesSection,
  featuredOutputsSection,
  logoViewsSection,
  sectionTitleSection,
  subheadingSection,
  textBlockSection,
  imageBlockSection,
  listBlockSection,
  posterSection,
  pdfFileSection,
  externalLinksListSection,
} from '../types/yearTypes'

export const schemaTypes = [
  // Documents
  article, 
  year, 
  author, 
  workingGroup, 
  contentGroup, 
  door,
  // Section Types
  videoSection,
  quoteSection,
  projectThemesSection,
  categoriesSection,
  featuredOutputsSection,
  logoViewsSection,
  sectionTitleSection,
  subheadingSection,
  textBlockSection,
  imageBlockSection,
  listBlockSection,
  posterSection,
  pdfFileSection,
  externalLinksListSection,
]
