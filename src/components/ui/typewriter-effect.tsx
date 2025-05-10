"use client";

import  { useState, useEffect, useRef } from 'react';

const useTypewriter = (text, speed, wait) => {
  const [displayText, setDisplayText] = useState('');
  const isFirstRender = useRef(true);
  const delayTimeoutRef = useRef(0);
  const typingIntervalRef = useRef(0);

  useEffect(() => {
    // Función para iniciar el efecto de tipeo
    const startTypingEffect = () => {
      let i = 0;
      // Guardar la referencia del intervalo para limpieza
      typingIntervalRef.current = setInterval(() => {
        if (i < text.length + 1) {
          setDisplayText(text.slice(0, i));
          i++;
        } else {
          clearInterval(typingIntervalRef.current);
        }
      }, speed);
    };

    // Limpiar temporizadores previos para evitar comportamientos inesperados
    if (delayTimeoutRef.current) clearTimeout(delayTimeoutRef.current);
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);

    if (isFirstRender.current) {
      delayTimeoutRef.current = setTimeout(() => {
        startTypingEffect();
        isFirstRender.current = false;
      }, wait);
    } else {
      startTypingEffect();
    }
    
    // Limpiar los temporizadores cuando el componente se desmonte
    return () => {
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
      if (delayTimeoutRef.current) clearTimeout(delayTimeoutRef.current);
    };
  }, [text, speed, wait]);

  return displayText;
};

export const TypewriterEffect = ({ text, speed = 50, wait = 2000 }) => {
  const displayText = useTypewriter(text, speed, wait);

  return <p style={{ position: 'relative', minHeight: '1.2em' /* Ensures a minimum height */ }}>
    {/* Hidden text to reserve space */}
    <span
      className="typewritter-placeholder"
      style={{
        visibility: 'hidden',
      }}
      aria-hidden="true"
    >
      {text || '\u00A0'} {/* Use non-breaking space if text is empty to maintain height */}
    </span>
    <span
        className="typewritter-placeholder"
        aria-hidden="true"
        style={{
          visibility: 'hidden',
          marginLeft: displayText ? '0.5rem' : '0', // Add margin only if there's text
          animation: 'blink 1s step-end infinite',
        }}
      >
        █
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
        className="typewritter-cursor"
        style={{
          marginLeft: displayText ? '0.5rem' : '0', // Add margin only if there's text
          animation: 'blink 1s step-end infinite',
        }}
      >
        █
      </span>
    </span>

    {/* Styles for blink animation */}
    <noscript>
      <style>{`
        .typewritter-cursor {
          visibility: hidden !important;
        }
        .typewritter-placeholder {
          visibility: visible !important;
        }`}
      </style>
    </noscript>
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

      /* Desactiva animaciones si el usuario prefiere reducir movimiento */
      :root.reduced-motion .typewritter-cursor {
          visibility: hidden !important;
      }
      :root.reduced-motion .typewritter-placeholder {
        visibility: visible !important;
      }
    `}</style>
  </p>;
};

export default TypewriterEffect;