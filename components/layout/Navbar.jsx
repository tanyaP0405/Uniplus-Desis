import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Button from "../ui/Button";
import Container from "../ui/Container";
import { useAuth } from "../../hooks/useAuth";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50); // Trigger transition after scrolling 50px
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Announcements", path: "/announcements" },
    { name: "Marketplace", path: "/marketplace" },
    { name: "Lost & Found", path: "/lost-found" },
    { name: "Notes", path: "/notes" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-black/90 shadow-md py-3" : "bg-transparent py-5"
      }`}
    >
      <Container>
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center">
              <span className="text-black font-bold text-lg">U+</span>
            </div>
            <span className="font-bold text-xl text-white hidden sm:inline-block">
              UniPlus
            </span>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  className={`text-sm font-medium text-white transition-colors ${
                    isActive(link.path) ? "font-semibold text-lg " : "hover:opacity-90"
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* Auth Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="outline" size="sm">Admin</Button>
                  </Link>
                )}
                <div className="text-sm font-medium text-white">
                  {user?.name || "User"}
                </div>
                <Button
                  variant="outline"
                  className="text-white border-white px-3 py-1 text-sm font-bold transition-all duration-300 hover:scale-105 hover:text-white"
                  size="sm"
                  onClick={logout}
                >
                  Logout
              </Button>

              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-white border-white shadow-none hover:text-white px-4 py-2 text-sm w-auto"
                  >
                    Login
                  </Button>
                </Link>

                <Link to="/signup">
                  <Button
                    variant="primary"
                    size="sm"
                    className="custom-signup-button px-4 py-2 text-white rounded-md text-sm whitespace-nowrap shadow-none w-auto"
                  >
                    Sign Up
                  </Button>
                </Link>

              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6"
            >
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </nav>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pt-4 pb-3 border-t mt-3 bg-black text-white animate-fade-in">
            <ul className="flex flex-col space-y-4 mb-6">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-sm font-medium block transition-colors ${
                      isActive(link.path) ? "font-semibold underline" : "hover:opacity-80"
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Mobile auth actions */}
            <div className="flex flex-col space-y-3">
              {user ? (
                <>
                  {isAdmin && (
                    <Link to="/admin" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="outline" size="sm" className="w-full text-white border-white">Admin</Button>
                    </Link>
                  )}
                  <div className="text-sm font-medium text-white">{user?.name || "User"}</div>
                  <Button variant="outline" size="sm" onClick={logout} className="text-white border-white">
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full text-white border-white">Login</Button>
                  </Link>
                  <Link to="/signup" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="primary" size="sm" className="w-full text-white bg-white/20 hover:bg-white/30">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </Container>
    </header>
  );
};

export default Navbar;
