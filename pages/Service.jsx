import React from "react";
import Container from "../components/ui/Container";

const Services = () => {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <Container>
        <div className="max-w-3xl mx-auto">
          {/* ✅ Header */}
          <h1 className="text-3xl font-bold mb-2 text-black">Our Services</h1>
          <p className="mb-8 text-black">
            Explore the range of services we offer to university students and staff.
          </p>

          {/* ✅ Service Categories */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-black">Announcements</h2>
            <p className="text-black">Stay updated with the latest university news and updates.</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-black">Marketplace</h2>
            <p className="text-black">Buy and sell items securely within your university community.</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-black">Lost & Found</h2>
            <p className="text-black">Report lost items or claim found items on campus.</p>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Services;
