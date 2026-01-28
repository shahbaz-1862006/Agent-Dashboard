import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../auth/authStore";
import { Button } from "../../components/ui/Button";
import { ThemeToggle } from "../../components/common/ThemeToggle";
import { Menu } from "lucide-react";
import { Sidebar } from "./Sidebar";

export function DashboardLayout() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const STORAGE_KEY = "clazino_sidebar_collapsed";
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === "1"; // default expanded
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, collapsed ? "1" : "0");
  }, [collapsed]);

  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        <Sidebar
          userName={user?.name}
          clanName={user?.clanName}
          collapsed={collapsed}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          onLogout={logout}
        />

        <main className="flex-1">
          <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
            <div className="mx-auto max-w-[1400px] px-5 py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                {/* Mobile menu */}
                <div className="md:hidden">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setMobileOpen(true)}
                    aria-label="Open sidebar"
                    title="Open sidebar"
                  >
                    <Menu className="h-4 w-4" />
                  </Button>
                </div>
                {/* Desktop sidebar toggle */}
                <div className="hidden md:block">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setCollapsed((p) => !p)}
                    aria-label="Toggle sidebar"
                    title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                  >
                    <Menu className="h-4 w-4" />
                  </Button>
                </div>

                <div>
                  <div className="text-xs text-muted-foreground">Agent</div>
                  <div className="text-sm font-semibold">{user?.clanName ?? "Clan"}</div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <ThemeToggle />
                <Button size="sm" variant="secondary" onClick={() => navigate("/dashboard/invites")}>Invite Player</Button>
                <Button size="sm" variant="secondary" onClick={() => navigate("/dashboard/wallet")}>Deposit USDT</Button>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-[1400px] px-5 py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
