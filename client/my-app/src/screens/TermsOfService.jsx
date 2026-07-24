import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function TermsOfService() {
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
              Terms of Service
            </span>
          </h1>

          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            These Terms of Service govern your use of AI Trip Planner. By using the platform, you agree to these terms.
          </p>

          <div className="mt-6 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-white/80 hover:bg-white border border-gray-200 rounded-xl text-gray-700 font-medium shadow-lg transition-all"
            >
              Back to Home
            </button>
            <button
              type="button"
              onClick={() => navigate("/privacy")}
              className="px-6 py-3 bg-white/80 hover:bg-white border border-gray-200 rounded-xl text-gray-700 font-medium shadow-lg transition-all"
            >
              Privacy Policy
            </button>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-green-50">
            <div className="text-sm text-gray-600">Last updated: {new Date().toLocaleDateString()}</div>
          </div>

          <div className="p-8 space-y-8 text-gray-700">
            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-800">1. Eligibility</h2>
              <p className="text-gray-600">
                You must be able to form a legally binding contract to use this platform. If you are using the platform on behalf of
                an organization, you confirm you have authority to bind that organization.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-800">2. Accounts</h2>
              <p className="text-gray-600">
                You are responsible for the accuracy of information you provide and for maintaining the confidentiality of your
                account. You are also responsible for all activity under your account.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-800">3. Platform Use</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Do not misuse the platform, attempt unauthorized access, or disrupt the service.</li>
                <li>Do not submit illegal, harmful, or infringing content.</li>
                <li>Follow applicable laws and regulations in your jurisdiction.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-800">4. AI Recommendations Disclaimer</h2>
              <p className="text-gray-600">
                AI Trip Planner provides planning outputs and recommendations based on your inputs. These outputs are for guidance
                only and may be incomplete or inaccurate. You should review recommendations and confirm details with vendors before
                making purchases or bookings.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-800">5. Vendor Links and Third Parties</h2>
              <p className="text-gray-600">
                The platform may reference or link to third-party vendors or services. We do not control third-party services and are
                not responsible for their content, pricing, availability, or performance.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-800">6. Intellectual Property</h2>
              <p className="text-gray-600">
                The platform, including design, text, logos, and software, is owned by AI Trip Planner or its licensors and is
                protected by applicable laws. You may not copy, modify, or redistribute any part of the platform without permission.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-800">7. Termination</h2>
              <p className="text-gray-600">
                We may suspend or terminate access if we believe you violated these terms or if required for security or legal reasons.
                You may stop using the platform at any time.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-800">8. Limitation of Liability</h2>
              <p className="text-gray-600">
                To the maximum extent permitted by law, AI Trip Planner is not liable for indirect, incidental, special, or
                consequential damages arising from your use of the platform or reliance on recommendations.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-800">9. Changes to Terms</h2>
              <p className="text-gray-600">
                We may update these terms from time to time. Continued use of the platform after changes means you accept the updated
                terms.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-800">10. Contact</h2>
              <p className="text-gray-600">Click get in touch button for connect</p>
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

export default TermsOfService;

