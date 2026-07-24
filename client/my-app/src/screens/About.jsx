import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { heroSectionData, teamMembers, milestones } from "../constant/Constant";

const avatarColors = [
  'bg-indigo-500', 'bg-emerald-500', 'bg-orange-500', 'bg-purple-500',
];

const getInitials = (name = '') =>
  name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

const AboutPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="bg-white min-h-screen">

      {/* ── Hero Banner ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white py-24">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:56px_56px] opacity-40 pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full mb-6">
            <span className="text-indigo-700 text-sm font-medium">Our Story</span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 max-w-3xl mx-auto">
            Making travel planning <span className="text-indigo-600">effortless</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            We believe every traveler deserves a perfectly planned trip without the stress. Our AI handles the complexity so you can focus on the adventure.
          </p>
        </div>
      </section>

      {/* ── Mission & Vision ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-8 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-5">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Our Mission</h3>
              <p className="text-slate-600 leading-relaxed">
                We want to make trip planning easy, stress-free, and personal for every traveler. With smart AI, we remove confusion and help turn every detail into something truly special.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-8 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-5">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Our Vision</h3>
              <p className="text-slate-600 leading-relaxed">
                A world where every traveler can fully enjoy their trip without worrying about planning. We imagine AI as a helpful assistant, always there to make dream trips come to life.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-16 bg-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {heroSectionData.map((stat, i) => (
              <div key={i} className="text-center">
                {/* data go to constant file */}
                <div className="text-4xl font-extrabold text-white mb-1">{stat.value}</div>
                <div className="text-indigo-200 text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">Meet the team</h2>
            <p className="text-lg text-slate-600">Passionate experts combining AI innovation with travel expertise</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-center hover:shadow-md transition-all hover:-translate-y-0.5">
                <div className={`w-20 h-20 rounded-2xl ${avatarColors[index % avatarColors.length]} flex items-center justify-center mx-auto mb-4 shadow-md`}>
                  <span className="text-white text-2xl font-bold tracking-tight">{getInitials(member.name)}</span> 
                </div>
                {/* member name in constant file  */}
                <h3 className="text-base font-bold text-slate-900 mb-0.5">{member.name}</h3>
                <p className="text-indigo-600 text-sm font-medium mb-3">{member.role}</p>
                <p className="text-slate-500 text-xs leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">Our journey</h2>
            <p className="text-lg text-slate-600">Milestones that shaped our story</p>
          </div>

          <div className="relative">
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-300 via-emerald-300 to-indigo-100 md:-translate-x-px" />

            {milestones.map((milestone, index) => (
              <div key={index} className={`relative flex gap-8 mb-10 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                {/* Dot */}
                <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-5 h-5 bg-indigo-600 rounded-full border-4 border-white shadow top-5 z-10" />

                {/* Spacer (desktop only) */}
                <div className="hidden md:block flex-1" />

                {/* Card */}
                <div className="ml-14 md:ml-0 flex-1">
                  <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
                    {/* file go to for constant  */}
                    <span className="inline-block text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full mb-2">{milestone.year}</span>
                    <h3 className="text-base font-bold text-slate-900 mb-1">{milestone.title}</h3>
                    <p className="text-sm text-slate-500">{milestone.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-3xl p-12 text-center shadow-2xl shadow-indigo-200">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Ready to start your Journey?</h2>
            <p className="text-indigo-200 text-lg mb-8">Let our AI create your perfect trip plan today.</p>
            <button
              onClick={() => navigate('/ai-planning')}
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition-colors shadow-lg"
            >
              Start Planning Now
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
