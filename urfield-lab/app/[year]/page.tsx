
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="font-sans">
      {/* Hero Section */}
      <div 
        className="relative min-h-screen bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/cropped-Week-4-6-copy3-2.jpg')`,
          backgroundColor: 'rgb(51, 51, 51)',
          paddingTop: '171.984px'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
            <h1 
              className="text-white font-light leading-tight mb-0"
              style={{
                fontFamily: 'Muli, Helvetica, Arial, sans-serif',
                fontSize: 'clamp(2.5rem, 5vw, 3.3rem)',
                lineHeight: '1.14',
                letterSpacing: '0.9px'
              }}
            >
              Understanding Risk Field Lab on Urban Flooding, Chiang Mai 2019
            </h1>
          </div>
        </div>
      </div>

      {/* Content Description Section */}
      <div className="bg-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p 
              className="text-gray-700 leading-relaxed max-w-4xl mx-auto"
              style={{
                fontSize: '1.1rem',
                lineHeight: '1.6'
              }}
            >
              A one-month long arts and technology un-conference in Chiang Mai, Thailand exploring critical design practices in disaster risk management, collaborative technology production, hacking and art. The event took place between June 2-28, 2019. The event design, outputs and participants are documented here.
            </p>
          </div>
        </div>
      </div>

      {/* Key Values Section - 4 Cards */}
      <div className="bg-white py-16 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 shadow-lg bg-white rounded-lg overflow-hidden">
            
            {/* Crossing Disciplines - Gray Background */}
            <div className="bg-gray-100 p-8 border-r border-gray-200 flex flex-col h-full">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <h5 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                  CROSSING DISCIPLINES
                </h5>
              </div>
              <div className="flex-grow">
                <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                  Artists, engineers, geographers, hydrologists, hackers, practitioners and mappers learnt about each other&apos;s methods and tools to develop deeper collaborations.
                </p>
              </div>
              <Link 
                href="/themes" 
                className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors text-sm font-medium mt-auto"
              >
                Read more
                <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>

            {/* Output Oriented - Orange Background */}
            <div className="bg-orange-500 p-8 text-white border-r border-orange-400 flex flex-col h-full">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                  </svg>
                </div>
                <h5 className="text-sm font-bold uppercase tracking-wider">
                  OUTPUT ORIENTED
                </h5>
              </div>
              <div className="flex-grow">
                <p className="text-orange-100 mb-6 text-sm leading-relaxed">
                  Make something, document what you did, and share your work. Participants developed new flood models, exhibited art projects, mapped information flows, and so much more.
                </p>
              </div>
              <Link 
                href="/outputs" 
                className="inline-flex items-center px-4 py-2 bg-orange-400 text-white rounded-md hover:bg-orange-600 transition-colors text-sm font-medium mt-auto"
              >
                Explore more
                <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>

            {/* Glocal Participation - Gray Background */}
            <div className="bg-gray-100 p-8 border-r border-gray-200 flex flex-col h-full">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h5 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                  GLOCAL PARTICIPATION
                </h5>
              </div>
              <div className="flex-grow">
                <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                  Bringing skilled and passionate collaborators everywhere from Chiang Mai to Mexico into a single space and enable meaningful participation.
                </p>
              </div>
              <Link 
                href="/people" 
                className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors text-sm font-medium mt-auto"
              >
                Explore more
                <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>

            {/* Fluid Timeframe - Orange Background */}
            <div className="bg-orange-500 p-8 text-white flex flex-col h-full">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <h5 className="text-sm font-bold uppercase tracking-wider">
                  FLUID TIMEFRAME
                </h5>
              </div>
              <div className="flex-grow">
                <p className="text-orange-100 mb-6 text-sm leading-relaxed">
                  come when you want, stay as long as you need — the field lab&apos;s timetable is defined by its participants, who self-initiate their projects and deadlines.
                </p>
              </div>
              <Link 
                href="/event-structure" 
                className="inline-flex items-center px-4 py-2 bg-orange-400 text-white rounded-md hover:bg-orange-600 transition-colors text-sm font-medium mt-auto"
              >
                Read more
                <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Video Section */}
      <div 
        className="relative py-16"
        style={{
          backgroundColor: 'rgba(251, 192, 45, 0.663)'
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 shadow-lg rounded-lg overflow-hidden">
            <div className="bg-orange-500 text-white p-12 flex flex-col justify-center">
              <h5 className="text-sm font-bold mb-4 uppercase tracking-wider">What is the field lab?</h5>
              <h2 className="text-3xl lg:text-4xl font-bold mb-8 leading-tight">Check out the video to find out!</h2>
              <Link 
                href="/outputs/#headvid" 
                className="inline-flex items-center px-6 py-3 bg-yellow-400 text-gray-900 rounded-md hover:bg-yellow-300 transition-colors font-medium text-sm"
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
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
              <div className="relative z-10">
                <Link 
                  href="https://www.youtube.com/watch?v=B39NdRehbBE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-20 h-20 bg-yellow-400 text-gray-900 rounded-full hover:bg-yellow-300 transition-colors"
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
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
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
                <h4 className="text-xl font-semibold mb-3 text-gray-900">Living with Water in Chiang Mai</h4>
                <p className="text-gray-600 mb-4 text-justify">
                  A Medium blogpost that discusses experiences in risk communications. The blog post served also as an entry to the #vizRisk challenge, organized by UR with Mapbox and the Data Visualization Society.
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
                <h4 className="text-xl font-semibold mb-3 text-gray-900">SEADRIF User Experience Sprint</h4>
                <p className="text-gray-600 mb-4">
                  A user-design approach was used to create a website prototype for the SEADRIF platform. The platform aims to inform users of real-time flood risks of participating countries.
                </p>
                <Link 
                  href="/seadrif-webpage-prototype"
                  className="text-orange-600 hover:text-orange-800 font-medium"
                >
                  Check out the prototype
                </Link>
              </div>
            </div>

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
                <h4 className="text-xl font-semibold mb-3 text-gray-900">Living with Water Art & Science Exhibition Write Up</h4>
                <p className="text-gray-600 mb-4">
                  During June 24-28, the Chiang Mai Urban Flooding Field Lab held a collaborative arts workshop on the theme &ldquo;Living with Water.&rdquo; This write up describes the process and outputs of the workshop
                </p>
                <Link 
                  href="/living-with-water-art-science-workshop-and-exhibition"
                  className="text-orange-600 hover:text-orange-800 font-medium"
                >
                  Learn more
                </Link>
              </div>
            </div>

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
                <h4 className="text-xl font-semibold mb-3 text-gray-900">Field Lab Zine: Deconstructed Field Lab</h4>
                <p className="text-gray-600 mb-4 text-justify">
                  A zine is an independently published magazine that aims to disseminate information widely through inexpensive and effective means. A group of participants came together to create a Field Lab Zine that captures the fun moments of the un-conference
                </p>
                <Link 
                  href="/field-lab-zine"
                  className="text-orange-600 hover:text-orange-800 font-medium"
                >
                  Check out the Zine
                </Link>
              </div>
            </div>

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
                <h4 className="text-xl font-semibold mb-3 text-gray-900">Persona Cards for Nature-based Solutions</h4>
                <p className="text-gray-600 mb-4 text-justify">
                  Persona cards designed to help users understand the complexities of urban flooding have been created during the workshop. These personas were based of people, animals, and environments of Chiang Mai.
                </p>
                <Link 
                  href="/persona-card-deck"
                  className="text-orange-600 hover:text-orange-800 font-medium"
                >
                  Check out the prototype
                </Link>
              </div>
            </div>

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
                <h4 className="text-xl font-semibold mb-3 text-gray-900">What is the Field Lab?</h4>
                <p className="text-gray-600 mb-4 text-justify">
                  In this video participants explain the intent behind the event, their motivation for attending and some of the projects they worked on over the course of the month. Watch this video to learn more about the event and its sponsors.
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
