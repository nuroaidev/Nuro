import { createContext, useContext } from "react";

/**
 * True only inside the client-only Privy subtree. Components that call
 * `usePrivy()` must render only when this is true, guaranteeing a PrivyProvider
 * ancestor exists — this lets us keep the browser-only Privy SDK entirely out
 * of the SSR server bundle.
 */
export const PrivyReadyContext = createContext(false);
export const AuthenticatedContext = createContext(false);

export function usePrivyReady(): boolean {
  return useContext(PrivyReadyContext);
}

/** False on SSR and until Privy is ready. True only after a real login. */
export function useAuthenticated(): boolean {
  return useContext(AuthenticatedContext);
}
