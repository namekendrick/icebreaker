"use client";

import { useState, useEffect } from "react";

import { useTypewriter } from "@/features/daily/hooks/use-typewriter";
import {
  useWidgetProps,
  useMaxHeight,
  useDisplayMode,
  useRequestDisplayMode,
  useIsChatGptApp,
} from "@/hooks";
import { useToolResponseMetadata } from "@/hooks/use-tool-response-metadata";

export default function Home() {
  const toolOutput = useWidgetProps();
  const toolResponseMetadata = useToolResponseMetadata();
  const maxHeight = useMaxHeight() ?? undefined;
  const displayMode = useDisplayMode();
  const requestDisplayMode = useRequestDisplayMode();
  const isChatGptApp = useIsChatGptApp();

  const roomCode = toolOutput?.roomCode;
  const roomUrl = toolOutput?.roomUrl;
  const questions = toolResponseMetadata?.["openai/questions"];

  const [dayIndex, setDayIndex] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);

  useEffect(() => {
    // Calculate day index based on current date
    // Using epoch time to ensure consistency across users
    const launchDate = new Date(process.env.NEXT_PUBLIC_LAUNCH_DATE);
    const now = new Date();
    const timeDiff = now.getTime() - launchDate.getTime();
    const daysSinceLaunch = Math.floor(Math.abs(timeDiff / (1000 * 3600 * 24)));

    setDayIndex(daysSinceLaunch);

    if (!questions?.length || dayIndex === null) return;

    // Set up today's question
    const todayQuestionIndex = daysSinceLaunch % questions.length;
    const todayQuestion = questions[todayQuestionIndex];

    setCurrentQuestion(todayQuestion);
  }, [questions]);

  const { displayedText } = useTypewriter(currentQuestion?.text);

  const hasRoomData = roomCode && roomUrl && displayedText;

  return (
    <div
      className="bg-background relative min-h-screen overflow-hidden"
      style={{
        maxHeight,
        height: displayMode === "fullscreen" ? maxHeight : undefined,
      }}
    >
      {/* Animated color blobs */}
      <div className="absolute inset-0">
        <div className="absolute top-15 left-10 h-96 w-96 animate-[float_6s_ease-in-out_infinite] rounded-full bg-red-400 opacity-70 mix-blend-multiply blur-xl filter dark:opacity-40 dark:mix-blend-screen"></div>
        <div className="absolute top-40 right-20 h-112 w-md animate-[float_8s_ease-in-out_infinite_reverse] rounded-full bg-blue-400 opacity-70 mix-blend-multiply blur-xl filter dark:opacity-40 dark:mix-blend-screen"></div>
        <div className="absolute bottom-32 left-108 h-128 w-lg animate-[float_7s_ease-in-out_infinite_0.5s] rounded-full bg-green-400 opacity-70 mix-blend-multiply blur-xl filter dark:opacity-40 dark:mix-blend-screen"></div>
      </div>

      {/* Fullscreen button */}
      {displayMode !== "fullscreen" && (
        <button
          aria-label="Enter fullscreen"
          className="fixed top-4 right-4 z-50 cursor-pointer rounded-full bg-white p-2.5 text-slate-700 shadow-lg ring-1 ring-slate-900/10 transition-colors hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:ring-white/10 dark:hover:bg-slate-700"
          onClick={() => requestDisplayMode("fullscreen")}
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
            />
          </svg>
        </button>
      )}

      {/* Content overlay */}
      <div className="bg-background/30 dark:bg-background/50 relative z-10 flex min-h-screen items-center justify-center backdrop-blur-sm">
        <div className="w-full max-w-4xl px-6">
          {/* Development warning for non-ChatGPT environments */}
          {!isChatGptApp && (
            <div className="mb-8 w-full rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 dark:border-blue-800 dark:bg-blue-950">
              <div className="flex items-center gap-3">
                <svg
                  className="h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    This app is designed for ChatGPT
                  </p>
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    No{" "}
                    <a
                      href="https://developers.openai.com/apps-sdk/reference"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded bg-blue-100 px-1 py-0.5 font-mono underline hover:no-underline dark:bg-blue-900"
                    >
                      window.openai
                    </a>{" "}
                    property detected
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {!hasRoomData && (
            <div className="flex flex-col items-center gap-4">
              <div className="border-foreground/20 border-t-foreground h-12 w-12 animate-spin rounded-full border-4"></div>
              <p className="text-muted-foreground text-2xl font-light">
                Creating your room...
              </p>
            </div>
          )}

          {/* Success State */}
          {hasRoomData && (
            <div className="space-y-8 text-center md:space-y-16">
              <h1 className="text-foreground text-3xl leading-none font-black tracking-tight md:text-5xl">
                {displayedText}
              </h1>
              <a
                href={roomUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-foreground text-background inline-flex items-center gap-2 rounded-full border border-solid border-transparent px-6 py-3 font-medium transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
              >
                Your room is ready
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
