
import Link from 'next/link';
import Image from 'next/image';
import Hero from '../../components/Hero';
import ContentDescription from '../../components/ContentDescription';
import KeyValues from '../../components/KeyValues';

export default function Home() {
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
        
        themePrimaryColor="#f97316"
        themeSecondaryColor="#fb923c"
      />

      {/* Video Section */}
      <div 
        className="relative py-16"
        style={{
          backgroundColor: 'rgba(251, 192, 45, 0.663)'
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 shadow-lg rounded-lg overflow-hidden">
            <div className="bg-gray-900 text-white p-12 flex flex-col justify-center">
              <h5 className="text-sm font-bold mb-4 uppercase tracking-wider">What is the field lab?</h5>
              <h2 className="text-3xl lg:text-4xl font-bold mb-8 leading-tight">Check out the video to find out!</h2>
              <Link 
                href="/outputs/#headvid" 
                className="inline-flex items-center px-6 py-3 bg-orange-400 text-gray-900 rounded-md hover:bg-orange-300 transition-colors font-medium text-sm"
              >
                Want to see more? Click here for more field lab videos!
              </Link>
            </div>
            <div 
              className="relative bg-cover bg-center min-h-80 lg:min-h-full flex items-center justify-center"
              style={{
                backgroundImage: "url('https://urfieldlab.com/wp-content/uploads/2019/06/Week-4-6222.jpg')"
              }}
            >
              <div className="absolute inset-0 bg-black/40"></div>
              <div className="relative z-10">
                <Link 
                  href="https://www.youtube.com/watch?v=B39NdRehbBE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-20 h-20 bg-orange-400 text-gray-900 rounded-full hover:bg-orange-300 transition-colors"
                >
                  <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quote Section */}
      <div 
        className="relative py-20 text-white text-center bg-cover bg-center"
        style={{
          backgroundColor: '#f5fafd',
          backgroundImage: "url('https://urfieldlab.com/wp-content/uploads/2019/08/UNADJUSTEDNONRAW_thumb_b5e6.jpg')"
        }}
      >
        <div className="absolute inset-0 bg-black/80"></div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 
            className="text-2xl lg:text-4xl leading-relaxed"
            style={{
              fontFamily: 'Muli, Helvetica, Arial, sans-serif',
              fontWeight: '300'
            }}
          >
            <span className="text-orange-400">
              We believe in open space — creating a shared experience of collaboration and co-production where people of diverse disciplines and backgrounds work as equals, drive the event agenda, and share their work freely.
            </span>
          </h2>
        </div>
      </div>

      {/* Project Themes Section */}
      <div 
        className="py-16"
        style={{
          backgroundColor: 'rgba(251, 192, 45, 0.663)'
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              <Link href="/themes" className="text-gray-900 hover:text-orange-600 transition-colors">
                Project Themes
              </Link>
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Each week has several guiding themes. Attendees, however, are also encouraged to propose new themes, bring their own projects or, support the work of other participants.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Drones & 360° Camera", href: "/outputs/#head-drone", icon: "M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" },
              { title: "Mapping", href: "/outputs/#head-map", icon: "M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" },
              { title: "Sensing", href: "/outputs/#head-sens", icon: "M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" },
              { title: "Vulnerable Groups", href: "/outputs/#head-vul", icon: "M10 12a2 2 0 100-4 2 2 0 000 4z M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" },
              { title: "Nature-based Solutions", href: "/outputs/#head-nbs", icon: "M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1z" },
              { title: "Artificial Intelligence & Machine Learning", href: "/outputs/#head-ml", icon: "M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3z" },
              { title: "User-centered Design", href: "/outputs/#head-drfi", icon: "M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" },
              { title: "Risk Communications", href: "/outputs/#head-comm", icon: "M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.894A1 1 0 0018 16V3z" },
              { title: "Art & Science", href: "/outputs/#head-art", icon: "M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1z" }
            ].map((theme, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d={theme.icon} clipRule="evenodd" />
                    </svg>
                  </div>
                  <h5 className="text-lg font-semibold text-orange-600 leading-tight">
                    <Link href={theme.href} className="hover:text-orange-800 transition-colors">
                      {theme.title}
                    </Link>
                  </h5>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Outputs Section */}
      <div className="py-16 bg-[#fbc02d22]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-gray-900">Featured Outputs</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            {/* Card 1 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gray-200 bg-cover bg-center">
                <Image
                  src="/images/cropped-UNADJUSTEDNONRAW_thumb_d449.jpg"
                  alt="Living with Water in Chiang Mai"
                  width={400}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h4 className="text-xl font-semibold mb-3 text-gray-900 h-12 overflow-hidden relative" title="Living with Water in Chiang Mai">
                  <span className="line-clamp-2">
                    Living with Water in Chiang Mai
                  </span>
                </h4>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed h-32">
                  A Medium blog post discussing risk communications experiences during the field lab. It served as an entry to the #vizRisk challenge by Understanding Risk with Mapbox and the Data Visualization Society, featuring community engagement strategies.
                </p>
                <Link 
                  href="https://medium.com/ur-field-lab-chiang-mai/living-with-water-d9b671296ba6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-600 hover:text-orange-800 font-medium"
                >
                  Read the blog post
                </Link>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gray-200 bg-cover bg-center">
                <Image
                  src="/images/cropped-Screenshot-2019-07-25-at-18.30.04-2.png"
                  alt="SEADRIF User Experience Sprint"
                  width={400}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h4 className="text-xl font-semibold mb-3 text-gray-900 h-12 overflow-hidden relative" title="SEADRIF User Experience Sprint">
                  <span className="line-clamp-2">
                    SEADRIF User Experience Sprint
                  </span>
                </h4>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed h-32">
                  A user-centered design approach creating a website prototype for the SEADRIF platform. The platform informs users of real-time flood risks across Southeast Asian countries through extensive user research and testing phases.
                </p>
                <Link 
                  href="/seadrif-webpage-prototype"
                  className="text-orange-600 hover:text-orange-800 font-medium"
                >
                  Check out the prototype
                </Link>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gray-200 bg-cover bg-center">
                <Image
                  src="/images/00_Context-of-Workshop.jpg"
                  alt="Living with Water Art & Science Exhibition"
                  width={400}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h4 className="text-xl font-semibold mb-3 text-gray-900 h-12 overflow-hidden relative" title="Living with Water Art & Science Exhibition Write Up">
                  <span className="line-clamp-2">
                    Living with Water Art & Science Exhibition Write Up
                  </span>
                </h4>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed h-32">
                  Documentation of a collaborative arts workshop held June 24-28 on &ldquo;Living with Water.&rdquo; The write-up describes creative processes and outputs bringing together artists, scientists, and community members to explore urban flooding solutions.
                </p>
                <Link 
                  href="/living-with-water-art-science-workshop-and-exhibition"
                  className="text-orange-600 hover:text-orange-800 font-medium"
                >
                  Learn more
                </Link>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gray-200 bg-cover bg-center">
                <Image
                  src="/images/cropped-Screenshot-2019-07-22-at-10.17.30-PM.png"
                  alt="Field Lab Zine"
                  width={400}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h4 className="text-xl font-semibold mb-3 text-gray-900 h-12 overflow-hidden relative" title="Field Lab Zine: Deconstructed Field Lab">
                  <span className="line-clamp-2">
                    Field Lab Zine: Deconstructed Field Lab
                  </span>
                </h4>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed h-32">
                  An independently published zine created by participants to capture fun moments and collaborative spirit of the un-conference. Features illustrations, photography, interviews, and creative reflections from the field lab experience.
                </p>
                <Link 
                  href="/field-lab-zine"
                  className="text-orange-600 hover:text-orange-800 font-medium"
                >
                  Check out the Zine
                </Link>
              </div>
            </div>

            {/* Card 5 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gray-200 bg-cover bg-center">
                <Image
                  src="/images/cropped-Screenshot-2019-07-25-at-22.56.18-4.png"
                  alt="Persona Cards for Nature-based Solutions"
                  width={400}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h4 className="text-xl font-semibold mb-3 text-gray-900 h-12 overflow-hidden relative" title="Persona Cards for Nature-based Solutions">
                  <span className="line-clamp-2">
                    Persona Cards for Nature-based Solutions
                  </span>
                </h4>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed h-32">
                  Educational persona cards designed to help understand urban flooding complexities. Based on real people, animals, and environmental systems of Chiang Mai, serving as tools for stakeholders implementing flood management strategies.
                </p>
                <Link 
                  href="/persona-card-deck"
                  className="text-orange-600 hover:text-orange-800 font-medium"
                >
                  Check out the prototype
                </Link>
              </div>
            </div>

            {/* Card 6 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gray-200 bg-cover bg-center">
                <Image
                  src="/images/cropped-FB-circle-logo-e1568121369532.png"
                  alt="What is the Field Lab Video"
                  width={400}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h4 className="text-xl font-semibold mb-3 text-gray-900 h-12 overflow-hidden relative" title="What is the Field Lab?">
                  <span className="line-clamp-2">
                    What is the Field Lab?
                  </span>
                </h4>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed h-32">
                  Video featuring participants explaining the event&apos;s intent, their motivation for attending, and projects worked on during the month. Provides insights into collaborative approaches to disaster risk reduction and urban flooding challenges.
                </p>
                <Link 
                  href="https://youtu.be/Q0RTsu89kvk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-600 hover:text-orange-800 font-medium"
                >
                  Watch the video
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Organizations Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Organized by */}
          <div className="mb-12">
            <p className="text-lg font-bold text-gray-800 mb-6 text-center">Organized by:</p>
            <div className="flex justify-center">
              <div className="flex items-center justify-center p-4">
                <Link href="http://co-risk.org" target="_blank" rel="noopener noreferrer">
                  <Image
                    src="/images/CO-RISK-LABS-LOGO_BLACK.png"
                    alt="CO-RISK LABS"
                    width={200}
                    height={80}
                    className="max-w-full h-auto opacity-70 hover:opacity-100 transition-opacity"
                  />
                </Link>
              </div>
            </div>
          </div>

          {/* With support from */}
          <div>
            <p className="text-lg font-bold text-gray-800 mb-8 text-center">With support from:</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 items-center justify-items-center">
              <div className="flex items-center justify-center p-4">
                <Image
                  src="/images/drf.png"
                  alt="DRF"
                  width={120}
                  height={60}
                  className="max-w-full h-auto opacity-70 hover:opacity-100 transition-opacity"
                />
              </div>

              <div className="flex items-center justify-center p-4">
                <Image
                  src="/images/hotosm.png"
                  alt="HOT OSM"
                  width={120}
                  height={40}
                  className="max-w-full h-auto opacity-70 hover:opacity-100 transition-opacity"
                />
              </div>

              <div className="flex items-center justify-center p-4">
                <Image
                  src="/images/gfdrr.png"
                  alt="GFDRR"
                  width={120}
                  height={40}
                  className="max-w-full h-auto opacity-70 hover:opacity-100 transition-opacity"
                />
              </div>

              <div className="flex items-center justify-center p-4">
                <Image
                  src="/images/worldbank.png"
                  alt="World Bank"
                  width={120}
                  height={60}
                  className="max-w-full h-auto opacity-70 hover:opacity-100 transition-opacity"
                />
              </div>

              <div className="flex items-center justify-center p-4">
                <Image
                  src="/images/EOS_Logo_Horizontal_Colour.png"
                  alt="Earth Observation"
                  width={120}
                  height={50}
                  className="max-w-full h-auto opacity-70 hover:opacity-100 transition-opacity"
                />
              </div>

              <div className="flex items-center justify-center p-4">
                <Image
                  src="/images/nanyang.png"
                  alt="Nanyang Technological University"
                  width={120}
                  height={60}
                  className="max-w-full h-auto opacity-70 hover:opacity-100 transition-opacity"
                />
              </div>

              <div className="flex items-center justify-center p-4">
                <Image
                  src="/images/natural-capital_long.png"
                  alt="Natural Capital"
                  width={120}
                  height={50}
                  className="max-w-full h-auto opacity-70 hover:opacity-100 transition-opacity"
                />
              </div>

              <div className="flex items-center justify-center p-4">
                <Image
                  src="/images/cmu.png"
                  alt="Chiang Mai University"
                  width={120}
                  height={60}
                  className="max-w-full h-auto opacity-70 hover:opacity-100 transition-opacity"
                />
              </div>

              <div className="flex items-center justify-center p-4">
                <Image
                  src="/images/facebook_long.png"
                  alt="Facebook"
                  width={120}
                  height={50}
                  className="max-w-full h-auto opacity-70 hover:opacity-100 transition-opacity"
                />
              </div>

              <div className="flex items-center justify-center p-4">
                <Image
                  src="/images/nrf-2by1.png"
                  alt="NRF"
                  width={120}
                  height={60}
                  className="max-w-full h-auto opacity-70 hover:opacity-100 transition-opacity"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
