'use client';

import { motion } from 'framer-motion';
import { Biodata } from '../lib/parseBiodata';

interface BiodataProps {
  data: Biodata;
}

export default function BiodataSection({ data }: BiodataProps) {
  const entries = Object.entries(data);

  return (
    <section className="min-h-screen flex items-center justify-center py-24 px-4 bg-[#121212]">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-20%" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-4xl"
      >
        <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center text-white/90">
          Vital Statistics
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          {entries.map(([key, value], i) => (
            <motion.div 
              key={key}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
              className="flex justify-between border-b border-white/10 pb-4"
            >
              <span className="text-white/50 font-medium tracking-wider uppercase text-sm">
                {key}
              </span>
              <span className="text-white font-medium text-right ml-4">
                {value}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
