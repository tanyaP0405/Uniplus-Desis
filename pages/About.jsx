import React from 'react';
import Container from '../components/ui/Container';
import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';

const About = () => {
  const teamMembers = [
    {
      name: "Suhani",
      role: "Founder",
      bio: "Manav Rachna University",
      image: "/suhani.jpg" 
    },
    {
      name: "Tanya",
      role: "Founder",
      bio: "Indian Institute of Information Technology Allahabad",
      image: "/Tan.jpg"
    },
    {
      name: "Tanu Shree",
      role: "Founder",
      bio: "Indian Institute of Technology Dhanbad",
      image: "/tanu.jpg"
    },
    {
      name: "Rupanshi Goel",
      role: "Founder",
      bio: "Indian Institute of Technology Delhi",
      image: "/rupanshi.jpg"
    }
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <Container>
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 text-white">About UniPlus</h1>
          <p className="text-lg text-white max-w-2xl mx-auto">
            We're building the digital infrastructure for modern university communities.
          </p>
        </div>
        
        {/* Our Story */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
          <div>
            <h2 className="text-2xl font-bold mb-4 text-white">Our Story</h2>
            <p className="text-white mb-4">
              We come from diverse backgrounds—some of us excel in web development, others in user experience, and a few in campus administration—and yet we share a common vision: to simplify campus life for students and staff alike. Through countless brainstorming sessions, we realized that a single integrated platform could dramatically reduce confusion and enhance campus communication. 
            </p>
            <p className="text-white mb-4">
              Thus, we combined our collective expertise to merge announcements, buy/sell, and lost & found features under one virtual roof. From the earliest mockups to final testing, we sought continuous feedback to refine each function and bolster security.
            </p>
            <p className="text-white">
              Our aim is to foster a more connected campus, where collaboration and convenience go hand in hand. By bridging gaps in communication and reducing administrative overhead, UniPlus empowers every member of the university. Ultimately, this project isn’t just a technical endeavor—it’s our commitment to creating a supportive, productive, and unified community for all.
            </p>
          </div>
          <div className="rounded-xl overflow-hidden shadow-lg">
            <img 
              src="/bkg.jpg" 
              alt="University students collaborating" 
              className="w-full h-auto"
            />
          </div>
        </div>
        
        {/* Our Mission */}
        <div className="bg-uniplus-50 rounded-xl p-8 mb-24">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4 text-white">Our Mission</h2>
            <p className="text-lg text-white">
              "To create thriving university communities by connecting people, resources, and information through intuitive digital solutions."
            </p>
          </div>
        </div>
        
        {/* Our Team */}
        <div className="mb-24">
          <h2 className="text-2xl font-bold mb-8 text-center text-white">Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <div key={member.name} className="bg-white rounded-lg shadow p-6 text-center">
                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-semibold mb-1 text-black">{member.name}</h3>
                <p className="text-sm text-uniplus-600 mb-3">{member.role}</p>
                <p className="text-sm text-black">{member.bio}</p> {/* ✅ Changed only this to black */}
              </div>
            ))}
          </div>
        </div>
        
        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-white">Join Our Community</h2>
          <p className="text-white mb-6 max-w-2xl mx-auto">
            Experience UniPlus for yourself and see how it transforms your university experience. Sign up today to connect with your campus community.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/signup">
              <Button size="lg">
                Get Started
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default About;
