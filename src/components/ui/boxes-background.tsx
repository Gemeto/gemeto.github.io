"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

export const BoxesCore = ({ className, initialRows = 10, initialCols = 10, ...rest }: 
  { className?: string, initialRows?: number, initialCols?: number }) => {
  
  // Estado para controlar el número de filas y columnas
  const [rows, setRows] = useState(new Array(initialRows).fill(1));
  const [cols, setCols] = useState(new Array(initialCols).fill(1));
  const [isFullyLoaded, setIsFullyLoaded] = useState(false);
  const [isLowPerformance, setIsLowPerformance] = useState(true);
  const benchmarkRan = useRef(false);
  const maxDuration = 25;
  
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
    const runBenchmark = () => {
      const startTime = performance.now();
      
      let result = 0;
      for (let i = 0; i < 1000000; i++) {
        if (i % 1000 === 0 && performance.now() - startTime > maxDuration) {
          break;
        }
        result += Math.sqrt(i) * Math.sin(i) / (i + 1);
      }

      const endTime = performance.now();
      const duration = endTime - startTime;
      console.log(`Benchmark duration: ${duration} ms`);
      setIsLowPerformance(duration > maxDuration);

      return result;
    };

    if(!benchmarkRan.current) {
      benchmarkRan.current = true;
      runBenchmark();
    }
    
    if(!isLowPerformance) {
      if (!isFullyLoaded) {
        setRows(new Array(70).fill(1));
        setCols(new Array(70).fill(1));
        setIsFullyLoaded(true);
      }
  }
  }, [isFullyLoaded, isLowPerformance]);

  return ( !isLowPerformance ?
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
  : '');
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
