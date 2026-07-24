import React, { useEffect, useState } from "react";
import { heroSectionData } from "../constant/Constant.js";
import { useLocation, useNavigate } from "react-router-dom";
import FeaturesSection from "./FeaturesImplementation.jsx";
import TestimonialsSection from "./Testimonials.jsx";
import HowItWorksSection from "./HowToWork.jsx";
import FAQSection from "./FaqSection.jsx";

function parseRoute(projectId) {
  const str = String(projectId || "");
  const withoutTimestamp = str.replace(/-\d{13}$/, "");
  const dashIdx = withoutTimestamp.indexOf("-");
  if (!withoutTimestamp || dashIdx === -1) return null;
  return {
    origin: withoutTimestamp.slice(0, dashIdx).trim(),
    destination: withoutTimestamp.slice(dashIdx + 1).trim(),
  };
}

function HeroSection() {
  const navigate = useNavigate();
  const location = useLocation();
  const [lastPlan, setLastPlan] = useState(() => {
    try {
      const raw = localStorage.getItem("lastPlan");
      if (raw) return JSON.parse(raw);
    } catch {}
    return null;
  });

  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.slice(1);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }, [location.hash]);

  useEffect(() => {
    const handleStorage = () => {
      try {
        const raw = localStorage.getItem("lastPlan");
        setLastPlan(raw ? JSON.parse(raw) : null);
      } catch {
        setLastPlan(null);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const route = lastPlan?.projectId ? parseRoute(lastPlan.projectId) : null;
  const routeTitle = route?.origin && route?.destination
    ? `${route.origin} \u2192 ${route.destination}`
    : "Lahore \u2192 Hunza Valley";
  const routeDays = lastPlan?.tripDays || 7;

  const previewItems = [
    {
      label: "Route Distance",
      value: "Fetch from Google Maps",
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
    },
    {
      label: "Live Weather",
      value: "Fetch from OpenWeatherMap",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      ),
    },
    {
      label: "ML Cost Prediction",
      value: "Fetch from ML Model",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: "Top Hotel Match",
      value: "Fetch from Ml Model",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
  ];

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:56px_56px] opacity-40 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-100 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-100 rounded-full blur-3xl opacity-40 translate-y-1/2 -translate-x-1/3 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* ── Left: Copy ── */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full mb-6">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
                <span className="text-indigo-700 text-sm font-medium">AI-Powered Trip Planning</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6">
                Plan your{" "}
                <span className="text-indigo-600">perfect trip</span>
                {" "}with AI
              </h1>

              <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-lg">
                Share your travel preferences and our AI generates a complete personalized itinerary with real-time weather, route data, ML-powered budget predictions, and hotel recommendations.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-10">
                <button
                  onClick={() => navigate('/ai-planning')}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-indigo-200"
                >
                  Start Planning Free
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
                <button
                  onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl border border-slate-200 transition-colors"
                >
                  See how it works
                </button>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {[
                    { bg: "bg-indigo-500", letter: "A" },
                    { bg: "bg-emerald-500", letter: "B" },
                    { bg: "bg-orange-500", letter: "C" },
                    { bg: "bg-pink-500", letter: "D" },
                  ].map((a, i) => (
                    <div key={i} className={`w-8 h-8 rounded-full ${a.bg} border-2 border-white flex items-center justify-center text-white text-xs font-bold`}>
                      {a.letter}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-slate-600">
                  <span className="fontsemibold text-slate-900">5,000+</span> trips planned this month
                </p>
              </div>
            </div>

            {/* ── Right: Preview Card ── */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 to-emerald-500 px-6 py-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-indigo-100 text-xs font-semibold uppercase tracking-widest mb-1">Your AI Trip Plan</p>
                      <h3 className="text-white font-bold text-xl">{routeTitle}</h3>
                    </div>
                    <div className="bg-white/20 backdrop-blur rounded-xl px-3 py-2 text-center">
                      <p className="text-white text-lg font-bold leading-none">{routeDays}</p>
                      <p className="text-indigo-100 text-xs">Days</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  {previewItems.map((item, i) => (
                    <div key={i} className="flex items-center gap-4 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                      <div className={`w-10 h-10 rounded-lg ${item.iconBg} ${item.iconColor} flex items-center justify-center flex-shrink-0`}>
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 font-medium">{item.label}</p>
                        <p className="text-sm font-semibold text-slate-800">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="px-6 pb-6">
                  <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:bg-indigo-100 transition-colors" onClick={() => navigate('/projects')}>
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-indigo-900">Full itinerary generated</p>
                      <p className="text-xs text-indigo-500">10-section AI plan ready to view</p>
                    </div>
                    <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="absolute -top-3 -right-3 bg-white rounded-xl shadow-lg border border-slate-100 px-3 py-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-xs font-semibold text-slate-800">Live AI Analysis</span>
              </div>

              <div className="absolute -bottom-3 -left-3 bg-white rounded-xl shadow-lg border border-slate-100 px-3 py-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs font-semibold text-slate-800">ML Predictions Active</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-12 border-t border-slate-100">
            {heroSectionData.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-extrabold text-slate-900 mb-1">{stat.value}</div>
                <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <FAQSection />
    </div>
  );
}

export default HeroSection;
