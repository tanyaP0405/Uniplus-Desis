
import React from 'react';
import { cn } from "@/lib/utils";

const Card = ({ 
  children, 
  className, 
  variant = "default", 
  animation = false,
  borderHighlight = false,
  ...props 
}) => {
  const baseStyles = "rounded-lg p-6";
  
  const variants = {
    default: "bg-card text-card-foreground shadow",
    outline: "border border-border bg-transparent",
    glass: "glass-effect backdrop-blur-sm border border-white/10",
    subtle: "bg-muted/50",
    primary: "bg-primary text-primary-foreground shadow",
    accent: "bg-uniplus-50 border border-uniplus-100"
  };
  
  return (
    <div 
      className={cn(
        baseStyles, 
        variants[variant], 
        animation && "card-hover",
        borderHighlight && "border-l-4 border-l-uniplus-500",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ children, className, ...props }) => {
  return (
    <div className={cn("flex flex-col space-y-1.5 pb-4", className)} {...props}>
      {children}
    </div>
  );
};

const CardTitle = ({ children, className, ...props }) => {
  return (
    <h3 className={cn("font-semibold text-xl leading-none tracking-tight", className)} {...props}>
      {children}
    </h3>
  );
};

const CardDescription = ({ children, className, ...props }) => {
  return (
    <p className={cn("text-sm text-muted-foreground", className)} {...props}>
      {children}
    </p>
  );
};

const CardContent = ({ children, className, ...props }) => {
  return (
    <div className={cn("pt-0", className)} {...props}>
      {children}
    </div>
  );
};

const CardFooter = ({ children, className, ...props }) => {
  return (
    <div className={cn("flex items-center pt-4", className)} {...props}>
      {children}
    </div>
  );
};

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;
