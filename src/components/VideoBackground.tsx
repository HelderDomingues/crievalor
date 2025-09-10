"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll } from "framer-motion";

// Video Background Component
interface VideoBackgroundProps {
  src?: string;
  className?: string;
  children?: React.ReactNode;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  overlay?: boolean;
  overlayOpacity?: number;
}

const VideoBackground: React.FC<VideoBackgroundProps> = ({
  src = "https://hai.stanford.edu/assets/images/stanfd-ai_16-9_4k.mp4",
  className = "",
  children,
  autoPlay = true,
  loop = true,
  muted = true,
  overlay = true,
  overlayOpacity = 0.5,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      setIsLoaded(true);
      if (autoPlay) {
        video.play().catch(console.error);
      }
    };

    video.addEventListener('loadeddata', handleLoadedData);

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
    };
  }, [autoPlay]);

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* Video Element */}
      <motion.video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover opacity-50"
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        playsInline
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ 
          scale: isLoaded ? 1 : 1.1, 
          opacity: isLoaded ? 0.5 : 0 
        }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </motion.video>

      {/* Overlay */}
      {overlay && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-primary/5"
          style={{ opacity: overlayOpacity }}
          initial={{ opacity: 0 }}
          animate={{ opacity: overlayOpacity }}
          transition={{ duration: 1, delay: 0.5 }}
        />
      )}

      {/* Parallax Effect */}
      <motion.div
        className="absolute inset-0"
        style={{
          y: scrollYProgress,
        }}
      />

      {/* Animated particles overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/20 rounded-full"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
              opacity: 0,
            }}
            animate={{
              y: [null, -100],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* Content */}
      {children}
    </div>
  );
};

export default VideoBackground;