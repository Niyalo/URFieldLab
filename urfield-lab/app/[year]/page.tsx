
import Hero from '../../components/Hero';
import ContentDescription from '../../components/ContentDescription';
import KeyValues from '../../components/KeyValues';
import VideoSection from '../../components/VideoSection';
import QuoteSection from '../../components/QuoteSection';
import ProjectThemes from '../../components/ProjectThemes';
import FeaturedOutputs from '../../components/FeaturedOutputs';
import LogoViews from '../../components/LogoViews';

export default function Home() {
  // Theme color configuration
  const themeColor = "#f97316";

  return (
    <div className="font-sans">
      {/* Hero Section */}
      <Hero 
        title="Understanding Risk Field Lab on Urban Flooding, Chiang Mai 2019"
        backgroundImage="/cropped-Week-4-6-copy3-2.jpg"
      />

      {/* Content Description Section */}
      <ContentDescription 
        content="A one-month long arts and technology un-conference in Chiang Mai, Thailand exploring critical design practices in disaster risk management, collaborative technology production, hacking and art. The event took place between June 2-28, 2019. The event design, outputs and participants are documented here."
      />

      {/* Key Values Section - 4 Cards */}
      <KeyValues 
        themesTitle="CROSSING DISCIPLINES"
        themesDescription="Artists, engineers, geographers, hydrologists, hackers, practitioners and mappers learnt about each other's methods and tools to develop deeper collaborations."
        themesIconPath="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"
        
        outputsTitle="OUTPUT ORIENTED"
        outputsDescription="Make something, document what you did, and share your work. Participants developed new flood models, exhibited art projects, mapped information flows, and so much more."
        outputsIconPath="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"
        
        peopleTitle="GLOCAL PARTICIPATION"
        peopleDescription="Bringing skilled and passionate collaborators everywhere from Chiang Mai to Mexico into a single space and enable meaningful participation."
        peopleIconPath="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        
        eventStructureTitle="FLUID TIMEFRAME"
        eventStructureDescription="come when you want, stay as long as you need — the field lab's timetable is defined by its participants, who self-initiate their projects and deadlines."
        eventStructureIconPath="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"
        
        themeColor={themeColor}
      />

      {/* Video Section */}
      <VideoSection 
        heading="What is the field lab?"
        title="Check out the video to find out!"
        linkText="Want to see more? Click here for more field lab videos!"
        linkHref="/outputs/#headvid"
        videoLink="https://www.youtube.com/watch?v=B39NdRehbBE"
        backgroundImage="https://urfieldlab.com/wp-content/uploads/2019/06/Week-4-6222.jpg"
        themeColor={themeColor}
        buttonTextColor="#1f2937"
      />

      {/* Quote Section */}
      <QuoteSection 
        quote="We believe in open space — creating a shared experience of collaboration and co-production where people of diverse disciplines and backgrounds work as equals, drive the event agenda, and share their work freely."
        backgroundImage="https://urfieldlab.com/wp-content/uploads/2019/08/UNADJUSTEDNONRAW_thumb_b5e6.jpg"
        textColor={themeColor}
      />

      {/* Project Themes Section */}
      <ProjectThemes 
        title="Project Themes"
        description="Each week has several guiding themes. Attendees, however, are also encouraged to propose new themes, bring their own projects or, support the work of other participants."
        titleHref="/themes"
        themeColor={themeColor}
        themes={[
          { title: "Drones & 360° Camera", href: "/outputs/#head-drone", icon: "M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" },
          { title: "Mapping", href: "/outputs/#head-map", icon: "M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" },
          { title: "Sensing", href: "/outputs/#head-sens", icon: "M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" },
          { title: "Vulnerable Groups", href: "/outputs/#head-vul", icon: "M10 12a2 2 0 100-4 2 2 0 000 4z M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" },
          { title: "Nature-based Solutions", href: "/outputs/#head-nbs", icon: "M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1z" },
          { title: "Artificial Intelligence & Machine Learning", href: "/outputs/#head-ml", icon: "M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3z" },
          { title: "User-centered Design", href: "/outputs/#head-drfi", icon: "M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" },
          { title: "Risk Communications", href: "/outputs/#head-comm", icon: "M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.894A1 1 0 0018 16V3z" },
          { title: "Art & Science", href: "/outputs/#head-art", icon: "M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1z" }
        ]}
      />

      {/* Featured Outputs Section */}
      <FeaturedOutputs 
        title="Featured Outputs"
        themeColor={themeColor}
        outputs={[
          {
            imageUrl: "/images/cropped-UNADJUSTEDNONRAW_thumb_d449.jpg",
            title: "Living with Water in Chiang Mai",
            description: "A Medium blog post discussing risk communications experiences during the field lab. It served as an entry to the #vizRisk challenge by Understanding Risk with Mapbox and the Data Visualization Society, featuring community engagement strategies.",
            linkText: "Read the blog post",
            linkUrl: "https://medium.com/ur-field-lab-chiang-mai/living-with-water-d9b671296ba6"
          },
          {
            imageUrl: "/images/cropped-Screenshot-2019-07-25-at-18.30.04-2.png",
            title: "SEADRIF User Experience Sprint",
            description: "A user-centered design approach creating a website prototype for the SEADRIF platform. The platform informs users of real-time flood risks across Southeast Asian countries through extensive user research and testing phases.",
            linkText: "Check out the prototype",
            linkUrl: "/seadrif-webpage-prototype"
          },
          {
            imageUrl: "/images/00_Context-of-Workshop.jpg",
            title: "Living with Water Art & Science Exhibition Write Up",
            description: "Documentation of a collaborative arts workshop held June 24-28 on \"Living with Water.\" The write-up describes creative processes and outputs bringing together artists, scientists, and community members to explore urban flooding solutions.",
            linkText: "Learn more",
            linkUrl: "/living-with-water-art-science-workshop-and-exhibition"
          },
          {
            imageUrl: "/images/cropped-Screenshot-2019-07-22-at-10.17.30-PM.png",
            title: "Field Lab Zine: Deconstructed Field Lab",
            description: "An independently published zine created by participants to capture fun moments and collaborative spirit of the un-conference. Features illustrations, photography, interviews, and creative reflections from the field lab experience.",
            linkText: "Check out the Zine",
            linkUrl: "/field-lab-zine"
          },
          {
            imageUrl: "/images/cropped-Screenshot-2019-07-25-at-22.56.18-4.png",
            title: "Persona Cards for Nature-based Solutions",
            description: "Educational persona cards designed to help understand urban flooding complexities. Based on real people, animals, and environmental systems of Chiang Mai, serving as tools for stakeholders implementing flood management strategies.",
            linkText: "Check out the prototype",
            linkUrl: "/persona-card-deck"
          },
          {
            imageUrl: "/images/cropped-FB-circle-logo-e1568121369532.png",
            title: "What is the Field Lab?",
            description: "Video featuring participants explaining the event's intent, their motivation for attending, and projects worked on during the month. Provides insights into collaborative approaches to disaster risk reduction and urban flooding challenges.",
            linkText: "Watch the video",
            linkUrl: "https://youtu.be/Q0RTsu89kvk"
          }
        ]}
      />

      {/* Organized by Section */}
      <LogoViews 
        title="Organized by:"
        logos={[
          {
            imageUrl: "/images/CO-RISK-LABS-LOGO_BLACK.png",
            alt: "CO-RISK LABS",
            linkUrl: "http://co-risk.org",
            width: 200,
            height: 80
          }
        ]}
      />

      {/* With support from Section */}
      <LogoViews 
        title="With support from:"
        logos={[
          {
            imageUrl: "/images/drf.png",
            alt: "Disater Risk Financing and Insurance Program World Bank Group",
            linkUrl: "https://www.worldbank.org/en/programs/disaster-risk-financing-and-insurance-program",
            width: 120,
            height: 60
          },
          {
            imageUrl: "/images/hotosm.png",
            alt: "HOT OSM - Humanitarian OpenStreetMap Team",
            linkUrl: "https://www.hotosm.org/",
            width: 120,
            height: 40
          },
          {
            imageUrl: "/images/gfdrr.png",
            alt: "Global Facility for Disaster Reduction and Recovery (GFDRR)",
            linkUrl: "https://www.gfdrr.org/",
            width: 120,
            height: 40
          },
          {
            imageUrl: "/images/worldbank.png",
            alt: "World Bank",
            linkUrl: "https://www.worldbank.org/",
            width: 120,
            height: 60
          },
          {
            imageUrl: "/images/EOS_Logo_Horizontal_Colour.png",
            alt: "Earth Observatory of Singapore",
            linkUrl: "https://earthobservatory.sg/",
            width: 120,
            height: 50
          },
          {
            imageUrl: "/images/nanyang.png",
            alt: "Nanyang Technological University - NTU Singapore",
            linkUrl: "https://www.ntu.edu.sg/",
            width: 120,
            height: 60
          },
          {
            imageUrl: "/images/natural-capital_long.png",
            alt: "Natural Capital Project",
            linkUrl: "https://naturalcapitalproject.stanford.edu/",
            width: 120,
            height: 50
          },
          {
            imageUrl: "/images/cmu.png",
            alt: "Chiang Mai University",
            linkUrl: "https://www.cmu.ac.th/",
            width: 120,
            height: 60
          },
          {
            imageUrl: "/images/facebook_long.png",
            alt: "Facebook",
            linkUrl: "https://www.facebook.com/",
            width: 120,
            height: 50
          },
          {
            imageUrl: "/images/nrf-2by1.png",
            alt: "National Research Foundation, Singapore (NRF)",
            linkUrl: "https://www.nrf.gov.sg/",
            width: 120,
            height: 60
          }
        ]}
      />

      {/* Footer Section */}
      <div className="py-8 bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-white text-sm">
              © {new Date().getFullYear()} UR Field Lab &apos;19. Understanding Risk. For more information contact{' '}
              <a 
                href="mailto:floodlab2019@co-risk.org" 
                className="text-white hover:text-gray-300 underline"
              >
                floodlab2019@co-risk.org
              </a>
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
