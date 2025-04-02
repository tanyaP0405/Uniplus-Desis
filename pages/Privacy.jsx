
import React from 'react';
import Container from '../components/ui/Container';

const Privacy = () => {
  return (
    <div className="min-h-screen pt-24 pb-16 text-white">
      <Container>
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: January 2024</p>
          
          <div className="prose max-w-none">
            <p className="mb-4">
              At UniPlus, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">Information We Collect</h2>
            <p className="mb-4">
              We collect information that you provide directly to us when you:
            </p>
            <ul className="list-disc pl-5 mb-4">
              <li className="mb-2">Create an account or user profile</li>
              <li className="mb-2">Post announcements, marketplace listings, or lost and found reports</li>
              <li className="mb-2">Participate in auctions or bidding</li>
              <li className="mb-2">Communicate with other users through our platform</li>
              <li className="mb-2">Contact our customer support</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">How We Use Your Information</h2>
            <p className="mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-5 mb-4">
              <li className="mb-2">Provide, maintain, and improve our services</li>
              <li className="mb-2">Facilitate transactions between users</li>
              <li className="mb-2">Communicate with you about our services, updates, and promotions</li>
              <li className="mb-2">Monitor and analyze usage patterns and trends</li>
              <li className="mb-2">Detect, prevent, and address technical issues and fraudulent activities</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">Information Sharing</h2>
            <p className="mb-4">
              We may share your information with:
            </p>
            <ul className="list-disc pl-5 mb-4">
              <li className="mb-2">Other users as necessary for the functioning of our services (e.g., connecting buyers and sellers, or people who lost items with those who found them)</li>
              <li className="mb-2">Third-party service providers who perform services on our behalf</li>
              <li className="mb-2">Law enforcement or other government agencies, as required by law</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">Data Security</h2>
            <p className="mb-4">
              We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, so we cannot guarantee absolute security.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">Your Choices</h2>
            <p className="mb-4">
              You can:
            </p>
            <ul className="list-disc pl-5 mb-4">
              <li className="mb-2">Update or correct your account information at any time</li>
              <li className="mb-2">Opt out of receiving promotional communications</li>
              <li className="mb-2">Request deletion of your account and personal information</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">Contact Us</h2>
            <p className="mb-4">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className="mb-4">
              <strong>Email:</strong> privacy@uniplus.com<br />
              <strong>Address:</strong> 123 University Way, College Town, CT 12345
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Privacy;
