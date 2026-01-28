import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { useAuthStore } from "../../app/auth/authStore";
import { useToast } from "../../components/ui/toast";
import { ThemeToggle } from "../../components/common/ThemeToggle";
import { Logo } from "../../components/common/Logo";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type Form = z.infer<typeof schema>;

const LS_CREDS = "clazino_agent_credentials";

export function LoginPage() {
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const toast = useToast();
  const location = useLocation() as any;

  const { register, handleSubmit, formState } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = handleSubmit((v) => {
    let stored: { email: string; password: string } | null = null;
    try {
      const raw = localStorage.getItem(LS_CREDS);
      if (raw) stored = JSON.parse(raw);
    } catch {
      stored = null;
    }

    if (!stored || stored.email !== v.email.toLowerCase() || stored.password !== v.password) {
      toast.push({ title: "Sign in failed", message: "Email or password is incorrect.", tone: "warning" });
      return;
    }

    login(v.email);
    toast.push({ title: "Signed in", message: "Welcome back.", tone: "success" });
    const to = location?.state?.from ?? "/dashboard/home";
    navigate(to, { replace: true });
  });

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-5">
      <div className="fixed right-4 top-4">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex flex-col items-center text-center">
            <Logo className="justify-center" />
            <div className="mt-4">
              <CardTitle>Sign in</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">Access is invite-only. Use your agent credentials.</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form className="space-y-3" onSubmit={onSubmit}>
            <div>
              <label className="text-xs text-muted-foreground">Email</label>
              <Input {...register("email")} placeholder="agent@company.com" />
              {formState.errors.email ? <p className="mt-1 text-xs text-destructive">{formState.errors.email.message}</p> : null}
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Password</label>
              <Input type="password" {...register("password")} placeholder="••••••••" />
              {formState.errors.password ? <p className="mt-1 text-xs text-destructive">{formState.errors.password.message}</p> : null}
            </div>

            <Button type="submit" variant="primary" className="w-full" disabled={formState.isSubmitting}>
              Sign in
            </Button>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <Link to="/invite" className="hover:underline">Enter invite code</Link>
              <Link to="/register" className="hover:underline">Create an account</Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
