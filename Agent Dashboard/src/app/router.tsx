import { Navigate, Route, Routes } from "react-router-dom";
import { RequireAuth } from "./auth/RequireAuth";
import { DashboardLayout } from "./shell/DashboardLayout";

import { LoginPage } from "../pages/auth/LoginPage";
import { RegisterPage } from "../pages/auth/RegisterPage";
import { InviteEntryPage } from "../pages/auth/InviteEntryPage";
import { NotFoundPage } from "../pages/misc/NotFoundPage";

import { HomePage } from "../pages/dashboard/HomePage";
import { WalletPage } from "../pages/dashboard/WalletPage";
import { PlayersPage } from "../pages/dashboard/PlayersPage";
import { PlayerDetailPage } from "../pages/dashboard/PlayerDetailPage";
import { InvitesPage } from "../pages/dashboard/InvitesPage";
import { PayoutsPage } from "../pages/dashboard/PayoutsPage";
import { CommissionsPage } from "../pages/dashboard/CommissionsPage";
import { StatementDetailPage } from "../pages/dashboard/StatementDetailPage";
import { ClanOverviewPage } from "../pages/dashboard/ClanOverviewPage";
import { ClanGoalsPage } from "../pages/dashboard/ClanGoalsPage";
import { ClanWarsPage } from "../pages/dashboard/ClanWarsPage";
import { WarDetailPage } from "../pages/dashboard/WarDetailPage";
import { SettingsPage } from "../pages/dashboard/SettingsPage";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/invite" replace />} />

      <Route path="/invite" element={<InviteEntryPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Backwards compatible redirects */}
      <Route path="/auth/login" element={<Navigate to="/login" replace />} />
      <Route path="/auth/register" element={<Navigate to="/register" replace />} />

      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <DashboardLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="home" replace />} />
        <Route path="home" element={<HomePage />} />
        <Route path="wallet" element={<WalletPage />} />
        <Route path="players" element={<PlayersPage />} />
        <Route path="players/:playerId" element={<PlayerDetailPage />} />
        <Route path="invites" element={<InvitesPage />} />
        <Route path="payouts" element={<PayoutsPage />} />
        <Route path="commissions" element={<CommissionsPage />} />
        <Route path="commissions/statements/:statementId" element={<StatementDetailPage />} />
        <Route path="clan" element={<ClanOverviewPage />} />
        <Route path="clan/goals" element={<ClanGoalsPage />} />
        <Route path="clan/wars" element={<ClanWarsPage />} />
        <Route path="clan/wars/:warId" element={<WarDetailPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}
