"use client";

import { useState, useEffect } from "react";
import type { Song } from "@/shared/types/song";

interface LyricsDisplayProps {
  song: Song;
}

const MIN_FONT_SIZE = 14;
const MAX_FONT_SIZE = 24;
const DEFAULT_FONT_SIZE = 18;
const STORAGE_KEY = "lyrics-font-size";

export function LyricsDisplay({ song }: LyricsDisplayProps) {
  const [fontSize, setFontSize] = useState(DEFAULT_FONT_SIZE);

  useEffect(() => {
    // Load font size from sessionStorage
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        const size = parseInt(stored, 10);
        if (size >= MIN_FONT_SIZE && size <= MAX_FONT_SIZE) {
          setFontSize(size);
        }
      }
    }
  }, []);

  const handleFontSizeChange = (newSize: number) => {
    setFontSize(newSize);
    if (typeof window !== "undefined") {
      sessionStorage.setItem(STORAGE_KEY, newSize.toString());
    }
  };

  // Preserve line breaks: single \n = new line, double \n\n = paragraph
  const formattedLyrics = song.lyrics
    .split(/\n\n+/)
    .map((paragraph) => paragraph.split("\n").join("<br />"))
    .map((paragraph, index) => (
      <p key={index} className="mb-4 last:mb-0" dangerouslySetInnerHTML={{ __html: paragraph }} />
    ));

  return (
    <div className="min-h-screen bg-zinc-50 p-4 dark:bg-black sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold tracking-tight text-black dark:text-zinc-50 sm:text-2xl">
            {song.title}
          </h1>
          {song.artist_composer && (
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              {song.artist_composer}
            </p>
          )}
        </div>

        {/* Font Size Control */}
        <div className="mb-6 rounded-lg bg-white p-4 shadow-sm dark:bg-zinc-900">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <label
              htmlFor="font-size"
              className="text-sm font-medium text-zinc-900 dark:text-zinc-50"
            >
              Font Size: <span className="font-normal">{fontSize}px</span>
            </label>
            <div className="flex flex-1 items-center gap-3 sm:ml-4">
              <span className="text-xs text-zinc-600 dark:text-zinc-400">{MIN_FONT_SIZE}px</span>
              <input
                id="font-size"
                type="range"
                min={MIN_FONT_SIZE}
                max={MAX_FONT_SIZE}
                value={fontSize}
                onChange={(e) => handleFontSizeChange(parseInt(e.target.value, 10))}
                className="flex-1"
              />
              <span className="text-xs text-zinc-600 dark:text-zinc-400">{MAX_FONT_SIZE}px</span>
            </div>
          </div>
        </div>

        {/* Lyrics */}
        <div
          className="rounded-lg bg-white p-6 shadow-sm dark:bg-zinc-900"
          style={{ fontSize: `${fontSize}px`, lineHeight: "1.6" }}
        >
          <div className="text-zinc-900 dark:text-zinc-50">{formattedLyrics}</div>
        </div>
      </div>
    </div>
  );
}

