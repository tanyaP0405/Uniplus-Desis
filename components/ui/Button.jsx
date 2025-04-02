import React from 'react';
import { cn } from "@/lib/utils";

const Button = ({ 
  children, 
  variant = "default", 
  size = "default", 
  className, 
  loading = false,
  icon,
  iconPosition = "left",
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    default: "bg-primary text-primary-foreground shadow hover:bg-primary/90 focus-visible:ring-primary",
    destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 focus-visible:ring-destructive",
    outline: "border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground focus-visible:ring-primary",
    secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 focus-visible:ring-primary",
    ghost: "hover:bg-accent hover:text-accent-foreground focus-visible:ring-primary",
    link: "text-primary underline-offset-4 hover:underline focus-visible:ring-primary",
    primary: "bg-uniplus-600 text-white shadow hover:bg-uniplus-700 focus-visible:ring-uniplus-500",
    accent: "bg-uniplus-500 text-white shadow hover:bg-uniplus-600 focus-visible:ring-uniplus-400",
    glass: "glass-effect text-primary shadow-md hover:shadow-lg focus-visible:ring-primary"
  };
  
  const sizes = {
    default: "h-9 px-4 py-2",
    sm: "h-8 rounded-md px-3 text-xs",
    lg: "h-11 rounded-md px-8 text-base",
    icon: "h-9 w-9"
  };
  
  const renderIcon = () => {
    if (!icon) return null;
    
    return React.cloneElement(icon, {
      className: cn(
        "h-5 w-5",
        children && iconPosition === "left" && "mr-2",
        children && iconPosition === "right" && "ml-2"
      )
    });
  };
  
  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        loading && "cursor-wait",
        className
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && (
        <svg 
          className="mr-2 h-4 w-4 animate-spin" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          ></circle>
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {iconPosition === "left" && renderIcon()}
      {children}
      {iconPosition === "right" && renderIcon()}
    </button>
  );
};

export default Button; // ✅ Ensure this line is present
