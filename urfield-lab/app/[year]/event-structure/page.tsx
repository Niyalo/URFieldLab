import { getYearBySlug, getEventStructureByYear, urlFor, PageContentSection } from '@/sanity/sanity-utils';
import Link from "next/link";
import Image from "next/image";
import SectionTitle from '../../../components/SectionTitle';
import Subheading from '../../../components/Subheading';
import ImageBlock from '../../../components/ImageBlock';
import ListBlock from '../../../components/ListBlock';
import TextBlockWithLinks from '../../../components/TextBlockWithLinks';
import TwoColumnSection from '../../../components/TwoColumnSection';
import { PortableText } from "@portabletext/react";

type Props = {
  params: { year: string };
};

export default async function Page({ params }: Props) {
    const { year: yearSlug } = params;
    const yearData = await getYearBySlug(yearSlug);
    const eventStructure = await getEventStructureByYear(yearSlug);
    
    // Get theme color from year data
    const themeColor = yearData.themeColor?.hex || "#f97316";

    // Function to render content sections
    const renderContentSection = (section: PageContentSection, index: number) => {
      switch (section._type) {
        case 'sectionTitle':
          return (
            <SectionTitle
              key={section._key || index}
              text={section.text}
            />
          );

        case 'subheading':
          return (
            <Subheading
              key={section._key || index}
              text={section.text}
            />
          );

        case 'textBlock':
          return section.content ? (
            <div key={section._key || index} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="prose max-w-none">
                <PortableText value={section.content} />
              </div>
            </div>
          ) : null;

        case 'imageObject':
          return (
            <ImageBlock
              key={section._key || index}
              asset={section.asset}
              caption={section.caption}
            />
          );

        case 'list':
          return (
            <ListBlock
              key={section._key || index}
              items={section.items}
            />
          );

        case 'externalLinksList':
          return (
            <TextBlockWithLinks
              key={section._key || index}
              links={section.links}
              themeColor={themeColor}
              text={section.text}
            />
          );

        case 'twoColumnSection':
          return (
            <TwoColumnSection
              key={section._key || index}
              title={section.title}
              leftColumn={section.leftColumn}
              rightColumn={section.rightColumn}
              themeColor={themeColor}
            />
          );

        default:
          return null;
      }
    };
    
    return (
      <div className="font-sans">
        {/* Hero Section */}
        <div className="relative h-64 sm:h-80 bg-gray-800">
          <Image
            src={yearData.heroImageURL || (yearData.heroImage ? urlFor(yearData.heroImage).url() : "/cropped-Week-4-6-copy3-2.jpg")}
            alt="Event Structure"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/10 flex items-center">
            <div className="text-left text-white p-8 sm:p-12">
              <h1 className="text-4xl sm:text-5xl font-bold">
                {eventStructure?.title || "Event Structure"}
              </h1>
            </div>
          </div>
        </div>

        {/* Description */}
        {eventStructure?.description && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <p className="text-lg text-gray-700">{eventStructure.description}</p>
          </div>
        )}

        {/* Navigation Menu */}
        {eventStructure?.sections && eventStructure.sections.length > 0 && (
          <div className="bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <nav className="flex flex-wrap gap-4">
                {eventStructure.sections.map((section, index) => (
                  <a
                    key={index}
                    href={`#${section.sectionId.current}`}
                    className="text-blue-600 hover:text-blue-800 font-medium py-2 px-4 rounded-md border border-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    {section.sectionTitle}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        )}

        {/* Event Structure Sections */}
        {eventStructure?.sections?.map((section, sectionIndex) => (
          <div key={sectionIndex} className="py-12">
            {/* Section Header */}
            <div id={section.sectionId.current} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {section.sectionTitle}
              </h2>
            </div>

            {/* Section Content */}
            {section.content?.map((content, contentIndex) => 
              renderContentSection(content, contentIndex)
            )}

            {/* Subsections */}
            {section.subsections?.map((subsection, subsectionIndex) => (
              <div key={subsectionIndex} className="mt-12">
                <div id={subsection.subsectionId.current} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                    {subsection.title}
                  </h3>
                </div>

                {/* Subsection Content */}
                {subsection.content?.map((content, contentIndex) => 
                  renderContentSection(content, contentIndex)
                )}
              </div>
            ))}
          </div>
        ))}

        {/* Default content if no event structure is defined */}
        {!eventStructure && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Event Structure Not Configured</h2>
              <p className="text-gray-600">
                No event structure has been configured for this year. Please add content in the Sanity Studio.
              </p>
            </div>
          </div>
        )}
      </div>
    );
}