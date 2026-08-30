'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useScroll, useTransform, useMotionValueEvent, useReducedMotion } from 'framer-motion';
import Overlay from './Overlay';

interface ScrollyCanvasProps {
  framePaths: string[];
}

export default function ScrollyCanvas({ framePaths }: ScrollyCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const prefersReducedMotion = useReducedMotion();
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameCount = framePaths.length;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, Math.max(0, frameCount - 1)]);

  useEffect(() => {
    if (frameCount === 0) return;

    let loadedCount = 0;
    const images: HTMLImageElement[] = [];
    
    // Preload images
    Promise.all(framePaths.map((path, i) => {
      return new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.src = path;
        img.onload = () => {
          // Decode image for better performance before marking as ready
          img.decode().then(() => {
            loadedCount++;
            setProgress(Math.round((loadedCount / frameCount) * 100));
            images[i] = img;
            resolve();
          }).catch((e) => {
            console.warn(`Failed to decode image ${path}`, e);
            // Even if decode fails, we can still resolve to keep the app working
            loadedCount++;
            images[i] = img;
            resolve();
          });
        };
        img.onerror = reject;
      });
    })).then(() => {
      imagesRef.current = images;
      setLoaded(true);
      // Draw first frame once loaded
      drawFrame(0);
    }).catch((e) => {
      console.error("Error loading sequence images", e);
      setLoaded(true); // show fallback or just proceed
    });
  }, [framePaths, frameCount]);

  const drawFrame = (index: number) => {
    if (!canvasRef.current || imagesRef.current.length === 0) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const img = imagesRef.current[Math.floor(index)];
    if (!img) return;

    const canvas = canvasRef.current;
    
    // object-fit: cover math
    const imgRatio = img.width / img.height;
    const canvasRatio = canvas.width / canvas.height;
    let drawWidth, drawHeight, offsetX, offsetY;

    if (canvasRatio > imgRatio) {
      drawWidth = canvas.width;
      drawHeight = canvas.width / imgRatio;
      offsetX = 0;
      offsetY = (canvas.height - drawHeight) / 2;
    } else {
      drawWidth = canvas.height * imgRatio;
      drawHeight = canvas.height;
      offsetX = (canvas.width - drawWidth) / 2;
      offsetY = 0;
    }

    // clear and draw
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  };

  // Resize handling
  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current) return;
      const canvas = canvasRef.current;
      
      // Match canvas dimensions to devicePixelRatio
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
      }
      
      // Redraw current frame
      drawFrame(frameIndex.get());
    };

    window.addEventListener('resize', handleResize);
    // Initial size
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [frameIndex]);

  const lastDrawnIndex = useRef<number>(-1);

  useMotionValueEvent(frameIndex, 'change', (latest) => {
    if (loaded && !prefersReducedMotion) {
      const currentFrame = Math.floor(latest);
      if (currentFrame !== lastDrawnIndex.current) {
        requestAnimationFrame(() => {
          drawFrame(latest);
          lastDrawnIndex.current = currentFrame;
        });
      }
    }
  });

  if (prefersReducedMotion) {
    return (
      <div className="relative h-screen w-full bg-[#121212]">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        <Overlay scrollYProgress={scrollYProgress} />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative h-[500vh] bg-[#121212]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        
        {!loaded && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#121212]">
            <div className="w-64 h-1 bg-white/20 rounded overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-white/50 mt-4 text-sm uppercase tracking-widest">{progress}%</p>
          </div>
        )}

        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full"
        />
        
        {loaded && <Overlay scrollYProgress={scrollYProgress} />}
      </div>
    </div>
  );
}
