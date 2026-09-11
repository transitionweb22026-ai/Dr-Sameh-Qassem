"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";

type VideoModalState = { url: string; title?: string } | null;

type VideoModalContextValue = {
  openVideo: (url: string | undefined, title?: string) => void;
};

const VideoModalContext = createContext<VideoModalContextValue | null>(null);

function toEmbedUrl(rawUrl: string): string {
  try {
    const url = new URL(rawUrl);
    if (url.hostname.includes("youtu.be")) {
      return `https://www.youtube.com/embed/${url.pathname.slice(1)}?autoplay=1`;
    }
    if (url.hostname.includes("youtube.com")) {
      if (url.pathname.startsWith("/shorts/")) {
        return `https://www.youtube.com/embed/${url.pathname.split("/")[2]}?autoplay=1`;
      }
      if (url.pathname.startsWith("/embed/")) {
        return `${rawUrl}${rawUrl.includes("?") ? "&" : "?"}autoplay=1`;
      }
      const id = url.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}?autoplay=1`;
    }
    if (url.hostname.includes("vimeo.com")) {
      const id = url.pathname.split("/").filter(Boolean).pop();
      if (id) return `https://player.vimeo.com/video/${id}?autoplay=1`;
    }
  } catch {
    // Not a parseable absolute URL — use it as-is (e.g. a direct .mp4 source).
  }
  return rawUrl;
}

export function VideoModalProvider({ children }: { children: React.ReactNode }) {
  const t = useTranslations("common");
  const [state, setState] = useState<VideoModalState>(null);

  const openVideo = useCallback((url: string | undefined, title?: string) => {
    setState({ url: url ? toEmbedUrl(url) : "", title });
  }, []);

  const close = useCallback(() => setState(null), []);

  useEffect(() => {
    if (!state) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [state, close]);

  const value = useMemo(() => ({ openVideo }), [openVideo]);
  const isDirectVideoFile = /\.(mp4|webm|ogg)(\?.*)?$/i.test(state?.url ?? "");

  return (
    <VideoModalContext.Provider value={value}>
      {children}
      {state ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={state.title}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm sm:p-8"
          onClick={close}
        >
          <div
            className="relative aspect-video w-full max-w-4xl overflow-hidden rounded-2xl bg-black shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={close}
              aria-label={t("closeVideo")}
              className="absolute -top-11 end-0 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20 sm:end-3 sm:top-3"
            >
              <X className="h-5 w-5" />
            </button>
            {!state.url ? (
              <div className="flex h-full w-full items-center justify-center text-sm text-white/70">
                {t("videoComingSoon")}
              </div>
            ) : isDirectVideoFile ? (
              <video
                src={state.url}
                title={state.title}
                className="h-full w-full"
                controls
                autoPlay
              />
            ) : (
              <iframe
                src={state.url}
                title={state.title ?? "Video"}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
        </div>
      ) : null}
    </VideoModalContext.Provider>
  );
}

export function useVideoModal() {
  const ctx = useContext(VideoModalContext);
  if (!ctx) {
    throw new Error("useVideoModal must be used within a VideoModalProvider");
  }
  return ctx;
}
