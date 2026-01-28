export function printTableAsPdf(opts: {
  title: string;
  columns: string[];
  rows: Array<Array<string | number>>;
}) {
  const w = window.open("", "_blank", "noopener,noreferrer");
  if (!w) return;
  const styles = `
    body{font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial; padding:24px;}
    h1{font-size:16px; margin:0 0 12px 0;}
    table{border-collapse:collapse; width:100%; font-size:12px;}
    th,td{border:1px solid #ddd; padding:8px; text-align:left; vertical-align:top;}
    th{background:#f5f5f5;}
  `;

  const esc = (s: any) => String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

  const thead = `<tr>${opts.columns.map((c) => `<th>${esc(c)}</th>`).join("")}</tr>`;
  const tbody = opts.rows
    .map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join("")}</tr>`)
    .join("");

  w.document.write(`<!doctype html><html><head><title>${esc(opts.title)}</title><style>${styles}</style></head><body><h1>${esc(opts.title)}</h1><table>${thead}${tbody}</table><script>window.onload=()=>{window.print();}</script></body></html>`);
  w.document.close();
}
