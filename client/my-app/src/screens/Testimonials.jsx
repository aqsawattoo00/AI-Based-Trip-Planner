import React, { useEffect, useState } from 'react';
import { useGetTestimonials } from '../hooks/hooks.js';

const StarRating = ({ count = 5 }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < count ? 'text-amber-400' : 'text-slate-200'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

const avatarColors = [
  'bg-indigo-500', 'bg-emerald-500', 'bg-orange-500',
  'bg-purple-500', 'bg-rose-500', 'bg-cyan-500',
];

const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { data } = useGetTestimonials();
  const testimonials = Array.isArray(data) ? data : [];
  const safeIndex = testimonials.length ? activeIndex % testimonials.length : 0;

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const prev = () => {
    if (!testimonials.length) return;
    setActiveIndex((p) => (p - 1 + testimonials.length) % testimonials.length);
  };
  const next = () => {
    if (!testimonials.length) return;
    setActiveIndex((p) => (p + 1) % testimonials.length);
  };

  const getInitials = (name = '') =>
    name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <section id="testimonials" className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-100 rounded-full mb-4">
            <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-amber-700 text-sm font-medium">Traveler Reviews</span>
          </div>
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Loved by thousands of travelers
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            See what our community says about their AI-planned trips across Pakistan.
          </p>
        </div>

        {testimonials.length ? (
          <div className="max-w-3xl mx-auto">
            <div className="relative bg-white rounded-2xl border border-slate-100 shadow-lg p-8 md:p-12">
              {/* Quote mark */}
              <svg className="absolute top-8 left-8 w-10 h-10 text-indigo-100" fill="currentColor" viewBox="0 0 32 32">
                <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
              </svg>

              <div className="flex flex-col items-center text-center pt-4">
                <StarRating count={5} />
                <p className="text-slate-700 text-lg leading-relaxed mt-6 mb-8 italic max-w-xl">
                  "{testimonials[safeIndex]?.message}"
                </p>

                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full ${avatarColors[safeIndex % avatarColors.length]} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                    {getInitials(testimonials[safeIndex]?.name)}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-slate-900 text-sm">{testimonials[safeIndex]?.name}</p>
                    <p className="text-slate-400 text-xs">{testimonials[safeIndex]?.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={prev}
                disabled={!testimonials.length}
                className="w-10 h-10 rounded-full border border-slate-200 bg-white shadow-sm flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition-colors disabled:opacity-40"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <div className="flex gap-2">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveIndex(idx)}
                    className={`rounded-full transition-all duration-300 ${
                      idx === safeIndex ? 'w-6 h-2 bg-indigo-600' : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={next}
                disabled={!testimonials.length}
                className="w-10 h-10 rounded-full border border-slate-200 bg-white shadow-sm flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition-colors disabled:opacity-40"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-lg mx-auto bg-slate-50 border border-slate-100 rounded-2xl p-12 text-center">
            <svg className="w-12 h-12 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-slate-500 font-medium">No testimonials yet.</p>
            <a href="/create-testimonials" className="inline-block mt-4 text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              Be the first to share your experience →
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;
