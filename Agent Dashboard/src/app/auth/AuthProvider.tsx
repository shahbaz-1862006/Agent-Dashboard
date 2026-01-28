import React, { PropsWithChildren } from "react";

export function AuthProvider({ children }: PropsWithChildren) {
  // store is zustand; provider kept for future expansions (permissions, session refresh, etc.)
  return <>{children}</>;
}
