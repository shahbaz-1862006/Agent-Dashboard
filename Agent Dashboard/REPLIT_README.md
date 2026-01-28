# Clazino Agent Dashboard — Replit Deploy Notes

This project is configured to run on Replit with Vite.

## Run
Replit Run uses:
- `npm install`
- `npm run dev`

## URLs / Routing
App uses HashRouter to avoid 404 on refresh in Replit preview.

## Ports / Host
- Host: 0.0.0.0
- Port: $PORT (fallback 5000)
- allowedHosts: all (for *.replit.dev / *.repl.co)

If deploying via Replit Deployments, you can switch the start command to:
- `npm run build && npm run preview`
