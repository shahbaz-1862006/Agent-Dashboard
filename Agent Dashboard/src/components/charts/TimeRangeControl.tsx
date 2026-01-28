import React from "react";
import { Select } from "../ui/Select";

export type TimeRange = "24H" | "7D" | "30D" | "90D" | "YTD";

export function TimeRangeControl({
  value,
  onChange,
  className,
}: {
  value: TimeRange;
  onChange: (v: TimeRange) => void;
  className?: string;
}) {
  return (
    <div className={className}>
      <Select value={value} onChange={(e) => onChange(e.target.value as TimeRange)}>
        <option value="24H">24H</option>
        <option value="7D">7D</option>
        <option value="30D">30D</option>
        <option value="90D">90D</option>
        <option value="YTD">YTD</option>
      </Select>
    </div>
  );
}
