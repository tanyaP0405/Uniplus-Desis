import React from 'react';
import { Link } from 'react-router-dom';
import Container from '../ui/Container';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    {
      title: 'Platform',
      links: [
        { name: 'Home', path: '/' },
        { name: 'Announcements', path: '/announcements' },
        { name: 'Marketplace', path: '/marketplace' },
        { name: 'Lost & Found', path: '/lost-found' },
        { name: 'Notes and Exam papers', path: '/notes' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { name: 'Help Center', path: '/help' },   
        { name: 'Privacy Policy', path: '/privacy' },
        { name: 'Terms of Service', path: '/terms' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', path: '/about' },
        { name: 'Contact', path: '/contact' },
       
        { name: 'Press', path: '/press' },
      ],
    },
  ];
  
  return (
    <footer className="bg-white border-t py-12 md:py-16 text-black">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Tagline */}
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-black flex items-center justify-center">
                <span className="text-white font-bold text-lg">U+</span>
              </div>
              <span className="font-bold text-xl text-black">UniPlus</span>
            </Link>
            <p className="text-sm text-black">
              A comprehensive platform for university students and staff.
            </p>
          </div>
          
          {/* Link Columns */}
          {footerLinks.map((column) => (
            <div key={column.title}>
              <h3 className="font-semibold text-sm mb-3 text-black">{column.title}</h3>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.path} 
                      className="text-sm text-black hover:text-gray-700 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {/* Bottom Section */}
        <div className="border-t mt-10 pt-10 flex flex-col md:flex-row md:items-center justify-between">
          <p className="text-sm text-black">
            &copy; {currentYear} UniPlus. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link 
              to="/privacy" 
              className="text-xs text-black hover:text-gray-700 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link 
              to="/terms" 
              className="text-xs text-black hover:text-gray-700 transition-colors"
            >
              Terms of Service
            </Link>
            
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;

