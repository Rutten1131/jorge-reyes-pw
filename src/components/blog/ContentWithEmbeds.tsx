'use client';

import { MDXRemote } from 'next-mdx-remote/rsc';
import SocialEmbed from './SocialEmbed';

// Regex to detect a social URL sitting alone on its own line
const SOCIAL_URL_PATTERN = /^(https?:\/\/(?:(?:www\.)?(?:youtube\.com|youtu\.be|vimeo\.com|instagram\.com|facebook\.com|tiktok\.com|vm\.tiktok\.com|fb\.watch)[^\s]*))\s*$/;

type ContentBlock = 
  | { type: 'markdown'; content: string }
  | { type: 'social'; url: string };

function splitContentIntoBlocks(content: string): ContentBlock[] {
  const lines = content.split('\n');
  const blocks: ContentBlock[] = [];
  let currentMarkdown: string[] = [];

  const flushMarkdown = () => {
    if (currentMarkdown.length > 0) {
      const text = currentMarkdown.join('\n').trim();
      if (text) {
        blocks.push({ type: 'markdown', content: text });
      }
      currentMarkdown = [];
    }
  };

  for (const line of lines) {
    const match = line.trim().match(SOCIAL_URL_PATTERN);
    if (match) {
      flushMarkdown();
      blocks.push({ type: 'social', url: match[1] });
    } else {
      currentMarkdown.push(line);
    }
  }
  flushMarkdown();

  return blocks;
}

type Props = {
  content: string;
};

export default function ContentWithEmbeds({ content }: Props) {
  const blocks = splitContentIntoBlocks(content);

  return (
    <div>
      {blocks.map((block, idx) => {
        if (block.type === 'social') {
          return <SocialEmbed key={`social-${idx}`} url={block.url} />;
        }
        return (
          <div
            key={`md-${idx}`}
            className="prose prose-xl prose-primario max-w-none font-dmsans leading-relaxed prose-headings:font-barlow prose-headings:font-bold prose-headings:uppercase prose-headings:tracking-tighter prose-headings:text-primario prose-p:text-primario/80 prose-strong:text-acento prose-a:text-acento prose-li:text-primario/70"
            style={{ overflowWrap: 'break-word', wordBreak: 'break-word' }}
          >
            <MDXRemote source={block.content} />
          </div>
        );
      })}
    </div>
  );
}
