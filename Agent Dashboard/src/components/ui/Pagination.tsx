import React from "react";
import { Button } from "./Button";

export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
}: {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (p: number) => void;
}) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const prevDisabled = page <= 1;
  const nextDisabled = page >= pages;

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="text-xs text-muted-foreground">
        Page <span className="text-foreground">{page}</span> of <span className="text-foreground">{pages}</span>
      </div>
      <div className="flex items-center gap-2">
        <Button size="sm" variant="secondary" disabled={prevDisabled} onClick={() => onPageChange(page - 1)}>
          Prev
        </Button>
        <Button size="sm" variant="secondary" disabled={nextDisabled} onClick={() => onPageChange(page + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
}
