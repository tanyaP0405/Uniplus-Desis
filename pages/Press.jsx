import React from "react";
import Container from "../components/ui/Container";

const Press = () => {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <Container>
        <div className="max-w-3xl mx-auto">
          {/* ✅ Header */}
          <h1 className="text-3xl font-bold mb-2 text-white">Press & Media</h1>
          <p className="mb-8 text-white">Find our latest press releases and media coverage.</p>

          {/* ✅ Press Releases */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-black">Latest News</h2>
            <p className="text-black">UniPlus is revolutionizing campus life! Contact us for press inquiries.</p>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Press;