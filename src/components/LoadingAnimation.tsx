
import React from 'react';

type LoadingAnimationProps = {
  small?: boolean;
  size?: "sm" | "md" | "lg";
};

const LoadingAnimation = ({ small = false, size }: LoadingAnimationProps) => {
  const getSize = () => {
    if (small) return "w-4 h-4 border-2";
    if (size === "sm") return "w-4 h-4 border-2";
    if (size === "lg") return "w-8 h-8 border-4";
    return "w-6 h-6 border-3";
  };

  return (
    <div className="flex items-center justify-center">
      <div className={`${getSize()} rounded-full border-t-transparent border-mathprimary animate-spin`}></div>
    </div>
  );
};

export default LoadingAnimation;
