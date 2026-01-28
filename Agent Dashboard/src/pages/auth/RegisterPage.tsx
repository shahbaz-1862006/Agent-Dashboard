import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Select } from "../../components/ui/Select";
import { useToast } from "../../components/ui/toast";
import { ThemeToggle } from "../../components/common/ThemeToggle";
import { Logo } from "../../components/common/Logo";
import { Eye, EyeOff } from "lucide-react";

const LS_INVITE = "clazino_invite";
const LS_CREDS = "clazino_agent_credentials";

const COUNTRY_OPTIONS = [
  { code: "+92", country: "Pakistan" },
  { code: "+971", country: "United Arab Emirates" },
  { code: "+44", country: "United Kingdom" },
  { code: "+1", country: "United States" },
  { code: "+91", country: "India" },
  { code: "+61", country: "Australia" },
  { code: "+49", country: "Germany" },
  { code: "+33", country: "France" },
  { code: "+39", country: "Italy" },
  { code: "+34", country: "Spain" },
];

function calcAge(dobISO: string) {
  const dob = new Date(dobISO);
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--;
  return age;
}

const schema = z
  .object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    email: z.string().email("Enter a valid email"),
    countryCode: z.string().min(1, "Country code is required"),
    phone: z
      .string()
      .min(7, "Enter a valid phone number")
      .regex(/^\d+$/, "Phone must contain digits only"),
    country: z.string().min(1),
    dob: z
      .string()
      .min(1, "Date of birth is required")
      .refine((v) => {
        const d = new Date(v);
        if (Number.isNaN(d.getTime())) return false;
        if (d.getTime() > Date.now()) return false;
        return calcAge(v) >= 18;
      }, "You must be 18+ to register"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must include an uppercase letter")
      .regex(/[0-9]/, "Password must include a number"),
    confirmPassword: z.string().min(1, "Confirm your password"),
    acceptTerms: z.boolean().refine((v) => v === true, "You must accept the terms"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const inviteState = useMemo(() => {
    try {
      const raw = localStorage.getItem(LS_INVITE);
      if (!raw) return null;
      return JSON.parse(raw) as { inviteVerified: boolean; inviteMeta?: { code: string } };
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    if (!inviteState?.inviteVerified) {
      navigate("/invite", { replace: true });
    }
  }, [inviteState, navigate]);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      countryCode: "+92",
      phone: "",
      country: "Pakistan",
      dob: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  const selectedCode = form.watch("countryCode");
  useEffect(() => {
    const found = COUNTRY_OPTIONS.find((c) => c.code === selectedCode);
    if (found) form.setValue("country", found.country, { shouldValidate: true });
  }, [selectedCode, form]);

  const todayISO = new Date().toISOString().slice(0, 10);

  const onSubmit = form.handleSubmit(async (values) => {
    if (!inviteState?.inviteVerified) {
      toast.push({ title: "Invite required", message: "Registration is invite-only.", tone: "warning" });
      navigate("/invite", { replace: true });
      return;
    }

    // Persist credentials for mock login
    localStorage.setItem(
      LS_CREDS,
      JSON.stringify({ email: values.email.toLowerCase(), password: values.password })
    );

    // Consume invite (mock)
    localStorage.removeItem(LS_INVITE);

    toast.push({ title: "Account created", message: "Please sign in to continue.", tone: "success" });
    navigate("/login", { replace: true });
  });

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-5">
      <div className="fixed right-4 top-4">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex flex-col items-center text-center">
            <Logo className="justify-center" />
            <div className="mt-4">
              <CardTitle>Invite-only registration</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Your account will be linked to the inviting agent clan.
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={onSubmit} className="mt-2 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground">First Name</label>
                <Input {...form.register("firstName")} placeholder="First name" />
                {form.formState.errors.firstName ? (
                  <p className="mt-1 text-xs text-destructive">{form.formState.errors.firstName.message}</p>
                ) : null}
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Last Name</label>
                <Input {...form.register("lastName")} placeholder="Last name" />
                {form.formState.errors.lastName ? (
                  <p className="mt-1 text-xs text-destructive">{form.formState.errors.lastName.message}</p>
                ) : null}
              </div>
            </div>

            <div>
              <label className="text-xs text-muted-foreground">Email</label>
              <Input {...form.register("email")} placeholder="you@email.com" />
              {form.formState.errors.email ? (
                <p className="mt-1 text-xs text-destructive">{form.formState.errors.email.message}</p>
              ) : null}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-muted-foreground">Country Code</label>
                <Select {...form.register("countryCode")}>
                  {COUNTRY_OPTIONS.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} — {c.country}
                    </option>
                  ))}
                </Select>
                {form.formState.errors.countryCode ? (
                  <p className="mt-1 text-xs text-destructive">{form.formState.errors.countryCode.message}</p>
                ) : null}
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Phone Number</label>
                <Input {...form.register("phone")} placeholder="3012345678" inputMode="numeric" />
                {form.formState.errors.phone ? (
                  <p className="mt-1 text-xs text-destructive">{form.formState.errors.phone.message}</p>
                ) : null}
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Country</label>
                <Input {...form.register("country")} readOnly />
              </div>
            </div>

            <div>
              <label className="text-xs text-muted-foreground">Date of Birth</label>
              <Input type="date" max={todayISO} {...form.register("dob")} />
              {form.formState.errors.dob ? (
                <p className="mt-1 text-xs text-destructive">{form.formState.errors.dob.message}</p>
              ) : null}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground">Password</label>
                <div className="relative">
                  <Input type={showPass ? "text" : "password"} {...form.register("password")} placeholder="Create password" />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPass((p) => !p)}
                    aria-label="Toggle password"
                  >
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {form.formState.errors.password ? (
                  <p className="mt-1 text-xs text-destructive">{form.formState.errors.password.message}</p>
                ) : null}
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Confirm Password</label>
                <div className="relative">
                  <Input type={showConfirm ? "text" : "password"} {...form.register("confirmPassword")} placeholder="Confirm password" />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowConfirm((p) => !p)}
                    aria-label="Toggle confirm password"
                  >
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {form.formState.errors.confirmPassword ? (
                  <p className="mt-1 text-xs text-destructive">{form.formState.errors.confirmPassword.message}</p>
                ) : null}
              </div>
            </div>

            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" className="mt-1" {...form.register("acceptTerms")} />
              <span>
                I accept the Terms & Privacy Policy.
              </span>
            </label>
            {form.formState.errors.acceptTerms ? (
              <p className="text-xs text-destructive">{form.formState.errors.acceptTerms.message}</p>
            ) : null}

            <Button type="submit" variant="primary" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Creating…" : "Create account"}
            </Button>

            <div className="text-xs text-muted-foreground text-center">
              Already have an account? <Link className="underline" to="/login">Sign in</Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
