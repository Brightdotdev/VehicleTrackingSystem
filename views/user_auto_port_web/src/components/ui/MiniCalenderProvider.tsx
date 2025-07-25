"use client";

import * as React from "react";
import {
  format,
  addWeeks,
  subWeeks,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  isBefore,
  isSameDay,
  isAfter,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const DAYS_OF_WEEK = [
  { key: "sun", label: "Sun" },
  { key: "mon", label: "Mon" },
  { key: "tue", label: "Tue" },
  { key: "wed", label: "Wed" },
  { key: "thu", label: "Thu" },
  { key: "fri", label: "Fri" },
  { key: "sat", label: "Sat" },
];

export const Calendar: React.FC<{
  value?: Date;
  onChange?: (date: Date) => void;
  onDateChange?: (dateString: string) => void;
}> = ({ value, onChange, onDateChange }) => {
  const [selectedDate, setSelectedDate] = React.useState<Date>(
    value ?? new Date()
  );
  const [currentWeek, setCurrentWeek] = React.useState<Date>(new Date());

  const today = new Date();

  // Get all days in the currently visible week
  const weekDays = eachDayOfInterval({
    start: startOfWeek(currentWeek, { weekStartsOn: 0 }),
    end: endOfWeek(currentWeek, { weekStartsOn: 0 }),
  });

  // Format date as Java LocalDateTime string
  const toJavaLocalDateTime = (date: Date) => {
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate()
    )}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
      date.getSeconds()
    )}`;
  };

  React.useEffect(() => {
    if (onDateChange) {
      onDateChange(toJavaLocalDateTime(selectedDate));
    }
    if (onChange) {
      onChange(selectedDate);
    }
  }, [selectedDate, onDateChange, onChange]);

  // 🔐 Disable going to weeks before today
  const previousWeekEnd = endOfWeek(subWeeks(currentWeek, 1), {
    weekStartsOn: 0,
  });
  const canGoBack = isAfter(previousWeekEnd, today);

  return (
    <div className="overflow-hidden rounded-lg border text-card-foreground shadow">
      {/* Header with Month and Nav */}
      <div className="flex items-center justify-between p-4">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}
          disabled={!canGoBack}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-sm font-medium">
          {format(currentWeek, "MMMM yyyy")}
        </h2>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 text-center px-4 gap-2 mb-2">
        {DAYS_OF_WEEK.map((day) => (
          <div
            key={day.key}
            className="w-9 h-4 p-0 font-normal text-xs font-medium text-muted-foreground"
          >
            {day.label}
          </div>
        ))}
      </div>

      {/* Day buttons */}
      <div className="grid grid-cols-7 text-center gap-4 px-4 py-2 pt-0">
        {weekDays.map((day) => {
          const isSelected = isSameDay(day, selectedDate);
          const isInPast = isBefore(day, today);

          const dayButton = (
            <Button
              type="button"
              key={day.toString()}
              variant={isSelected ? "default" : "ghost"}
              className={cn(
                "w-9 p-0 font-normal",
                isSelected &&
                  "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
              )}
              onClick={() => {
                setSelectedDate(day);
                if (onChange) onChange(day);
              }}
              disabled={isInPast}
            >
              <time dateTime={format(day, "yyyy-MM-dd")}>
                {format(day, "d")}
              </time>
            </Button>
          );

          // ⛔ Wrap past dates in tooltip
          if (isInPast) {
            return (
              <Tooltip key={day.toString()}>
                <TooltipTrigger asChild>{dayButton}</TooltipTrigger>
                <TooltipContent side="top">
                  <p>You can't dispatch back in time 🌀</p>
                </TooltipContent>
              </Tooltip>
            );
          }

          // ✅ Otherwise, just render normally
          return dayButton;
        })}
      </div>
    </div>
  );
};
