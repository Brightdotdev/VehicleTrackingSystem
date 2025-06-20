import { Pressable, PressableProps, Text } from "react-native";
import { cn } from "../../utils/cn";
import React from "react";

type ButtonProps = {
  title: string;
  onPress?: () => void;
  theme?: "primary" | "secondary" | "tertiary";
  disabled?: boolean;
} & PressableProps;

export const Button = React.forwardRef<
  React.ComponentRef<typeof Pressable>,
  ButtonProps
>(({ title, onPress, theme = "primary", disabled, ...rest }, ref) => {
  return (
    <Pressable
      ref={ref}
      onPress={onPress}
      className={cn(
        "flex-row items-center justify-center rounded-md px-5 py-3 mb-4 border",
        theme === "primary" && 
        "bg-[#217596] border-[#007AFF] dark:bg-[#0d2833] dark:border-[#15304d]",
        theme === "secondary" && 
        "bg-[#dddddd] border-[#e0e0e0]",
        theme === "tertiary" && "bg-transparent border-transparent",
        disabled && "opacity-50",
      )}
      disabled={disabled}
      {...rest}
    >
      <Text
        className={cn(
          "font-semibold text-lg tracking-wider text-foreground dark:text-foreground",
        )}
      >
        {title} {disabled}
      </Text>
    </Pressable>
  );
});

Button.displayName = "Button";