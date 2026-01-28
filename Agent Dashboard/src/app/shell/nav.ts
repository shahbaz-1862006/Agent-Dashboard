import {
  Home,
  Wallet,
  Users,
  Send,
  ReceiptText,
  Shield,
  Target,
  Swords,
  Settings,
} from "lucide-react";

export const navItems = [
  { to: "/dashboard/home", label: "Home", icon: Home },
  { to: "/dashboard/wallet", label: "Wallet", icon: Wallet },
  { to: "/dashboard/players", label: "Players", icon: Users },
  { to: "/dashboard/invites", label: "Invites", icon: Send },
  { to: "/dashboard/payouts", label: "Payouts", icon: ReceiptText },
  { to: "/dashboard/commissions", label: "Commissions", icon: Shield },
  { to: "/dashboard/clan/goals", label: "Clan Goals", icon: Target },
  { to: "/dashboard/clan/wars", label: "Clan Wars", icon: Swords },
  { to: "/dashboard/settings", label: "Settings", icon: Settings },
];
