'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface VideoBackgroundProps {
  videoSrc?: string;
  webmSrc?: string;
  posterSrc: string;
  fallbackImageSrc: string;
  alt: string;
  className?: string;
  overlayClassName?: string;
  enableKenBurns?: boolean;
  priority?: boolean;
}

export default function VideoBackground({
  videoSrc,
  webmSrc,
  posterSrc,
  fallbackImageSrc,
  alt,
  className = '',
  overlayClassName = '',
  enableKenBurns = true,
  priority = true,
}: VideoBackgroundProps) {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [useVideoFallback, setUseVideoFallback] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Check if mobile for bandwidth-saving fallback
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Try to play video when component mounts
    if (videoRef.current && videoSrc && !isMobile) {
      videoRef.current.play().catch(() => {
        // Autoplay blocked, fall back to image
        setUseVideoFallback(true);
      });
    }
  }, [videoSrc, isMobile]);

  const handleVideoLoad = () => {
    setIsVideoLoaded(true);
  };

  const handleVideoError = () => {
    setUseVideoFallback(true);
  };

  // Use Ken Burns image fallback on mobile or when video fails
  const showImage = isMobile || useVideoFallback || !videoSrc;

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Video (hidden on mobile for bandwidth) */}
      {!showImage && videoSrc && (
        <motion.video
          ref={videoRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: isVideoLoaded ? 1 : 0 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={posterSrc}
          onLoadedData={handleVideoLoad}
          onError={handleVideoError}
        >
          {webmSrc && <source src={webmSrc} type="video/webm" />}
          <source src={videoSrc} type="video/mp4" />
        </motion.video>
      )}

      {/* Fallback Image with Ken Burns effect */}
      {(showImage || !isVideoLoaded) && (
        <motion.div
          initial={{ opacity: showImage ? 1 : 1 }}
          animate={{ opacity: showImage ? 1 : isVideoLoaded ? 0 : 1 }}
          transition={{ duration: 1 }}
          className={`absolute inset-0 ${enableKenBurns ? 'animate-ken-burns' : ''}`}
        >
          <Image
            src={fallbackImageSrc}
            alt={alt}
            fill
            className="object-cover"
            priority={priority}
            sizes="100vw"
          />
        </motion.div>
      )}

      {/* Gradient overlay */}
      {overlayClassName && (
        <div className={`absolute inset-0 ${overlayClassName}`} />
      )}
    </div>
  );
}
