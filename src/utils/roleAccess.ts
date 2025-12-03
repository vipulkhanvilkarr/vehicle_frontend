// src/utils/roleAccess.ts
import { useAppSelector } from "../hooks";
import type { RootState } from "../app/store";

export function useRoleAccess() {
  const user = useAppSelector((s: RootState) => s.auth.user);

  return {
    isSuperAdmin: user?.role === "SUPER_ADMIN",
    isAdmin: user?.role === "ADMIN",
    isUser: user?.role === "USER",
    hasRole: (roles: string[]) => !!user && roles.includes(user.role ?? ""),
    role: user?.role,
    user,
  };
}
