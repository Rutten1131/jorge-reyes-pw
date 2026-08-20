'use client';

/**
 * SocialEmbed — Renders inline social media embeds (Facebook posts/videos,
 * Instagram, YouTube, TikTok) from a plain URL.
 */

type SocialEmbedProps = {
  url: string;
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
  const match = url.match(/instagram\.com\/(?:reel|p|reels)\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

function isFacebookUrl(url: string): boolean {
  return url.includes('facebook.com') || url.includes('fb.watch');
}

function isFacebookVideo(url: string): boolean {
  return !!(
    url.match(/facebook\.com\/(share\/v|watch|reel|.*\/videos)/) ||
    url.match(/fb\.watch\//)
  );
}

function getTikTokVideoId(url: string): string | null {
  const match = url.match(/tiktok\.com\/@[^/]+\/video\/(\d+)/);
  if (match) return match[1];
  if (url.match(/vm\.tiktok\.com\//) || url.match(/tiktok\.com/)) return 'FULL_URL';
  return null;
}

export default function SocialEmbed({ url }: SocialEmbedProps) {
  const trimmedUrl = url.trim();

  // YouTube
  const ytId = getYouTubeId(trimmedUrl);
  if (ytId) {
    return (
      <div className="my-6 w-full aspect-video rounded-lg overflow-hidden shadow-lg">
        <iframe
          src={`https://www.youtube.com/embed/${ytId}?rel=0&modestbranding=1`}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="YouTube video"
        />
      </div>
    );
  }

  // Vimeo
  const vimeoId = getVimeoId(trimmedUrl);
  if (vimeoId) {
    return (
      <div className="my-6 w-full aspect-video rounded-lg overflow-hidden shadow-lg">
        <iframe
          src={`https://player.vimeo.com/video/${vimeoId}`}
          className="w-full h-full"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title="Vimeo video"
        />
      </div>
    );
  }

  // Instagram
  const igCode = getInstagramCode(trimmedUrl);
  if (igCode) {
    return (
      <div className="my-6 w-full flex justify-center">
        <iframe
          src={`https://www.instagram.com/reel/${igCode}/embed/`}
          className="border-0 rounded-lg shadow-lg"
          style={{ width: '400px', maxWidth: '100%', height: '500px' }}
          allowFullScreen
          title="Instagram embed"
        />
      </div>
    );
  }

  // Facebook
  if (isFacebookUrl(trimmedUrl)) {
    const encodedUrl = encodeURIComponent(trimmedUrl);
    if (isFacebookVideo(trimmedUrl)) {
      return (
        <div className="my-6 w-full aspect-video rounded-lg overflow-hidden shadow-lg">
          <iframe
            src={`https://www.facebook.com/plugins/video.php?href=${encodedUrl}&show_text=false&width=560`}
            className="w-full h-full border-0"
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            allowFullScreen
            title="Facebook video"
          />
        </div>
      );
    } else {
      // Facebook Post embed (share/p/..., posts, photos, encuestas)
      return (
        <div className="my-6 w-full flex justify-center">
          <iframe
            src={`https://www.facebook.com/plugins/post.php?href=${encodedUrl}&show_text=true&width=500`}
            className="border-0 rounded-lg shadow-lg bg-white"
            style={{ width: '500px', maxWidth: '100%', height: '600px' }}
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            allowFullScreen
            title="Facebook post"
          />
        </div>
      );
    }
  }

  // TikTok
  const tikTokId = getTikTokVideoId(trimmedUrl);
  if (tikTokId && tikTokId !== 'FULL_URL') {
    return (
      <div className="my-6 w-full flex justify-center">
        <iframe
          src={`https://www.tiktok.com/embed/v2/${tikTokId}`}
          className="border-0 rounded-lg shadow-lg"
          style={{ width: '325px', maxWidth: '100%', height: '580px' }}
          allowFullScreen
          title="TikTok video"
        />
      </div>
    );
  }
  if (tikTokId === 'FULL_URL') {
    return (
      <div className="my-6 w-full flex justify-center">
        <a
          href={trimmedUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#ff0050] via-[#00f2ea] to-[#ff0050] text-white font-bold rounded-lg hover:scale-105 transition-transform shadow-lg no-underline"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
          Ver en TikTok
        </a>
      </div>
    );
  }

  // Fallback — just render the link
  return (
    <a href={trimmedUrl} target="_blank" rel="noopener noreferrer">
      {trimmedUrl}
    </a>
  );
}
