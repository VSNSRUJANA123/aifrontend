import React, { useState, useEffect, useRef } from "react";

const Typewriter = ({ text, speed = 10 }) => {
  const [displayedText, setDisplayedText] = useState([]);
  const typewriterRef = useRef(null);

  useEffect(() => {
    let paragraphs = text.split("\n");

    let interval;
    let currentIndex = 0;
    let currentText = "";

    const typeText = () => {
      if (currentIndex < paragraphs.length) {
        let paragraph = paragraphs[currentIndex];
        if (currentText.length < paragraph.length) {
          currentText += paragraph[currentText.length];
          setDisplayedText((prev) => [...prev.slice(0, -1), currentText]);
        } else {
          currentIndex++;
          currentText = "";
          setDisplayedText((prev) => [...prev, ""]);
        }
      } else {
        clearInterval(interval);
      }

      if (typewriterRef.current) {
        typewriterRef.current.scrollTop = typewriterRef.current.scrollHeight;
      }
    };

    interval = setInterval(typeText, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <div className="typewriter" ref={typewriterRef}>
      {displayedText.map((line, index) => (
        <p key={index}>{line}</p>
      ))}
    </div>
  );
};

export default Typewriter;
