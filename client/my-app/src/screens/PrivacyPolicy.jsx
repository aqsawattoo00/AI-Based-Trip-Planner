import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function PrivacyPolicy() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-500"></div>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-gradient-to-r from-blue-100 to-green-100 rounded-full border border-blue-200">
            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-green-500 rounded-full animate-pulse"></div>
            <span className="text-blue-700 font-medium">Legal</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-600 via-green-500 to-orange-500 bg-clip-text text-transparent">
              Privacy Policy
            </span>
          </h1>

          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            This Privacy Policy explains how AI Trip Planner collects, uses, and protects your information.
          </p>

          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-white/80 hover:bg-white border border-gray-200 rounded-xl text-gray-700 font-medium shadow-lg transition-all"
            >
              Back to Home
            </button>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-green-50">
            <div className="text-sm text-gray-600">Last updated: {new Date().toLocaleDateString()}</div>
          </div>

          <div className="p-8 space-y-8 text-gray-700">
            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-800">Information We Collect</h2>
              <p className="text-gray-600">
                We collect information you provide when using our platform, including account details and trip planning inputs
                (such as budget, guest count, preferences, and event details).
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Account information: name, email, and authentication-related data</li>
                <li>Planning inputs: trip preferences, timeline details, budget choices, and destination interests</li>
                <li>Technical data: device, browser, and basic usage analytics to improve performance</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-800">How We Use Your Information</h2>
              <p className="text-gray-600">We use your information to provide and improve the AI planning experience.</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Generate your trip plan and recommendations</li>
                <li>Improve product features, quality, and reliability</li>
                <li>Provide support and communicate important updates</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-800">Data Sharing</h2>
              <p className="text-gray-600">
                We do not sell your personal information. We may share limited information with trusted service providers only to
                operate the platform (for example, email delivery or hosting).
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-800">AI Processing</h2>
              <p className="text-gray-600">
                We use AI systems to generate recommendations, planning timelines, and budget suggestions based on the information you
                provide. We do not use your private trip details to publicly identify you.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Your inputs are processed to generate your planning outputs</li>
                <li>We may use aggregated and de-identified insights to improve quality and reduce errors</li>
                <li>You are responsible for reviewing AI outputs before making decisions or bookings</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-800">Cookies and Similar Technologies</h2>
              <p className="text-gray-600">
                We may use cookies and similar technologies to keep you signed in, remember preferences, and understand how the
                platform is used.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Essential cookies: required for core functionality</li>
                <li>Preference cookies: remember settings and choices</li>
                <li>Analytics: helps us improve performance and user experience</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-800">Security</h2>
              <p className="text-gray-600">
                We use industry-standard security practices to protect your data. No method of transmission or storage is 100% secure,
                but we work to safeguard your information.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-800">Third-Party Links and Vendors</h2>
              <p className="text-gray-600">
                Our platform may contain links to third-party websites or vendor services. Their privacy practices are independent of
                ours. We recommend reviewing their policies before sharing information.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-800">Retention</h2>
              <p className="text-gray-600">
                We keep your data only as long as needed to provide the service and meet legal or operational requirements.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-800">International Transfers</h2>
              <p className="text-gray-600">
                If you access the platform from outside our primary operating country, your information may be processed in locations
                where our service providers operate. We take steps to protect your information wherever it is processed.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-800">Children’s Privacy</h2>
              <p className="text-gray-600">
                AI Trip Planner is not intended for children under 13. We do not knowingly collect personal information from
                children. If you believe a child provided information, contact us and we will take appropriate action.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-800">Your Choices</h2>
              <p className="text-gray-600">
                You may update your information and manage your account. If you have questions about your data, contact us.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-800">Changes to This Policy</h2>
              <p className="text-gray-600">
                We may update this Privacy Policy from time to time. We will post the latest version here and update the “Last updated”
                date at the top of the page.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-800">Contact</h2>
              <p className="text-gray-600">
                For privacy-related questions, reach out via our Contact Us page.
              </p>
              <button
                type="button"
                onClick={() => navigate("/contact")}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-green-500 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-green-600 transition-all shadow-lg"
              >
                Contact Us
              </button>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
