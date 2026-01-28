import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import * as Dialog from "@radix-ui/react-dialog";

import { navItems } from "./nav";
import { cn } from "../../components/ui/cn";
import { Button } from "../../components/ui/Button";
import { Logo } from "../../components/common/Logo";

type Props = {
  userName?: string;
  clanName?: string;
  collapsed: boolean;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
  onLogout: () => void;
};

/**
 * Sidebar (Desktop + Mobile)
 * - Desktop: collapsible (click from topbar)
 * - Mobile: Radix Dialog slide-in
 */
export function Sidebar({
  userName,
  clanName,
  collapsed,
  mobileOpen,
  setMobileOpen,
  onLogout,
}: Props) {
  const navigate = useNavigate();
  const sidebarWidthClass = collapsed ? "w-16" : "w-72";

  return (
    <>
      {/* Mobile sidebar */}
      <Dialog.Root open={mobileOpen} onOpenChange={setMobileOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content className="fixed left-0 top-0 z-50 h-full w-80 max-w-[92vw] border-r border-border bg-card text-card-foreground shadow-panel data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left">
            <div className="flex h-full flex-col">
              <div className="px-5 py-5 border-b border-border">
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    navigate("/dashboard/home");
                  }}
                  className="text-left"
                >
                  <Logo />
                  <div className="mt-1 text-xs text-muted-foreground">Agent Dashboard</div>
                </button>
              </div>

              <nav className="px-3 py-3">
                {navItems.map((it) => (
                  <NavLink
                    key={it.to}
                    to={it.to}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors",
                        isActive && "bg-muted text-foreground border border-border"
                      )
                    }
                  >
                    <it.icon className="h-4 w-4 opacity-90" />
                    <span>{it.label}</span>
                  </NavLink>
                ))}
              </nav>

              <div className="mt-auto px-5 py-4 border-t border-border">
                <div className="text-xs text-muted-foreground">Signed in as</div>
                <div className="mt-1 text-sm font-medium">{userName ?? "Agent"}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">{clanName ?? "Clan"}</div>
                <div className="mt-3 flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setMobileOpen(false);
                      navigate("/dashboard/settings");
                    }}
                  >
                    Settings
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setMobileOpen(false);
                      onLogout();
                    }}
                  >
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden md:flex h-screen flex-col border-r border-border bg-card/60",
          sidebarWidthClass,
          collapsed && "group/sidebar hover:w-72 transition-[width] duration-200"
        )}
      >
        <div className={cn("px-4 py-5", collapsed && "px-3")}
        >
          <button
            type="button"
            onClick={() => navigate("/dashboard/home")}
            className={cn("w-full", collapsed && "flex justify-center")}
          >
            <Logo compact={collapsed} className={cn(collapsed && "justify-center")} />
          </button>
          <div className={cn("mt-1 text-xs text-muted-foreground", collapsed && "hidden group-hover/sidebar:block")}
          >
            Agent Dashboard
          </div>
        </div>

        <nav className={cn("px-2 pb-4", collapsed && "px-2")}
        >
          {navItems.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors",
                  isActive && "bg-muted text-foreground border border-border",
                  collapsed && "justify-center px-0"
                )
              }
            >
              <it.icon className="h-4 w-4 opacity-90" />
              <span className={cn("whitespace-nowrap", collapsed && "hidden group-hover/sidebar:inline")}>{it.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto px-4 py-4 border-t border-border">
          <div className={cn("text-xs text-muted-foreground", collapsed && "hidden group-hover/sidebar:block")}>Signed in as</div>
          <div className={cn("mt-1 text-sm font-medium", collapsed && "hidden group-hover/sidebar:block")}>{userName ?? "Agent"}</div>
          <div className={cn("mt-0.5 text-xs text-muted-foreground", collapsed && "hidden group-hover/sidebar:block")}>{clanName ?? "Clan"}</div>
          <div className={cn("mt-3 flex gap-2", collapsed && "hidden group-hover/sidebar:flex")}
          >
            <Button size="sm" variant="secondary" onClick={() => navigate("/dashboard/settings")}>Settings</Button>
            <Button size="sm" variant="ghost" onClick={onLogout}>Logout</Button>
          </div>
        </div>
      </aside>
    </>
  );
}
