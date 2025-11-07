"use client";

import { useEffect, useState } from "react";

import { useGetQuestions } from "@/features/daily/api/use-get-questions";
import { useDailyQuestionState } from "@/features/daily/hooks/use-daily-question-state";

export const DailyQuestionProvider = ({ children }) => {
  const { data: questions, isLoading } = useGetQuestions();
  const [questionSetupComplete, setQuestionSetupComplete] = useState(false);

  // Get state setters from Zustand
  const setDayIndex = useDailyQuestionState((state) => state.setDayIndex);
  const setCurrentQuestion = useDailyQuestionState(
    (state) => state.setCurrentQuestion,
  );
  const setQuestionStateReady = useDailyQuestionState(
    (state) => state.setQuestionStateReady,
  );
  const resetDailyState = useDailyQuestionState(
    (state) => state.resetDailyState,
  );

  // Get current values
  const dayIndex = useDailyQuestionState((state) => state.dayIndex);
  const questionStateReady = useDailyQuestionState(
    (state) => state.questionStateReady,
  );

  useEffect(() => {
    // Calculate day index based on current date
    // Using epoch time to ensure consistency across users
    const launchDate = new Date(process.env.NEXT_PUBLIC_LAUNCH_DATE);
    const now = new Date();
    const timeDiff = now.getTime() - launchDate.getTime();
    const daysSinceLaunch = Math.floor(Math.abs(timeDiff / (1000 * 3600 * 24)));

    setDayIndex(daysSinceLaunch);

    if (!questions?.length || dayIndex === null || isLoading) return;

    // Set up today's question
    const todayQuestionIndex = daysSinceLaunch % questions.length;
    const todayQuestion = questions[todayQuestionIndex];

    setCurrentQuestion(todayQuestion);

    // Reset daily state if it's a new day
    resetDailyState(daysSinceLaunch);

    setQuestionSetupComplete(true);
  }, [
    questions,
    dayIndex,
    isLoading,
    setDayIndex,
    setCurrentQuestion,
    resetDailyState,
  ]);

  useEffect(() => {
    if (!questionSetupComplete) return;
    if (!questionStateReady) setQuestionStateReady(true);
  }, [questionSetupComplete, questionStateReady, setQuestionStateReady]);

  return <>{children}</>;
};

export const useDailyQuestion = () => {
  const currentQuestion = useDailyQuestionState(
    (state) => state.currentQuestion,
  );
  const questionStateReady = useDailyQuestionState(
    (state) => state.questionStateReady,
  );
  const dayIndex = useDailyQuestionState((state) => state.dayIndex);

  return {
    currentQuestion,
    questionStateReady,
    dayIndex,
  };
};
