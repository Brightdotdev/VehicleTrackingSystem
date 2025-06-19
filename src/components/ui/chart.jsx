import * as React from "react";
import * as RechartsPrimitive from "recharts";

import { cn } from "@/lib/utils";

const THEMES = { light: "", dark: ".dark" };

const ChartContext = React.createContext(null);

function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }
  return context;
}

const ChartContainer = React.forwardRef(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        ref={ref}
        className={cn("flex aspect-video justify-center text-xs", className)}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
});
ChartContainer.displayName = "Chart";

const ChartStyle = ({ id, config }) => {
  const colorConfig = Object.entries(config).filter(([_, cfg]) => cfg.theme || cfg.color);
  if (!colorConfig.length) return null;

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(([theme, prefix]) => {
            return `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color = itemConfig.theme?.[theme] || itemConfig.color;
    return color ? `  --color-${key}: ${color};` : null;
  })
  .filter(Boolean)
  .join("\n")}
}`;
          })
          .join("\n"),
      }}
    />
  );
};

const ChartTooltip = RechartsPrimitive.Tooltip;

const ChartTooltipContent = React.forwardRef(
  (
    {
      active,
      payload,
      className,
      indicator = "dot",
      hideLabel = false,
      hideIndicator = false,
      label,
      labelFormatter,
      labelClassName,
      formatter,
      color,
      nameKey,
      labelKey,
    },
    ref
  ) => {
    const { config } = useChart();

    const tooltipLabel = React.useMemo(() => {
      if (hideLabel || !payload?.length) return null;
      const [item] = payload;
      const key = `${labelKey || item.dataKey || item.name || "value"}`;
      const itemConfig = getPayloadConfigFromPayload(config, item, key);
      const value =
        !labelKey && typeof label === "string"
          ? config[label]?.label || label
          : itemConfig?.label;

      if (labelFormatter) {
        return <div className={cn("font-medium", labelClassName)}>{labelFormatter(value, payload)}</div>;
      }
      return value ? <div className={cn("font-medium", labelClassName)}>{value}</div> : null;
    }, [label, labelFormatter, payload, hideLabel, labelClassName, config, labelKey]);

    if (!active || !payload?.length) return null;
    const nestLabel = payload.length === 1 && indicator !== "dot";

    return (
      <div
        ref={ref}
        className={cn("grid min-w-[8rem] gap-2 rounded-md border bg-popover p-2 text-popover-foreground shadow-xl", className)}
      >
        {!nestLabel ? tooltipLabel : null}
        <div className="grid gap-1.5">
          {payload.map((item) => {
            const key = `${nameKey || item.name || item.dataKey || "value"}`;
            const itemConfig = getPayloadConfigFromPayload(config, item, key);
            const indicatorColor = color || item.payload?.fill || item.color;

            return (
              <div key={item.dataKey} className={cn("flex w-full justify-between", indicator === "dot" && "items-center")}>
                {!hideIndicator && (
                  <span
                    className="mr-2 h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: indicatorColor }}
                  />
                )}
                <span className="text-muted-foreground">{item.name}</span>
                <span className="font-medium">{formatter ? formatter(item.value) : item.value}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);
ChartTooltipContent.displayName = "ChartTooltipContent";

// You may need to define or import getPayloadConfigFromPayload if it's external

export {
  ChartContainer as Chart,
  ChartTooltip,
  ChartTooltipContent,
};
