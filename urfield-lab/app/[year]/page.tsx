
import Hero from '../../components/Hero';
import ContentDescription from '../../components/ContentDescription';
import KeyValues from '../../components/KeyValues';
import VideoSection from '../../components/VideoSection';
import QuoteSection from '../../components/QuoteSection';
import ProjectThemes from '../../components/ProjectThemes';
import FeaturedOutputs from '../../components/FeaturedOutputs';
import LogoViews from '../../components/LogoViews';
import { getYearPageData, getWorkingGroups, urlFor, Year, PageContentSection } from '../../sanity/sanity-utils';

interface Props {
  params: Promise<{
    year: string;
  }>;
}

export default async function YearPage({ params }: Props) {
  const { year } = await params;
  const yearData: Year | null = await getYearPageData(year);

  if (!yearData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Year not found</h1>
          <p>The requested year data could not be found.</p>
        </div>
      </div>
    );
  }

  // Get theme color from Sanity data
  const themeColor = yearData.themeColor?.hex || "#f97316";

  // Get working groups for this year for projectThemes sections
  const workingGroups = await getWorkingGroups(yearData._id);

  // Function to render page content sections dynamically
  const renderPageSection = (section: PageContentSection, index: number) => {
    switch (section._type) {
      case 'videoSection':
        return (
          <VideoSection
            key={section._key || index}
            heading={section.heading}
            title={section.title}
            linkText={section.linkText}
            linkHref={section.linkHref}
            videoLink={section.videoLink}
            backgroundImage={section.backgroundImageURL || urlFor(section.backgroundImage).url()}
            themeColor={themeColor}
            buttonTextColor={section.buttonTextColor?.hex }
          />
        );

      case 'quoteSection':
        return (
          <QuoteSection
            key={section._key || index}
            quote={section.quote}
            backgroundImage={section.backgroundImageURL || urlFor(section.backgroundImage).url()}
            textColor={themeColor}
          />
        );

      case 'projectThemes':
        return (
          <ProjectThemes
            key={section._key || index}
            title={section.title}
            description={section.description}
            titleHref={section.titleHref || "/themes"}
            themeColor={themeColor}
            themes={workingGroups.map(workingGroup => ({
              title: workingGroup.title,
              href: `/${year}/outputs#wg-${workingGroup.slug.current}`,
              icon: workingGroup.iconURL || (workingGroup.icon ? urlFor(workingGroup.icon).url() : "")
            }))}
          />
        );

      case 'categories':
        return (
          <ProjectThemes
            key={section._key || index}
            title={section.title}
            description={section.description}
            titleHref={section.titleHref || "/themes"}
            themeColor={themeColor}
            themes={section.themes.map(theme => ({
              title: theme.title,
              href: theme.href,
              icon: theme.iconURL || (theme.icon ? urlFor(theme.icon).url() : "")
            }))}
          />
        );

      case 'featuredOutputs':
        return (
          <FeaturedOutputs
            key={section._key || index}
            title={section.title}
            themeColor={themeColor}
            outputs={section.outputs.map(output => ({
              imageUrl: output.imageURL || urlFor(output.imageUrl).url(),
              title: output.title,
              description: output.description,
              linkText: output.linkText,
              linkUrl: output.linkUrl
            }))}
          />
        );

      case 'logoViews':
        return (
          <LogoViews
            key={section._key || index}
            title={section.title}
            logos={section.logos.map(logo => ({
              imageUrl: logo.imageURL || urlFor(logo.imageUrl).url(),
              alt: logo.alt,
              linkUrl: logo.linkUrl,
              width: logo.width || 120,
              height: logo.height || 60
            }))}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="font-sans">
      {/* Hero Section */}
      <Hero 
        title={yearData.pageTitle || yearData.title}
        backgroundImage={yearData.heroImageURL || (yearData.heroImage ? urlFor(yearData.heroImage).url() : "/cropped-Week-4-6-copy3-2.jpg")}
      />

      {/* Content Description Section */}
      <ContentDescription 
        content={yearData.contentDescription || ""}
      />

      {/* Key Values Section - 4 Cards */}
      {yearData.keyValues && (
        <KeyValues 
          themesTitle={yearData.keyValues.themes?.title || "THEMES"}
          themesDescription={yearData.keyValues.themes?.description || ""}
          themesIconPath={yearData.keyValues.themes?.iconURL || (yearData.keyValues.themes?.icon ? urlFor(yearData.keyValues.themes.icon).url() : "")}
          
          outputsTitle={yearData.keyValues.outputs?.title || "OUTPUTS"}
          outputsDescription={yearData.keyValues.outputs?.description || ""}
          outputsIconPath={yearData.keyValues.outputs?.iconURL || (yearData.keyValues.outputs?.icon ? urlFor(yearData.keyValues.outputs.icon).url() : "")}
          
          peopleTitle={yearData.keyValues.people?.title || "PEOPLE"}
          peopleDescription={yearData.keyValues.people?.description || ""}
          peopleIconPath={yearData.keyValues.people?.iconURL || (yearData.keyValues.people?.icon ? urlFor(yearData.keyValues.people.icon).url() : "")}
          
          eventStructureTitle={yearData.keyValues.eventStructure?.title || "EVENT STRUCTURE"}
          eventStructureDescription={yearData.keyValues.eventStructure?.description || ""}
          eventStructureIconPath={yearData.keyValues.eventStructure?.iconURL || (yearData.keyValues.eventStructure?.icon ? urlFor(yearData.keyValues.eventStructure.icon).url() : "")}
          
          themeColor={themeColor}
          year={year}
        />
      )}

      {/* Dynamic Page Content Sections */}
      {yearData.pageContent?.map((section, index) => renderPageSection(section, index))}

      {/* Footer Section */}
      <div className="py-8 bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-white text-sm">
              © {new Date().getFullYear()} UR Field Lab &apos;{yearData.year.toString().slice(-2)}. Understanding Risk. For more information contact{' '}
              <a 
                href={`mailto:${yearData.email || 'contact@co-risk.org'}`}
                className="text-white hover:text-gray-300 underline"
              >
                {yearData.email || 'contact@co-risk.org'}
              </a>
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
