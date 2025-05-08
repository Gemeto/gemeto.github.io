"use client";

import  { useState, useEffect } from 'react';

const useTypewriter = (text, speed = 50) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < text.length) {
        console.log(text.charAt(i));
        setDisplayText(prevText => text.slice(0, i));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, speed);

    return () => {
      clearInterval(typingInterval);
    };
  }, [text, speed]);

  return displayText;
};

export const TypewriterEffect = ({ text, speed }) => {
  const displayText = useTypewriter(text, speed);

  return <p style={{ position: 'relative', minHeight: '1.2em' /* Ensures a minimum height */ }}>
    {/* Hidden text to reserve space */}
    <span
      style={{
        visibility: 'hidden',
      }}
      aria-hidden="true"
    >
      {text + "██" || '\u00A0'} {/* Use non-breaking space if text is empty to maintain height */}
    </span>

    {/* Visible typing animation, absolutely positioned */}
    <span
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%', // Ensure it spans the full width
        height: '100%', // Ensure it spans the full height
      }}
    >
      {displayText}
      <span
        style={{
          marginLeft: displayText ? '0.5rem' : '0', // Add margin only if there's text
          animation: 'blink 1s step-end infinite',
        }}
      >
        █
      </span>
    </span>

    {/* Styles for blink animation */}
    <style>{`
      @keyframes blink {
        from,
        to {
          color: transparent;
        }
        50% {
          color: currentColor; /* Use currentColor to inherit text color */
        }
      }
    `}</style>
  </p>;
};

export default TypewriterEffect;