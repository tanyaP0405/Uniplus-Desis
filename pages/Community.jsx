import React from "react";
import Container from "../components/ui/Container";

const CommunityGuidelines = () => {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <Container>
        <div className="max-w-3xl mx-auto">
          {/* ✅ Header */}
          <h1 className="text-3xl font-bold mb-2 text-black">Community Guidelines</h1>
          <p className="mb-8 text-black">
            These guidelines ensure a respectful and inclusive experience for all users.
          </p>

          {/* ✅ Guidelines List */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-black">General Rules</h2>
            <ul className="list-disc pl-5 text-black space-y-2">
              <li>Be respectful and inclusive in all interactions.</li>
              <li>No harassment, hate speech, or discrimination.</li>
              <li>Post only relevant and appropriate content.</li>
              <li>Respect privacy—do not share personal information.</li>
              <li>No spam, self-promotion, or fraudulent activity.</li>
              <li>Report misconduct to our support team.</li>
            </ul>
          </div>

          {/* ✅ Reporting Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-black">Report Violations</h2>
            <p className="text-black">
              If you come across any violations, please report them to our team at
              <a href="mailto:support@uniplus.com" className="text-black hover:underline font-medium"> support@uniplus.com</a>.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default CommunityGuidelines;
