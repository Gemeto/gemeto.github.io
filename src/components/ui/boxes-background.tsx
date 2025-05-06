"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

export const BoxesCore = ({ className, initialRows = 10, initialCols = 10, ...rest }: 
  { className?: string, initialRows?: number, initialCols?: number }) => {
  
  // Estado para controlar el número de filas y columnas
  const [rows, setRows] = useState(new Array(initialRows).fill(1));
  const [cols, setCols] = useState(new Array(initialCols).fill(1));
  const [isFullyLoaded, setIsFullyLoaded] = useState(false);
  
  let colors = [
    "--sky-300",
    "--pink-300",
    "--green-300",
    "--yellow-300",
    "--red-300",
    "--purple-300",
    "--blue-300",
    "--indigo-300",
    "--violet-300",
  ];
  
  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Cargar progresivamente más cajas después de la carga inicial
  useEffect(() => {
    if (!isFullyLoaded) {
      const timer = setTimeout(() => {
        setRows(new Array(70).fill(1));
        setCols(new Array(70).fill(1));
        setIsFullyLoaded(true);
      }, 500); // Retraso para permitir que la página se cargue primero
      
      return () => clearTimeout(timer);
    }
  }, [isFullyLoaded]);

  return (
    <div
      style={{
        transform: `translate(-20%,-20%) skewX(-48deg) skewY(14deg) scale(1) rotate(0deg) translateZ(0)`,
      }}
      className={cn(
        "relative left-1/4 p-4 -top-1/4 flex -translate-x-1/2 -translate-y-1/2 w-full h-2 z-0 opacity-0 transition-opacity duration-500",
        isFullyLoaded ? "opacity-100" : "",
        className
      )}
      {...rest}
    >
      {rows.map((_, i) => (
        <motion.div
          key={`row` + i}
          className="w-16 h-8 border-l border-slate-700 relative"
        >
          {cols.map((_, j) => (
            <motion.div
              whileHover={{
                backgroundColor: `var(${getRandomColor()})`,
              }}
              whileTap={{
                backgroundColor: `var(${getRandomColor()})`,
              }}
              key={`col` + j}
              className="w-16 h-8 border-r border-t border-slate-700 relative paint-box"
            >
            </motion.div>
          ))}
        </motion.div>
      ))}
    </div>
  );
};

// Componente de carga diferida
export const BoxesLazy = ({ className, ...rest }: { className?: string }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    const element = document.getElementById('boxes-container');
    if (element) observer.observe(element);
    
    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);
  
  return (
    <div id="boxes-container" className={className}>
      {isVisible && <BoxesCore {...rest} />}
    </div>
  );
};

export const Boxes = React.memo(BoxesLazy);
