import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import { useToast } from "../../components/ui/toast";
import { useAuthStore } from "../../app/auth/authStore";

export function SettingsPage() {
  const toast = useToast();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const [twoFaEnabled, setTwoFaEnabled] = useState(true);
  const [otp, setOtp] = useState("");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Security and session preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-xl border border-border bg-card/60 p-4">
              <div className="text-xs text-muted-foreground">Agent</div>
              <div className="mt-1 text-sm font-semibold">{user?.name ?? "Agent"}</div>
              <div className="mt-1 text-xs text-muted-foreground">Agent ID: {user?.agentId ?? "—"}</div>
              <div className="mt-1 text-xs text-muted-foreground">Clan: {user?.clanName ?? "—"}</div>
            </div>
            <Button variant="secondary" onClick={() => toast.push({ title: "Profile locked", message: "Changes require admin approval.", tone: "info" })}>
              Request profile change
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Two-Factor Authentication</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm text-foreground font-medium">2FA status</div>
              <Badge tone={twoFaEnabled ? "success" : "warning"}>{twoFaEnabled ? "Enabled" : "Disabled"}</Badge>
            </div>

            {twoFaEnabled ? (
              <div className="rounded-xl border border-border bg-card/60 p-4">
                <div className="text-xs text-muted-foreground">Authenticator</div>
                <div className="mt-1 text-sm text-foreground">Active device linked</div>
                <Button
                  className="mt-3"
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setTwoFaEnabled(false);
                    toast.push({ title: "2FA disabled", message: "Disabled in mock mode.", tone: "warning" });
                  }}
                >
                  Disable 2FA
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="rounded-xl border border-border bg-card/60 p-4">
                  <div className="text-sm font-semibold">Enable 2FA</div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Scan the QR with an authenticator app, then enter the 6-digit code.
                  </p>
                  <div className="mt-3 rounded-lg border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
                    QR Placeholder • otpauth://totp/Clazino:agent?secret=MOCKSECRET
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">6-digit code</label>
                  <Input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="123456" />
                </div>
                <Button
                  variant="primary"
                  onClick={() => {
                    setTwoFaEnabled(true);
                    toast.push({ title: "2FA enabled", message: "Enabled in mock mode.", tone: "success" });
                    setOtp("");
                  }}
                >
                  Verify & Enable
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Sessions</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-xl border border-border bg-card/60 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold">Current session</div>
                <div className="mt-1 text-xs text-muted-foreground">Browser: Web • Location: PK (mock)</div>
              </div>
              <Badge tone="info">Active</Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => toast.push({ title: "Other sessions cleared", message: "All other sessions revoked (mock).", tone: "info" })}>
              Log out other sessions
            </Button>
            <Button variant="ghost" onClick={logout}>Logout</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
