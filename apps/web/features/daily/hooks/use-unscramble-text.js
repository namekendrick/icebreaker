import { useState, useEffect, useRef } from "react";

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

export const useUnscrambleText = () => {
  const [displayText, setDisplayText] = useState("");
  const [isUnscrambling, setIsUnscrambling] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const animationRef = useRef(null);
  const timeoutRef = useRef(null);
  const scrambledCharsRef = useRef([]);

  const startUnscramble = (finalText) => {
    if (isUnscrambling) return;

    setIsUnscrambling(true);
    setIsFinished(false);
    const scrambleDuration = 2000;
    const revealDuration = 3000;
    const totalDuration = scrambleDuration + revealDuration;
    const frameRate = 60;
    const scrambleUpdateRate = 100;
    const totalFrames = (totalDuration / 1000) * frameRate;
    let currentFrame = 0;
    let lastScrambleUpdate = 0;

    scrambledCharsRef.current = finalText
      .split("")
      .map((char) =>
        char === " "
          ? " "
          : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)],
      );

    const animate = () => {
      currentFrame++;
      const elapsedTime = (currentFrame / frameRate) * 1000;
      const currentTime = Date.now();

      const isScramblePhase = elapsedTime < scrambleDuration;
      const revealProgress = isScramblePhase
        ? 0
        : Math.min(1, (elapsedTime - scrambleDuration) / revealDuration);

      if (currentTime - lastScrambleUpdate > scrambleUpdateRate) {
        for (let i = 0; i < finalText.length; i++) {
          if (finalText[i] !== " ") {
            if (isScramblePhase) {
              scrambledCharsRef.current[i] =
                SCRAMBLE_CHARS[
                  Math.floor(Math.random() * SCRAMBLE_CHARS.length)
                ];
            } else if (revealProgress <= i / finalText.length) {
              scrambledCharsRef.current[i] =
                SCRAMBLE_CHARS[
                  Math.floor(Math.random() * SCRAMBLE_CHARS.length)
                ];
            }
          }
        }
        lastScrambleUpdate = currentTime;
      }

      let scrambledText = "";
      for (let i = 0; i < finalText.length; i++) {
        if (finalText[i] === " ") {
          scrambledText += " ";
        } else if (!isScramblePhase && revealProgress > i / finalText.length) {
          scrambledText += finalText[i];
        } else {
          scrambledText += scrambledCharsRef.current[i];
        }
      }

      setDisplayText(scrambledText);

      if (currentFrame < totalFrames) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayText(finalText);
        setIsFinished(true);
        timeoutRef.current = setTimeout(() => {
          setIsUnscrambling(false);
          setIsFinished(false);
          setDisplayText("");
        }, 2000);
      }
    };

    animate();
  };

  const reset = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsUnscrambling(false);
    setIsFinished(false);
    setDisplayText("");
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    displayText,
    isUnscrambling,
    isFinished,
    startUnscramble,
    reset,
  };
};
