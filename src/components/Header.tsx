'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll to add backdrop blur when not at top
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Biodata', href: '#biodata' },
    { name: 'Gallery', href: '#gallery' },
  ];

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-[#121212]/80 backdrop-blur-md border-b border-white/10' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="#home" className="text-white text-xl font-bold tracking-widest uppercase">
            TARUN
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className="text-white/70 hover:text-white transition-colors text-sm uppercase tracking-widest font-medium"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Mobile Hamburger Toggle */}
          <button 
            className="md:hidden relative w-10 h-10 flex items-center justify-center text-white z-50 focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Navigation"
          >
            <div className="flex flex-col gap-1.5 items-end">
              <motion.span 
                animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                className="block w-6 h-[2px] bg-white transition-transform"
              />
              <motion.span 
                animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                className="block w-4 h-[2px] bg-white transition-opacity"
              />
              <motion.span 
                animate={isOpen ? { rotate: -45, y: -8, width: 24 } : { rotate: 0, y: 0, width: 24 }}
                className="block h-[2px] bg-white transition-transform"
              />
            </div>
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[#121212] pt-28 px-6 flex flex-col md:hidden"
          >
            <nav className="flex flex-col gap-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-4xl font-bold text-white tracking-wider uppercase border-b border-white/10 pb-4"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
            
            <div className="mt-auto mb-12 flex gap-6 text-white/50">
              <a href="https://www.instagram.com/tarun_chandrawal/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">INSTAGRAM</a>
              <a href="#" className="hover:text-white transition-colors">LINKEDIN</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
