import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Particles from "react-tsparticles";
import announcementsImg from "../assets/announcement.jpg";
import marketplaceImg from "../assets/marketplace.jpg";
import lostFoundImg from "../assets/lostfound.jpg";
import testimonialImg from "../assets/testimonial.jpg";
import notesImg from "../assets/pencil.jpg";
// 🎨 Dynamic theme backgrounds
const themes = [
  "bg-gradient-to-r from-purple-500 to-pink-500",
  "bg-gradient-to-r from-green-400 to-blue-500",
  "bg-gradient-to-r from-orange-400 to-red-500",
  "bg-gradient-to-r from-indigo-400 to-purple-500",
];

const Index = () => {
  const [theme, setTheme] = useState("");

  useEffect(() => {
    setTheme(themes[Math.floor(Math.random() * themes.length)]); // Random theme on load
  }, []);

  return (
    <div className={`min-h-screen text-gray-900 font-sans ${theme} transition-all duration-500`}>
      {/* ✅ Navbar */}
      <nav className="navbar p-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white py-2 px-6 rounded-lg shadow-lg">
          Uni<span className="text-yellow-300">+</span>
        </h1>
      </nav>

      {/* ✅ Hero Section */}
      <header className="hero-section relative text-white text-center py-16">
        {/* 🔥 Floating Particles */}
        <Particles
          className="absolute inset-0"
          options={{
            background: { color: "transparent" },
            particles: {
              number: { value: 80 },
              color: { value: "#ffffff" },
              shape: { type: "circle" },
              opacity: { value: 0.4 },
              size: { value: 3 },
              move: { enable: true, speed: 1 },
            },
          }}
        />

        {/* 🌟 Hero Content */}
        <div className="relative z-10 animate-fade-in">
          <h2 className="text-6xl font-extrabold drop-shadow-lg">
            Elevate Your University Experience 🚀
          </h2>
          <p className="mt-4 text-lg max-w-2xl mx-auto animate-slide-up">
            UniPlus helps you stay updated with announcements, buy & sell on the marketplace, and recover lost items.
          </p>
          
          {/* ✨ Buttons */}
          <div className="mt-6 space-x-4">
            <Link to="/signup">
              <button className="px-6 py-3 rounded-lg text-white font-bold bg-yellow-300 hover:bg-yellow-400 transition">
                Get Started
              </button>
            </Link>
            <Link to="/login">
              <button className="px-6 py-3 rounded-lg text-white font-bold bg-gray-800 hover:bg-gray-900 transition">
                Log in
              </button>
            </Link>
          </div>
        </div>
      </header>

     {/* ✅ Features Section */}
<section className="container mx-auto py-16 px-6 md:px-20">
  <h3 className="text-4xl font-bold text-center text-white">Everything You Need in One Place</h3>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mt-10">
    <FeatureCard
      title="Announcements"
      image={announcementsImg}
      description="Stay up-to-date with university events and notices."
      link="/announcements"
    />
    <FeatureCard
      title="Marketplace"
      image={marketplaceImg}
      description="Buy and sell items with university members."
      link="/marketplace"
    />
    <FeatureCard
      title="Lost & Found"
      image={lostFoundImg}
      description="Report lost items or find belongings."
      link="/lost-found"
    />
    <FeatureCard
      title="Notes and Papers"
      image={notesImg}
      description="Find your notes and exams curated."
      link="/Notes"
    />
  </div>
</section>


      {/* ✅ Testimonial Section */}
      <section className="py-16 text-center bg-opacity-50 bg-white backdrop-blur-lg rounded-lg mx-4">
        <img
          src={testimonialImg}
          alt="Dr. Sarah Johnson"
          className="mx-auto w-24 h-24 rounded-full shadow-md"
        />
        <blockquote className="text-2xl italic text-gray-800 mt-6">
          “UniPlus has completely transformed how students interact with campus services.”
        </blockquote>
        <p className="mt-6 font-bold text-lg text-gray-900">Dr. Sarah Johnson</p>
        <p className="text-gray-700">Dean of Student Affairs</p>
      </section>

      {/* ✅ Footer */}
      <footer className="footer text-center py-4 text-white bg-black">
        <p>&copy; {new Date().getFullYear()} UniPlus. All rights reserved.</p>
      </footer>
    </div>
  );
};

/* ✅ FeatureCard Component */
const FeatureCard = ({ title, description, link, image }) => {
  return (
    <div className="bg-white bg-opacity-90 p-6 shadow-md rounded-lg text-center hover:shadow-lg transition-all duration-300 flex flex-col h-full">
    <img src={image} alt={title} className="mx-auto w-32 h-32 rounded-md shadow-md" />
    <h4 className="text-2xl font-bold mt-4 text-gray-900">{title}</h4>
    <p className="text-gray-600 mt-2 flex-grow">{description}</p> 
  
    <Link to={link} className="mt-auto"> 
      <button className="mt-6 px-8 py-3 w-full rounded-md font-semibold text-white bg-yellow-400 hover:bg-yellow-500 transition">
        Explore
      </button>
    </Link>
  </div>
  
  );
};

export default Index; 