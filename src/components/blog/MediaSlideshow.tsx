'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

type MediaSlide = {
  id: number;
  url: string;
  mimeType: string;
  filename: string;
  isVideo: boolean;
  isImage: boolean;
  videoUrl?: string | null;
};

type Props = {
  slides: MediaSlide[];
  postTitle: string;
};

function getYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function getVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(\d+)/);
  return match ? match[1] : null;
}

function getInstagramCode(url: string): string | null {
  // Matches: instagram.com/reel/CODE/, instagram.com/p/CODE/, instagram.com/reels/CODE/
  const match = url.match(/instagram\.com\/(?:reel|p|reels)\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

function getFacebookVideoUrl(url: string): string | null {
  // Matches: facebook.com/share/v/..., facebook.com/watch?v=..., facebook.com/reel/..., fb.watch/...
  if (url.match(/facebook\.com\/(share\/v|watch|reel|.*\/videos)/) || url.match(/fb\.watch\//)) {
    return url;
  }
  return null;
}

function getTikTokVideoId(url: string): string | null {
  // Matches: tiktok.com/@user/video/ID
  const match = url.match(/tiktok\.com\/@[^/]+\/video\/(\d+)/);
  if (match) return match[1];
  // Short links like vm.tiktok.com/CODE/ — we can't extract ID, use full URL
  if (url.match(/vm\.tiktok\.com\//) || url.match(/tiktok\.com/)) return 'FULL_URL';
  return null;
}

function getPlatformName(url: string): string | null {
  if (getYouTubeId(url)) return 'YouTube';
  if (getVimeoId(url)) return 'Vimeo';
  if (getInstagramCode(url)) return 'Instagram';
  if (getFacebookVideoUrl(url)) return 'Facebook';
  if (getTikTokVideoId(url)) return 'TikTok';
  return null;
}

export default function MediaSlideshow({ slides, postTitle }: Props) {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [autoplay, setAutoplay] = useState(true);
  const touchStartX = useRef<number | null>(null);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = slides.length;

  const goTo = useCallback((index: number) => {
    if (isTransitioning || total <= 1) return;
    setIsTransitioning(true);
    setCurrent((index + total) % total);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning, total]);

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  // Autoplay - only for images, pause on video slides
  useEffect(() => {
    if (!autoplay || total <= 1) return;
    const slide = slides[current];
    // Don't autoplay if current slide is a video
    if (slide?.isVideo || slide?.videoUrl) return;

    autoplayRef.current = setInterval(() => {
      setCurrent(prev => (prev + 1) % total);
    }, 5000);

    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [autoplay, current, total, slides]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [next, prev]);

  // Touch/swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) next();
      else prev();
    }
    touchStartX.current = null;
  };

  if (total === 0) return null;

  const currentSlide = slides[current];

  const renderSlide = (slide: MediaSlide) => {
    // Linked video URL (YouTube, Vimeo, Instagram, Facebook, TikTok)
    if (slide.videoUrl) {
      const ytId = getYouTubeId(slide.videoUrl);
      const vimeoId = getVimeoId(slide.videoUrl);
      const igCode = getInstagramCode(slide.videoUrl);
      const fbUrl = getFacebookVideoUrl(slide.videoUrl);
      const tikTokId = getTikTokVideoId(slide.videoUrl);
      const platform = getPlatformName(slide.videoUrl);

      if (ytId) {
        return (
          <iframe
            src={`https://www.youtube.com/embed/${ytId}?rel=0&modestbranding=1`}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={slide.filename || postTitle}
          />
        );
      }
      if (vimeoId) {
        return (
          <iframe
            src={`https://player.vimeo.com/video/${vimeoId}`}
            className="w-full h-full"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title={slide.filename || postTitle}
          />
        );
      }
      if (igCode) {
        return (
          <iframe
            src={`https://www.instagram.com/reel/${igCode}/embed/`}
            className="w-full h-full border-0"
            allowFullScreen
            title={`Instagram - ${slide.filename || postTitle}`}
            style={{ minHeight: '100%' }}
          />
        );
      }
      if (fbUrl) {
        const encodedUrl = encodeURIComponent(fbUrl);
        return (
          <iframe
            src={`https://www.facebook.com/plugins/video.php?href=${encodedUrl}&show_text=false&width=560`}
            className="w-full h-full border-0"
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            allowFullScreen
            title={`Facebook - ${slide.filename || postTitle}`}
          />
        );
      }
      if (tikTokId) {
        // TikTok embeds — for full URLs we use tiktok.com/embed
        const embedUrl = tikTokId !== 'FULL_URL'
          ? `https://www.tiktok.com/embed/v2/${tikTokId}`
          : slide.videoUrl;
        return (
          <div className="w-full h-full flex items-center justify-center bg-black relative">
            <iframe
              src={tikTokId !== 'FULL_URL' ? `https://www.tiktok.com/embed/v2/${tikTokId}` : undefined}
              className="h-full border-0"
              style={{ width: '325px', maxWidth: '100%' }}
              allowFullScreen
              title={`TikTok - ${slide.filename || postTitle}`}
            />
            {tikTokId === 'FULL_URL' && (
              <a
                href={slide.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#ff0050] via-[#00f2ea] to-[#ff0050] text-white"
              >
                <svg className="w-16 h-16 mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span className="font-barlow font-bold text-lg tracking-wide uppercase">Ver en TikTok</span>
              </a>
            )}
          </div>
        );
      }

      // Generic/unknown video URL — show link to open
      return (
        <a
          href={slide.videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 text-white"
        >
          <svg className="w-16 h-16 mb-4 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-barlow font-bold tracking-wide uppercase">Ver video</span>
          {platform && <span className="text-sm opacity-60 mt-1">{platform}</span>}
        </a>
      );
    }

    // Uploaded video blob
    if (slide.isVideo) {
      return (
        <video
          src={slide.url}
          className="w-full h-full object-cover"
          controls
          playsInline
        />
      );
    }

    // Image
    return (
      <img
        src={slide.url}
        alt={slide.filename || postTitle}
        className="w-full h-full object-cover"
        draggable={false}
      />
    );
  };

  return (
    <div
      className="relative w-full rounded-3xl overflow-hidden shadow-2xl mb-12 group"
      style={{ aspectRatio: '16/9' }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={() => setAutoplay(false)}
      onMouseLeave={() => setAutoplay(true)}
    >
      {/* Slides */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-500 ease-in-out ${
              index === current
                ? 'opacity-100 scale-100 z-10'
                : 'opacity-0 scale-105 z-0'
            }`}
          >
            {/* Only render media for current and adjacent slides for performance */}
            {Math.abs(index - current) <= 1 || index === 0 || index === total - 1
              ? renderSlide(slide)
              : null}
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      {total > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-md text-white border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/50 hover:scale-110"
            aria-label="Anterior"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-md text-white border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/50 hover:scale-110"
            aria-label="Siguiente"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Bottom gradient overlay */}
      {total > 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/50 to-transparent z-10 pointer-events-none" />
      )}

      {/* Dot indicators */}
      {total > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goTo(index)}
              className={`rounded-full transition-all duration-300 ${
                index === current
                  ? 'w-8 h-2.5 bg-white shadow-lg'
                  : 'w-2.5 h-2.5 bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Ir a slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Counter badge */}
      {total > 1 && (
        <div className="absolute top-4 right-4 z-20 bg-black/40 backdrop-blur-md text-white text-xs font-barlow font-bold px-3 py-1.5 rounded-full border border-white/10">
          {current + 1} / {total}
        </div>
      )}

      {/* Video icon indicator */}
      {(currentSlide?.isVideo || currentSlide?.videoUrl) && (
        <div className="absolute top-4 left-4 z-20 bg-black/40 backdrop-blur-md text-white text-xs font-barlow font-bold px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
          VIDEO
        </div>
      )}
    </div>
  );
}
