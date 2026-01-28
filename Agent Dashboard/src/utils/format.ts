export function fmtUSDT(n: number) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(n) + " USDT";
}

export function fmtPct(n: number) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(n) + "%";
}
