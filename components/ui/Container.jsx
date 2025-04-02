
import React from 'react';
import { cn } from "@/lib/utils";

const Container = ({ 
  children, 
  className, 
  as: Component = "div",
  size = "default",
  ...props 
}) => {
  const sizeClasses = {
    sm: "max-w-3xl",
    default: "max-w-5xl",
    md: "max-w-5xl",
    lg: "max-w-6xl",
    xl: "max-w-7xl",
    full: "max-w-full"
  };
  
  return (
    <Component 
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8", 
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Container;
