import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-5">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Page not found</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">The route you requested does not exist.</p>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Link to="/dashboard/home"><Button variant="secondary">Go to dashboard</Button></Link>
          <Link to="/auth/login"><Button variant="ghost">Sign in</Button></Link>
        </CardContent>
      </Card>
    </div>
  );
}
