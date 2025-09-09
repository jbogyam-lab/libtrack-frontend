import React from "react";

function Card({ 
  children, 
  variant = "default",
  padding = "normal",
  className = "" 
}) {
  const baseClasses = "rounded-lg transition-all duration-200";
  
  const variants = {
    default: "bg-white dark:bg-gray-800 shadow-md hover:shadow-lg",
    elevated: "bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl",
    outlined: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
    flat: "bg-gray-50 dark:bg-gray-900"
  };

  const paddings = {
    tight: "p-3",
    normal: "p-6",
    loose: "p-8"
  };

  return (
    <div 
      className={`
        ${baseClasses}
        ${variants[variant]}
        ${paddings[padding]}
        ring-1 ring-gray-900/5 dark:ring-gray-700/50
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export default Card;
