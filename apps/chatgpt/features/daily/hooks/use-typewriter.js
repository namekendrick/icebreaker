import { useState, useEffect } from "react";

export const useTypewriter = (text, options = {}) => {
  const { speed = 50, showCursor = true } = options;
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!text) return;

    setDisplayedText("");
    setIsTyping(true);

    let currentIndex = 0;

    const typeInterval = setInterval(() => {
      if (currentIndex < text.length) {
        const currentText = text.slice(0, currentIndex + 1);
        setDisplayedText(showCursor ? currentText + "|" : currentText);
        currentIndex++;
      } else {
        setDisplayedText(text);
        setIsTyping(false);
        clearInterval(typeInterval);
      }
    }, speed);

    return () => clearInterval(typeInterval);
  }, [text, speed, showCursor]);

  return {
    displayedText,
    isTyping,
  };
};
