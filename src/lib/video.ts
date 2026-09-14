/**
 * Derives a preview thumbnail straight from a video URL, so the admin only
 * ever pastes a link — no separate thumbnail upload to keep in sync.
 * YouTube thumbnails follow a predictable, stable URL pattern (no API call
 * needed). Anything else (Vimeo, a direct .mp4, an unrecognized link) has no
 * automatic thumbnail and falls back to the card's plain gradient look.
 */
export function getVideoThumbnail(videoUrl: string | null | undefined): string | null {
  if (!videoUrl) return null;

  const youtubeMatch = videoUrl.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (youtubeMatch) {
    return `https://img.youtube.com/vi/${youtubeMatch[1]}/hqdefault.jpg`;
  }

  return null;
}
