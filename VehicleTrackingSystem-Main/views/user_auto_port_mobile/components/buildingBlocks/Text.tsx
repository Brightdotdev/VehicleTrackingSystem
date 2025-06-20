import { Text } from "react-native";
import { cn } from "../../utils/cn";
import React from "react";

type TextElementInterface = {
  children: React.ReactNode;
  size?:  "xs" | "sm" | "sm-1" | "sm-2"| "sm-3"
  |"md"|"md-2"|"md-3"|"lg"|"xl"|"xxl"|"xxxl"  ;
  bold?: boolean;
  color?: "primary" | "muted";
  center?: boolean;
  className?: string;
};

export function TextElement({
  children,
  size = "md",
  bold = false,
  color = "primary",
  center = false,
  className,
}: TextElementInterface) {
  return (
    <Text
      className={cn(
        size === "xs" && "text-xs m-2",
        size === "sm" && "text-sm m-2 ",
        size === "sm-1" && "text-sm-1 m-2 ",
        size === "sm-2" && "text-sm-2 m-2 ",
        size === "sm-3" && "text-sm-3 m-2 ",
        size === "md" && "text-md m-2 ",
        size === "md-2" && "text-md-2 m-2 ",
        size === "md-3" && "text-md-3 m-2 ",
        size === "lg" && "text-lg m-2 ",
        size === "xl" && "text-xl m-2 ",
        size === "xxl" && "text-xxl m-2 ",
        size === "xxxl" && "text-xxxl m-2 ",

        bold && "font-bold",

        color === "primary" && "text-foreground dark:text-foreground",
        color === "muted" && "text-muted dark:text-muted",
        center && "text-center",
        
        className,
      )}
    >
      {children}
    </Text>
  );
}