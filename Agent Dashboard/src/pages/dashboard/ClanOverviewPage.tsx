import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";

export function ClanOverviewPage() {
  const nav = useNavigate();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold">Clan Hub</h1>
        <p className="mt-1 text-sm text-muted-foreground">Goals, rewards, and competitive events.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>Goals & Rewards</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">Track weekly progress and reward states.</p>
            <Button variant="secondary" onClick={() => nav("/dashboard/clan/goals")}>Open goals</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Clan Wars</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">Register, monitor live scores, and view outcomes.</p>
            <Button variant="secondary" onClick={() => nav("/dashboard/clan/wars")}>Open wars</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
