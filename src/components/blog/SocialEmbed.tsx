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

function cleanFacebookUrl(url: string): string {
  try {
    const u = new URL(url);
    if (u.pathname.includes('story.php') || u.pathname.includes('permalink.php')) {
      const storyFbid = u.searchParams.get('story_fbid');
      const id = u.searchParams.get('id');
      if (storyFbid && id) {
        return `https://www.facebook.com/permalink.php?story_fbid=${storyFbid}&id=${id}`;
      }
    }
    u.searchParams.delete('rdid');
    u.searchParams.delete('mibextid');
    u.hash = '';
    return u.toString();
  } catch {
    return url;
  }
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
    const cleanedUrl = cleanFacebookUrl(trimmedUrl);
    const encodedUrl = encodeURIComponent(cleanedUrl);
    const isShareLink = /facebook\.com\/share\//.test(cleanedUrl);

    if (isFacebookVideo(cleanedUrl) && !isShareLink) {
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
    } else if (!isShareLink) {
      // Canonical post URL (permalink.php, posts, story.php) — official Facebook post embed
      return (
        <div className="my-6 w-full flex justify-center">
          <iframe
            src={`https://www.facebook.com/plugins/post.php?href=${encodedUrl}&show_text=true&width=500`}
            className="border-0 rounded-xl shadow-md bg-white"
            style={{ width: '500px', maxWidth: '100%', minHeight: '650px' }}
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            allowFullScreen
            title="Facebook post"
          />
        </div>
      );
    } else {
      // Share link (share/p/, share/v/) — Facebook blocks iframe for these
      // Show a beautiful Facebook-branded card with direct link
      return (
        <div className="my-6 w-full flex justify-center">
          <a
            href={trimmedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full max-w-[500px] bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow no-underline group"
          >
            {/* Facebook header */}
            <div className="bg-[#1877F2] px-5 py-3 flex items-center gap-3">
              <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span className="text-white font-bold text-sm">Publicación de Facebook</span>
            </div>
            {/* Content area */}
            <div className="px-5 py-6 text-center">
              <div className="mb-4">
                <svg className="w-12 h-12 mx-auto text-[#1877F2] mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <p className="text-gray-800 font-semibold text-base mb-1">
                  Ver publicación completa
                </p>
                <p className="text-gray-500 text-sm">
                  Haz clic para abrir esta publicación en Facebook y participar
                </p>
              </div>
              <span className="inline-flex items-center gap-2 bg-[#1877F2] text-white font-bold px-6 py-3 rounded-lg group-hover:bg-[#166FE5] transition-colors text-sm">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Abrir en Facebook
              </span>
            </div>
          </a>
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
