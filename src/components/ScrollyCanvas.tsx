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

    const images: HTMLImageElement[] = [];
    imagesRef.current = images;

    // Load first frame immediately to show content ASAP
    const firstImg = new Image();
    firstImg.src = framePaths[0];
    firstImg.onload = () => {
      firstImg.decode().then(() => {
        images[0] = firstImg;
        setLoaded(true);
        drawFrame(0);
        
        // Asynchronously load the rest of the frames without blocking
        loadRemainingFrames(images);
      }).catch((e) => {
        console.warn(`Failed to decode first image`, e);
        images[0] = firstImg;
        setLoaded(true);
        drawFrame(0);
        loadRemainingFrames(images);
      });
    };
    firstImg.onerror = () => {
      console.warn(`Failed to load first image`);
      setLoaded(true);
      loadRemainingFrames(images);
    };

    const loadRemainingFrames = (imgs: HTMLImageElement[]) => {
      for (let i = 1; i < framePaths.length; i++) {
        const img = new Image();
        img.src = framePaths[i];
        img.onload = () => {
          img.decode().then(() => {
            imgs[i] = img;
            // If the user scrolled to this frame while it was loading, draw it now
            if (Math.floor(frameIndex.get()) === i) {
              drawFrame(i);
            }
          }).catch(() => {
            imgs[i] = img;
          });
        };
      }
    };
  }, [framePaths, frameCount, frameIndex]);


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
        

        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full"
        />
        
        {loaded && <Overlay scrollYProgress={scrollYProgress} />}
      </div>
    </div>
  );
}
