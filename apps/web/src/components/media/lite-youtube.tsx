"use client";

import { useMemo, useState } from "react";

interface LiteYouTubeProps {
  videoId: string;
  title: string;
  params?: string;
  className?: string;
}

const buildParams = (params?: string) => {
  const searchParams = new URLSearchParams(params ?? "");

  if (!searchParams.has("autoplay")) {
    searchParams.set("autoplay", "1");
  }
  if (!searchParams.has("rel")) {
    searchParams.set("rel", "0");
  }
  if (!searchParams.has("modestbranding")) {
    searchParams.set("modestbranding", "1");
  }

  return searchParams.toString();
};

export default function LiteYouTube({
  videoId,
  title,
  params,
  className,
}: LiteYouTubeProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  const iframeSrc = useMemo(() => {
    const query = buildParams(params);
    return `https://www.youtube-nocookie.com/embed/${videoId}?${query}`;
  }, [params, videoId]);

  const thumbnailSrc = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <div className={`relative w-full h-full ${className ?? ""}`}>
      {isLoaded ? (
        <iframe
          className="absolute inset-0 w-full h-full"
          src={iframeSrc}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setIsLoaded(true)}
          className="absolute inset-0 w-full h-full"
          aria-label={`Play video: ${title}`}
        >
          <img
            src={thumbnailSrc}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
          <span className="absolute inset-0 bg-black/30" />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex items-center justify-center w-16 h-16 rounded-full bg-white/90 text-gray-900 shadow-lg">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="w-7 h-7"
                fill="currentColor"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
