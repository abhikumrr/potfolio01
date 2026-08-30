'use client';

import { motion, MotionValue, useTransform } from 'framer-motion';

interface OverlayProps {
  scrollYProgress: MotionValue<number>;
}

export default function Overlay({ scrollYProgress }: OverlayProps) {
  // Fade in over ~10% window, fade out before next begins
  // 1. 0% "My Name. Creative Developer." Center
  const opacity1 = useTransform(scrollYProgress, [0, 0.05, 0.15, 0.25], [0, 1, 1, 0]);
  const y1 = useTransform(scrollYProgress, [0, 0.25], [0, -50]);

  // 2. 30% "I build digital experiences." Left
  const opacity2 = useTransform(scrollYProgress, [0.25, 0.3, 0.45, 0.55], [0, 1, 1, 0]);
  const y2 = useTransform(scrollYProgress, [0.25, 0.55], [50, -50]);

  // 3. 60% "Bridging design and engineering." Right
  const opacity3 = useTransform(scrollYProgress, [0.55, 0.6, 0.85, 0.95], [0, 1, 1, 0]);
  const y3 = useTransform(scrollYProgress, [0.55, 0.95], [50, -50]);

  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      <motion.div
        style={{ opacity: opacity1, y: y1 }}
        className="absolute inset-0 flex items-center justify-center text-4xl md:text-6xl font-bold tracking-tight text-white text-center px-4"
      >
        Tarun. Fashion Model.
      </motion.div>

      <motion.div
        style={{ opacity: opacity2, y: y2 }}
        className="absolute inset-0 flex items-center justify-start text-3xl md:text-5xl font-bold tracking-tight text-white px-4 md:px-24"
      >
        I walk with confidence.
      </motion.div>

      <motion.div
        style={{ opacity: opacity3, y: y3 }}
        className="absolute inset-0 flex items-center justify-end text-3xl md:text-5xl font-bold tracking-tight text-white px-4 md:px-24 text-right"
      >
        Capturing attention.
      </motion.div>
    </div>
  );
}
