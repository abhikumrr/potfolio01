import React from 'react';

// Using some placeholder image paths since we don't have the real ones yet.
const PROFILE_PICS = [
  '/profiles/1.png',
  '/profiles/2.png',
  '/profiles/3.png',
  '/profiles/4.png',
  '/profiles/5.png',
  '/profiles/6.png',
];

export default function ProfileGallery() {
  return (
    <section className="py-24 px-4 bg-[#121212]">
      <div className="w-full max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold mb-16 text-white/90 text-center">
          Profile Showcase
        </h2>
        
        {/* Profile Pictures Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 mb-24">
          {PROFILE_PICS.map((pic, idx) => (
            <div 
              key={idx}
              className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/20 transition-all duration-500 ease-out cursor-pointer shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]"
            >
              {/* Replace with next/image later if desired. We use a placeholder background color for now */}
              <div className="absolute inset-0 bg-white/10 flex items-center justify-center text-white/30 text-sm">
                Image {idx + 1}
              </div>
              <img 
                src={pic} 
                alt={`Profile ${idx + 1}`} 
                className="absolute inset-0 w-full h-full object-cover transition-all duration-300 group-hover:scale-105" 
              />
            </div>
          ))}
        </div>

        {/* Social Media Handles */}
        <div className="flex flex-col items-center justify-center border-t border-white/10 pt-16 pb-8">
          <h3 className="text-2xl font-semibold mb-8 text-white/80">Connect with me</h3>
          <div className="flex space-x-8">
            <a href="https://www.instagram.com/tarun_chandrawal/" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors duration-300 text-lg tracking-wider hover:-translate-y-1 transform">
              INSTAGRAM
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors duration-300 text-lg tracking-wider hover:-translate-y-1 transform">
              LINKEDIN
            </a>
            <a href="https://snapchat.com" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors duration-300 text-lg tracking-wider hover:-translate-y-1 transform">
              SNAPCHAT
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
