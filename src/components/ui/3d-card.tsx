"use client";

import { cn } from "../../utils/cn";
import React, {
  createContext,
  useState,
  useContext,
  useRef,
  useEffect,
} from "react";

const MouseEnterContext = createContext<
  [boolean, React.Dispatch<React.SetStateAction<boolean>>] | [boolean, React.Dispatch<React.SetStateAction<boolean>>]
>([false, () => {}]);

export const CardContainer = ({
  children,
  className,
  containerClassName,
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMouseEntered, setIsMouseEntered] = useState(false);
  const rotationX = useRef(0);
  const rotationY = useRef(0);
  const animationRef = useRef<number | null>(null);

  const updateRotation = () => {
    if (!containerRef.current) return;

    containerRef.current.style.transform = `rotateY(${rotationY.current}deg) rotateX(${rotationX.current}deg)`;

    if (isMouseEntered) {
      animationRef.current = requestAnimationFrame(updateRotation);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } =
      containerRef.current.getBoundingClientRect();

    const x = (e.clientX - left - width / 2) / 30;
    const y = (e.clientY - top - height / 2) / 30;

    rotationY.current = x;
    rotationX.current = -y;

    if (!animationRef.current) {
      animationRef.current = requestAnimationFrame(updateRotation);
    }
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsMouseEntered(true);
    if (!containerRef.current) return;
    if (!animationRef.current) {
      animationRef.current = requestAnimationFrame(updateRotation);
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    setIsMouseEntered(false);

    rotationX.current = 0;
    rotationY.current = 0;

    if (!animationRef.current) {
      animationRef.current = requestAnimationFrame(updateRotation);
    }

    setTimeout(() => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    }, 300);
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <MouseEnterContext.Provider value={[isMouseEntered, setIsMouseEntered]}>
      <div
        className={cn(
          "pb-10 flex items-center justify-center",
          containerClassName
        )}
        style={{
          perspective: "1000px",
        }}
      >
        <div
          ref={containerRef}
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={cn(
            "flex items-center justify-center relative transition-all duration-300 ease-out will-change-transform",
            className
          )}
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          {children}
        </div>
      </div>
    </MouseEnterContext.Provider>
  );
};

export const CardBody = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "h-96 w-96 [transform-style:preserve-3d]  [&>*]:[transform-style:preserve-3d]",
        className
      )}
    >
      {children}
    </div>
  );
};

export const CardItem = ({
  as: Tag = "div",
  children,
  className,
  translateX = 0,
  translateY = 0,
  translateZ = 0,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  ...rest
}: {
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  translateX?: number | string;
  translateY?: number | string;
  translateZ?: number | string;
  rotateX?: number | string;
  rotateY?: number | string;
  rotateZ?: number | string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isMouseEntered] = useMouseEnter();

  useEffect(() => {
    handleAnimations();
  }, [isMouseEntered]);

  const handleAnimations = () => {
    if (!ref.current) return;
    if (isMouseEntered) {
      ref.current.style.transform = `translateX(${translateX}px) translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`;
    } else {
      ref.current.style.transform = `translateX(0px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)`;
    }
  };

  return (
    <Tag
      ref={ref}
      className={cn("w-fit transition duration-200 ease-linear", className)}
      {...rest}
    >
      {children}
    </Tag>
  );
};

// Create a hook to use the context
export const useMouseEnter = () => {
  const context = useContext(MouseEnterContext);
  if (context === undefined) {
    throw new Error("useMouseEnter must be used within a MouseEnterProvider");
  }
  return context;
};
