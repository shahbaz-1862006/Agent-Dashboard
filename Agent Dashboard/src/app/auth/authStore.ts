import { create } from "zustand";

type AuthUser = {
  id: string;
  name: string;
  agentId: string;
  clanName: string;
};

type AuthState = {
  user: AuthUser | null;
  token: string | null;
  login: (email: string) => void;
  logout: () => void;
};

const LS_KEY = "clazino_agent_auth_v1";

function load(): Pick<AuthState, "user" | "token"> {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return { user: null, token: null };
    const parsed = JSON.parse(raw) as { user: AuthUser; token: string };
    return { user: parsed.user ?? null, token: parsed.token ?? null };
  } catch {
    return { user: null, token: null };
  }
}

function save(user: AuthUser | null, token: string | null) {
  try {
    if (!user || !token) {
      localStorage.removeItem(LS_KEY);
      return;
    }
    localStorage.setItem(LS_KEY, JSON.stringify({ user, token }));
  } catch {
    // ignore
  }
}

export const useAuthStore = create<AuthState>((set) => {
  const initial = load();
  return {
    user: initial.user,
    token: initial.token,
    login: (email: string) => {
      const user: AuthUser = {
        id: "agent_user_01",
        name: email.split("@")[0]?.replaceAll(".", " ") || "Agent",
        agentId: "agent_001",
        clanName: "Clazino Clan Alpha",
      };
      const token = "mock_token_" + Math.random().toString(36).slice(2);
      save(user, token);
      set({ user, token });
    },
    logout: () => {
      save(null, null);
      set({ user: null, token: null });
    },
  };
});
