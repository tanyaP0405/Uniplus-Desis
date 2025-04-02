import React from "react";
import Container from "../components/ui/Container";

const Contact = () => {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <Container>
        <div className="max-w-3xl mx-auto">
          {/* ✅ Header */}
          <h1 className="text-3xl font-bold mb-2 text-white">Contact Us</h1>
          <p className="mb-8 text-white">We're here to help! Reach out to us anytime.</p>

          {/* ✅ Contact Methods */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-black">Support</h2>
            <p className="text-black">Email: <a href="mailto:support@uniplus.com" className="text-black hover:underline font-medium">support@uniplus.com</a></p>
            <p className="text-black">Phone: <a href="tel:+11234567890" className="text-black hover:underline font-medium">+1 (123) 456-7890</a></p>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Contact;
