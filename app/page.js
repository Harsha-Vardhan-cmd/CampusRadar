'use client'
import Link from 'next/link'
import Sidebar from '@/components/Sidebar'
import { useState, useEffect } from 'react'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'

// Background image
import umdBg from './umd-bg.jpg'
// Logo image
import logoumd from './logoumd.jpg'

export default function Home() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })
    return () => unsubscribe()
  }, [])

  return (
    <>
      <Sidebar user={user} />

      {/* Full-page wrapper with campus background */}
      <div
        className="relative min-h-screen bg-fixed bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(10, 22, 40, 0.95) 100%), url(${umdBg.src})`,
        }}
      >
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-900/80 to-slate-900/95" />

        {/* Main content */}
        <div className="relative z-10 container mx-auto px-6 py-24 flex flex-col gap-20">
          
          {/* Hero Section */}
          <section className="max-w-4xl mx-auto text-center text-white mt-10">

            {/* Logo with glow effect */}
            <div className="flex justify-center mb-10">
              <div className="relative">
                <div className="absolute inset-0 blur-2xl bg-cyan-400/30 rounded-full"></div>
                <img
                  src={logoumd.src}
                  alt="CampusRadar Logo"
                  className="relative h-90 w-auto drop-shadow-2xl"
                />
              </div>
            </div>

            {/* Gen-Z tagline with gradient */}
            <p className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 font-light tracking-wide text-lg md:text-xl mb-6">
              If it&apos;s sus, say it.
            </p>

            {/* Short description */}
            <p className="text-base md:text-lg mb-8 text-slate-200 max-w-2xl mx-auto leading-relaxed">
              A student-driven safety platform that lets you flag sketchy situations and quiet concerns
              before they turn into real problems.
            </p>

            <div className="flex gap-4 justify-center">
              <Link
                href="/map"
                className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-cyan-400 hover:to-blue-400 transition-all duration-300 shadow-xl shadow-cyan-500/50 text-base md:text-lg inline-flex items-center gap-2 transform hover:scale-105"
              >
                <span>Report an Issue</span>
                <span>→</span>
              </Link>
            </div>
          </section>

          {/* Quick Stats */}
          <section className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6 text-center text-slate-50 transform hover:scale-105 transition-transform duration-300 hover:border-cyan-400/50">
                <div className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">24/7</div>
                <p className="text-slate-300 text-sm">Always available</p>
              </div>

              <div className="bg-gradient-to-br from-blue-900/60 to-slate-900/60 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-6 text-center text-slate-50 transform hover:scale-105 transition-transform duration-300 hover:border-blue-400/50">
                <div className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">&lt;60s</div>
                <p className="text-slate-300 text-sm">Avg report time</p>
              </div>

              <div className="bg-gradient-to-br from-emerald-900/60 to-slate-900/60 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-6 text-center text-slate-50 transform hover:scale-105 transition-transform duration-300 hover:border-emerald-400/50">
                <div className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Smart</div>
                <p className="text-slate-300 text-sm">AI-powered routing</p>
              </div>
            </div>
          </section>

          {/* Problem Section */}
          <section className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <span className="text-cyan-400 font-semibold text-xs uppercase tracking-[0.25em]">
                The Challenge
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-50 mt-3">
                The Missing Middle Ground
              </h2>
            </div>

            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl border border-cyan-500/20 p-8 text-slate-100 shadow-2xl">
              <p className="text-base md:text-lg leading-relaxed mb-4 text-slate-200">
                On campus, students notice things every day — suspicious activity near dorms,
                repeated bike theft spots, poorly lit walkways, broken security cameras, or
                areas that just don&apos;t feel right.
              </p>
              <p className="text-base md:text-lg leading-relaxed text-slate-200">
                But most people won&apos;t call 911 or UMPD for something that feels &quot;small,&quot;
                so concerns are left unreported until something serious happens.{' '}
                <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                  CampusRadar fills that space between a gut feeling and an emergency call.
                </span>
              </p>
            </div>
          </section>

          {/* Solution Section */}
          <section className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <span className="text-emerald-400 font-semibold text-xs uppercase tracking-[0.25em]">
                Our Approach
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-50 mt-3">
                Three Simple Steps
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl border border-cyan-500/30 p-7 transform hover:scale-105 transition-all duration-300 hover:border-cyan-400/50 hover:shadow-xl hover:shadow-cyan-500/20">
                <div className="text-5xl mb-4">📍</div>
                <h3 className="text-xl font-semibold mb-2 text-cyan-400">Drop a pin</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Mark the exact location of your concern on an interactive UMD campus map.
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-900/80 to-slate-900/80 backdrop-blur-xl rounded-2xl border border-blue-500/30 p-7 transform hover:scale-105 transition-all duration-300 hover:border-blue-400/50 hover:shadow-xl hover:shadow-blue-500/20">
                <div className="text-5xl mb-4">📝</div>
                <h3 className="text-xl font-semibold mb-2 text-blue-400">Describe it</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Choose a clear category and share what you observed — no legal language required.
                </p>
              </div>

              <div className="bg-gradient-to-br from-amber-900/80 to-slate-900/80 backdrop-blur-xl rounded-2xl border border-amber-500/30 p-7 transform hover:scale-105 transition-all duration-300 hover:border-amber-400/50 hover:shadow-xl hover:shadow-amber-500/20">
                <div className="text-5xl mb-4">🚀</div>
                <h3 className="text-xl font-semibold mb-2 text-amber-400">We route it</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Our engine scores severity and routes reports to emergency services, UMPD, or facilities.
                </p>
              </div>
            </div>
          </section>

          {/* Severity Routing */}
          <section className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <span className="text-purple-400 font-semibold text-xs uppercase tracking-[0.25em]">
                Intelligence
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-50 mt-3">
                Smart Severity Routing
              </h2>
            </div>

            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-8 text-slate-100 shadow-2xl">
              <div className="space-y-5">
                <div className="flex items-start gap-5 p-5 rounded-xl bg-gradient-to-r from-red-900/50 to-red-800/30 border border-red-500/50 transform hover:scale-102 transition-transform">
                  <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-5 py-2 rounded-lg font-bold text-base shadow-lg">
                    8–10
                  </div>
                  <div>
                    <span className="font-bold text-red-400 text-lg">→ Emergency</span>
                    <p className="mt-1 text-base text-slate-200">
                      Weapons, assault, or active danger requiring immediate response.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-5 p-5 rounded-xl bg-gradient-to-r from-amber-900/50 to-amber-800/30 border border-amber-500/50 transform hover:scale-102 transition-transform">
                  <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 px-5 py-2 rounded-lg font-bold text-base shadow-lg">
                    5–7
                  </div>
                  <div>
                    <span className="font-bold text-amber-400 text-lg">→ UMPD</span>
                    <p className="mt-1 text-base text-slate-200">
                      Suspicious activity, substance-use issues, or theft concerns.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-5 p-5 rounded-xl bg-gradient-to-r from-emerald-900/50 to-emerald-800/30 border border-emerald-500/50 transform hover:scale-102 transition-transform">
                  <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-900 px-5 py-2 rounded-lg font-bold text-base shadow-lg">
                    1–4
                  </div>
                  <div>
                    <span className="font-bold text-emerald-400 text-lg">→ Facilities</span>
                    <p className="mt-1 text-base text-slate-200">
                      Lighting issues, vandalism, broken infrastructure, or unsafe walkways.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="max-w-3xl mx-auto">
            <div className="text-center bg-gradient-to-br from-cyan-900/80 via-blue-900/80 to-slate-900/80 backdrop-blur-xl rounded-2xl border border-cyan-500/30 p-10 text-slate-50 shadow-2xl shadow-cyan-500/20">
              <h2 className="text-2xl md:text-3xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                Ready to make campus safer?
              </h2>
              <p className="text-sm md:text-lg mb-7 text-slate-200">
                Every report — big or small — helps protect our community.
              </p>

              <Link
                href="/map"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-10 py-4 rounded-xl font-bold hover:from-cyan-400 hover:to-blue-400 transition-all duration-300 shadow-xl shadow-cyan-500/50 text-base md:text-lg transform hover:scale-105"
              >
                <span>Submit your first report</span>
                <span>→</span>
              </Link>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="relative z-10 bg-slate-950/90 backdrop-blur-xl border-t border-cyan-500/20">
          <div className="container mx-auto px-6 py-8">
            <div className="text-center mb-4 text-slate-100">
              <div className="flex justify-center mb-3">
                <img
                  src={logoumd.src}
                  alt="CampusRadar Logo"
                  className="h-16 w-auto opacity-90"
                />
              </div>
              <h3 className="text-xl font-bold mb-1 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">CampusRadar</h3>
              <p className="text-slate-400 text-sm max-w-2xl mx-auto">
                A student safety initiative helping concerns reach the right team quickly.
              </p>
            </div>

            <div className="border-t border-cyan-900/30 pt-4 text-center">
              <p className="text-slate-500 text-xs mb-1">
                Built for UMD Hackathon 2024
              </p>
              <p className="text-slate-600 text-[11px]">
                Student project · Not officially affiliated with the University of Maryland
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}