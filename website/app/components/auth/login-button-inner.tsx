import { useLogin, usePrivy } from "@privy-io/react-auth";

/**
 * Interactive auth control. Lives in its own module (statically importing the
 * browser-only Privy SDK) so it can be loaded client-only via login-button.tsx
 * — keeping the SDK out of the SSR server bundle.
 */
export default function LoginButtonInner({
  className = "",
  onBeforeAuth,
}: {
  className?: string;
  onBeforeAuth?: () => void;
}) {
  const { ready, authenticated, logout, error } = usePrivy();
  const { login } = useLogin();

  return (
    <button
      type="button"
      disabled={!ready}
      title={error ? error.message : undefined}
      onClick={() => {
        onBeforeAuth?.();
        if (authenticated) {
          logout();
          return;
        }
        login();
      }}
      className={className}
    >
      {authenticated ? "Log out" : "Login"}
    </button>
  );
}
