import React from "react";
import Container from "../components/ui/Container";

const TermsOfService = () => {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <Container>
        <div className="max-w-3xl mx-auto">
          {/* ✅ Header */}
          <h1 className="text-3xl font-bold mb-2 text-white">Terms of Service</h1>
          <p className="mb-8 text-white">
            Please read these terms carefully before using UniPlus.
          </p>

          {/* ✅ Terms Sections */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-black">1. User Responsibilities</h2>
            <p className="text-black">
              By using UniPlus, you agree to follow our community guidelines and not engage in any misconduct.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-black">2. Privacy Policy</h2>
            <p className="text-black">
              We value your privacy. Please review our <a href="/privacy" className="text-black hover:underline">Privacy Policy</a>.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-black">3. Contact Support</h2>
            <p className="text-black">
              If you have any questions, contact us at
              <a href="mailto:support@uniplus.com" className="text-black hover:underline font-medium"> support@uniplus.com</a>.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default TermsOfService;