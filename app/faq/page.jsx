'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import Sidebar from '@/components/Sidebar'
import umdBg from '../umd-bg.jpg'

export default function FAQPage() {
  const [user, setUser] = useState(null)
  const [openIndex, setOpenIndex] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })
    return () => unsubscribe()
  }, [])

  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          q: "What is CampusRadar?",
          a: "CampusRadar is a student-driven safety platform that allows you to report campus safety concerns quickly and anonymously. Think of it as the missing middle ground between noticing something suspicious and calling 911."
        },
        {
          q: "Who can use CampusRadar?",
          a: "Any student, faculty, or staff member with a valid UMD email address can create an account and submit reports. The platform is designed to be accessible to everyone in the UMD community."
        },
        {
          q: "Is CampusRadar official?",
          a: "CampusRadar is a student-built project created for the UMD Hackathon 2024. While not officially affiliated with the University of Maryland, it demonstrates how technology can improve campus safety through community reporting."
        }
      ]
    },
    {
      category: "Submitting Reports",
      questions: [
        {
          q: "How do I submit a report?",
          a: "Simply log in, click 'Submit Report', drop a pin on the map at the incident location, select a category (like suspicious activity or broken lighting), describe what you observed, and submit. The entire process takes less than 60 seconds."
        },
        {
          q: "Can I submit reports anonymously?",
          a: "Yes! When submitting a report, you can check the 'Submit anonymously' box. If you do this, your identity will be hidden from other users. However, if you don't check this box, your email will be visible to campus safety personnel reviewing the report."
        },
        {
          q: "What categories can I report?",
          a: "You can report: Suspicious Activity, Substance Abuse, Disorderly Conduct, Theft, Vandalism, Parking Violations, Broken Cameras, Poor Lighting, and Other. Each category helps route your report to the right team."
        },
        {
          q: "Can I add photos to my report?",
          a: "Yes! You can attach up to 3 photos (max 5MB each) to provide visual evidence. This helps authorities better understand and respond to the situation."
        },
        {
          q: "How do I set the location?",
          a: "You have three options: 1) Click directly on the map, 2) Use 'My Current Location' button to auto-detect your position, or 3) Search for a UMD building by name (like 'McKeldin Library' or 'Stamp Student Union')."
        }
      ]
    },
    {
      category: "Smart Routing System",
      questions: [
        {
          q: "How does the severity scoring work?",
          a: "Our AI-powered algorithm analyzes your report based on category, keywords in your description, time of day, and location history. It assigns a severity score from 1-10, where higher scores indicate more urgent situations."
        },
        {
          q: "Where do reports get sent?",
          a: "Reports are automatically routed based on severity: Score 8-10 goes to Emergency Services (active danger), Score 5-7 goes to UMPD (suspicious activity, theft), and Score 1-4 goes to Facilities (infrastructure issues like lighting or vandalism)."
        },
        {
          q: "What makes a report 'high severity'?",
          a: "Keywords like 'weapon', 'assault', 'threatening', combined with categories like Suspicious Activity during late hours (10 PM - 6 AM) will trigger higher severity scores and immediate routing to emergency services."
        },
        {
          q: "Can I see where my report was sent?",
          a: "Yes! After submitting, you'll receive a confirmation showing your report's severity score and which team it was routed to (Emergency/UMPD/Facilities)."
        }
      ]
    },
    {
      category: "Privacy & Safety",
      questions: [
        {
          q: "Is my data secure?",
          a: "Yes. All data is stored securely in Firebase with encryption. Only authorized admin personnel (campus safety staff) can view report details. We use UMD email authentication to ensure only verified community members can access the platform."
        },
        {
          q: "Will submitting a report get me in trouble?",
          a: "No! CampusRadar is designed for you to report concerns in good faith. As long as you're reporting genuine safety concerns (not making false reports), you won't face consequences. The goal is to keep everyone safe."
        },
        {
          q: "What if I report something by mistake?",
          a: "Contact UMPD directly to clarify. While you can't delete submitted reports (to maintain integrity), explaining the situation to authorities ensures proper handling."
        },
        {
          q: "Can I see other people's reports?",
          a: "Regular users see a safety heatmap showing general danger zones without specific details. Only admin users (authorized campus safety personnel) can see individual reports with full details."
        }
      ]
    },
    {
      category: "Features",
      questions: [
        {
          q: "What is the heatmap?",
          a: "The heatmap shows color-coded danger zones across campus. Red areas indicate higher concentrations of recent incidents, while blue/green areas are safer. This helps you make informed decisions about routes without seeing overwhelming individual markers."
        },
        {
          q: "What can admins see?",
          a: "Authorized admin users have access to a dashboard showing all individual report markers on the map, filtering options by category/status/route, severity scores, timestamps, and the ability to mark reports as resolved."
        },
        {
          q: "Can I update my profile?",
          a: "Yes! Go to the Profile page from the sidebar menu. You can update your display name and view your reporting statistics. Your email cannot be changed as it's tied to UMD authentication."
        }
      ]
    },
    {
      category: "Technical",
      questions: [
        {
          q: "What technology powers CampusRadar?",
          a: "CampusRadar is built with Next.js (React framework), Firebase (database & authentication), Leaflet (interactive maps), and uses custom algorithms for severity scoring and smart routing."
        },
        {
          q: "Why is my location sometimes inaccurate?",
          a: "Browser geolocation can be 300m-1km off when using WiFi/cell towers instead of GPS. For best accuracy, enable location services on your device or manually click on the map / search for your building by name."
        },
        {
          q: "Does this work on mobile?",
          a: "Yes! CampusRadar is fully responsive and works on phones, tablets, and desktops. The mobile experience is optimized for quick reporting on the go."
        },
        {
          q: "What browsers are supported?",
          a: "CampusRadar works on all modern browsers: Chrome, Firefox, Safari, and Edge. For best experience, use the latest version of your browser."
        }
      ]
    },
    {
      category: "Getting Help",
      questions: [
        {
          q: "What if I have a real emergency?",
          a: "ALWAYS call 911 for immediate emergencies (active crime, medical emergency, fire). CampusRadar is for reporting concerns and suspicious activity, not replacing emergency services."
        },
        {
          q: "Who do I contact for support?",
          a: "For platform issues or questions, use the feedback button in the sidebar. For safety concerns, contact UMPD at 301-405-3333. For emergencies, always call 911."
        },
        {
          q: "Can I suggest new features?",
          a: "Absolutely! We're constantly improving. Send your ideas through the feedback form or contact the development team through the UMD Hackathon organizers."
        }
      ]
    }
  ]

  return (
    <>
      <Sidebar user={user} />
      
      <div
        className="relative min-h-screen bg-fixed bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(10, 22, 40, 0.95) 100%), url(${umdBg.src})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-900/80 to-slate-900/95" />
        
        <div className="relative z-10 container mx-auto px-6 py-20">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              Frequently Asked Questions
            </h1>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              Everything you need to know about using CampusRadar
            </p>
          </div>

          {/* FAQ Sections */}
          <div className="max-w-4xl mx-auto space-y-8">
            {faqs.map((section, sectionIndex) => (
              <div
                key={sectionIndex}
                className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl border border-cyan-500/20 p-6 shadow-2xl"
              >
                <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                  {section.category}
                </h2>
                
                <div className="space-y-3">
                  {section.questions.map((item, index) => {
                    const globalIndex = `${sectionIndex}-${index}`
                    const isOpen = openIndex === globalIndex
                    
                    return (
                      <div
                        key={index}
                        className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden transition-all duration-300 hover:border-cyan-500/30"
                      >
                        <button
                          onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                          className="w-full flex items-center justify-between p-4 text-left"
                        >
                          <span className="font-semibold text-slate-100 pr-4">
                            {item.q}
                          </span>
                          <span
                            className={`text-cyan-400 text-xl transition-transform duration-300 ${
                              isOpen ? 'rotate-180' : ''
                            }`}
                          >
                            ↓
                          </span>
                        </button>
                        
                        <div
                          className={`transition-all duration-300 overflow-hidden ${
                            isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                          }`}
                        >
                          <div className="px-4 pb-4 text-slate-300 leading-relaxed border-t border-white/10 pt-4">
                            {item.a}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="max-w-3xl mx-auto mt-16 text-center bg-gradient-to-br from-cyan-900/80 via-blue-900/80 to-slate-900/80 backdrop-blur-xl rounded-2xl border border-cyan-500/30 p-10 shadow-2xl">
            <h2 className="text-2xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              Still have questions?
            </h2>
            <p className="text-slate-300 mb-6">
              Contact UMPD for safety concerns or submit feedback through the sidebar menu.
            </p>

            <Link
              href="/map"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-3 rounded-xl font-bold hover:from-cyan-400 hover:to-blue-400 transition-all duration-300 shadow-xl shadow-cyan-500/50"
            >
              Start Reporting →
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
