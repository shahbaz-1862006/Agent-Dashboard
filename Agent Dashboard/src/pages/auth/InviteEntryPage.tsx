import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { useToast } from "../../components/ui/toast";
import { ThemeToggle } from "../../components/common/ThemeToggle";
import { Logo } from "../../components/common/Logo";

type InviteResult =
  | { ok: true; meta: { code: string; email?: string; expiresAt: string } }
  | { ok: false; reason: "invalid" | "expired" | "used" };

const LS_INVITE = "clazino_invite";

const MOCK_INVITES: Record<string, { email?: string; expiresAt: string; used?: boolean }> = {
  "CLZ-AGENT-2026": { email: "agent@example.com", expiresAt: "2027-01-01T00:00:00.000Z" },
  "BETA-123456": { expiresAt: "2027-01-01T00:00:00.000Z" },
  "VIP-PAK-900": { expiresAt: "2027-01-01T00:00:00.000Z" },
};

function verifyInvite(codeRaw: string): Promise<InviteResult> {
  const code = codeRaw.trim().toUpperCase();
  return new Promise((resolve) => {
    window.setTimeout(() => {
      const found = MOCK_INVITES[code];
      if (!found) return resolve({ ok: false, reason: "invalid" });
      if (found.used) return resolve({ ok: false, reason: "used" });
      if (new Date(found.expiresAt).getTime() < Date.now()) return resolve({ ok: false, reason: "expired" });
      return resolve({ ok: true, meta: { code, email: found.email, expiresAt: found.expiresAt } });
    }, 650);
  });
}

export function InviteEntryPage() {
  const navigate = useNavigate();
  const toast = useToast();

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [inlineError, setInlineError] = useState<string | null>(null);

  async function onVerify() {
    const trimmed = code.trim();
    if (!trimmed) {
      setInlineError("Invite code is required.");
      return;
    }
    if (trimmed.length < 6) {
      setInlineError("Invite code looks incomplete.");
      return;
    }

    setInlineError(null);
    setLoading(true);
    const res = await verifyInvite(trimmed);
    setLoading(false);

    if (!res.ok) {
      const msg =
        res.reason === "expired"
          ? "Invite expired. Request a new one from Admin."
          : res.reason === "used"
          ? "Invite already used. Sign in instead."
          : "Invalid invite code.";
      toast.push({ title: "Verification failed", message: msg, tone: "warning" });
      setInlineError(msg);
      return;
    }

    localStorage.setItem(
      LS_INVITE,
      JSON.stringify({ inviteVerified: true, inviteMeta: res.meta })
    );
    toast.push({ title: "Invite verified", message: "Continue to registration.", tone: "success" });
    navigate("/register", { replace: true });
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-5">
      <div className="fixed right-4 top-4">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="flex flex-col items-center text-center">
            <Logo className="justify-center" />
            <div className="mt-4">
              <CardTitle>Enter Invitation Code</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Use the invite code sent by Admin to continue.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground">Invite Code</label>
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. CLZ-AGENT-2026"
              autoComplete="off"
            />
            {inlineError ? <p className="mt-1 text-xs text-warning">{inlineError}</p> : null}
          </div>

          <Button className="w-full" variant="primary" onClick={onVerify} disabled={loading}>
            {loading ? "Verifying…" : "Verify Code"}
          </Button>

          <div className="text-xs text-muted-foreground text-center">
            Already have an account? <Link className="underline" to="/login">Sign in</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
