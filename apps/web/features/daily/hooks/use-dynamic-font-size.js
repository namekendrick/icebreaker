import { useMemo } from "react";

export const useDynamicFontSize = (text) => {
  const fontSizeClasses = useMemo(() => {
    if (!text) return "text-6xl md:text-7xl";

    const textLength = text.length;

    if (textLength <= 20) {
      return "text-6xl md:text-7xl";
    } else if (textLength <= 50) {
      return "text-5xl md:text-6xl";
    } else if (textLength <= 100) {
      return "text-4xl md:text-5xl";
    } else if (textLength <= 150) {
      return "text-3xl md:text-4xl";
    } else if (textLength <= 250) {
      return "text-2xl md:text-3xl";
    } else if (textLength <= 400) {
      return "text-xl md:text-2xl";
    } else {
      return "text-lg md:text-xl";
    }
  }, [text]);

  const minHeightClass = useMemo(() => {
    if (!text) return "min-h-[150px]";

    const textLength = text.length;

    if (textLength <= 50) {
      return "min-h-[150px]";
    } else if (textLength <= 150) {
      return "min-h-[120px]";
    } else if (textLength <= 250) {
      return "min-h-[100px]";
    } else {
      return "min-h-[80px]";
    }
  }, [text]);

  return {
    fontSizeClasses,
    minHeightClass,
  };
};
