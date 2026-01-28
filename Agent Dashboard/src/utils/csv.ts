export function downloadCsv(filename: string, rows: Record<string, any>[]) {
  const headers = Object.keys(rows[0] ?? {});
  const escape = (v: any) => {
    const s = String(v ?? "");
    if (/[",\n]/.test(s)) return '"' + s.replaceAll('"', '""') + '"';
    return s;
  };
  const csv = [headers.join(","), ...rows.map((r) => headers.map((h) => escape(r[h])).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
