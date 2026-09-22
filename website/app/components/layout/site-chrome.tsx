import { useEffect, useState } from "react";
import { LoginButton } from "../auth/login-button";
import { useAuthenticated } from "../auth/privy-ready";
import { ThemeToggle } from "../brand/theme-toggle";
import {
  NURO_TOKEN,
  NURO_TOKEN_DISPLAY,
  NURO_DEX_URL,
  explorerAddressUrl,
  shortAddress,
} from "../../lib/token";

const DOCS_URL = "https://docs.nuroai.xyz";

const NURO_EXPLORER_URL = explorerAddressUrl(NURO_TOKEN);

/** Copyable $NURO contract-address chip (footer + token section). */
export function ContractAddress() {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    void navigator.clipboard?.writeText(NURO_TOKEN_DISPLAY).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  };
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-[11px] uppercase tracking-[0.18em] text-mute">
        $NURO CA
      </span>
      <button
        type="button"
        onClick={copy}
        title="Copy contract address"
        className="group inline-flex items-center gap-2 rounded-full border border-line bg-[var(--inset)] px-3 py-1.5 font-mono text-xs text-[var(--fg)]/80 transition-colors hover:border-[var(--fg)]/25 hover:text-[var(--fg)]"
      >
        <span className="hidden sm:inline">{NURO_TOKEN_DISPLAY}</span>
        <span className="sm:hidden">{shortAddress(NURO_TOKEN_DISPLAY)}</span>
        <span className="text-accent">{copied ? "Copied" : "Copy"}</span>
      </button>
      <a
        href={NURO_EXPLORER_URL}
        target="_blank"
        rel="noreferrer"
        className="text-xs text-mute transition-colors hover:text-[var(--fg)]"
      >
        Explorer ↗
      </a>
      <a
        href={NURO_DEX_URL}
        target="_blank"
        rel="noreferrer"
        className="text-xs text-mute transition-colors hover:text-[var(--fg)]"
      >
        Dex ↗
      </a>
    </div>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  );
}

const socialLinks = [
  { label: "X", href: "https://x.com/nuroai_", Icon: XIcon },
  { label: "Telegram", href: "https://t.me/nuroaict", Icon: TelegramIcon },
];

const primaryLinks: { label: string; href: string; external?: boolean }[] = [
  { label: "Chat", href: "/assistant" },
  { label: "Earn", href: "/earn" },
  { label: "Account", href: "/profile" },
  { label: "Paper", href: "/paper" },
  { label: "Docs", href: DOCS_URL, external: true },
];

function MenuToggle({
  open,
  onClick,
}: {
  open: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      className="relative inline-flex h-10 w-10 items-center justify-center text-[var(--fg)] md:hidden"
    >
      <span className="relative block h-4 w-6">
        <span
          className={`absolute left-0 top-0 h-[2px] w-full rounded-full bg-current transition-all duration-300 ${
            open ? "top-1/2 -translate-y-1/2 rotate-45" : ""
          }`}
        />
        <span
          className={`absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 rounded-full bg-current transition-all duration-300 ${
            open ? "opacity-0" : "opacity-100"
          }`}
        />
        <span
          className={`absolute bottom-0 left-0 h-[2px] w-full rounded-full bg-current transition-all duration-300 ${
            open ? "bottom-1/2 translate-y-1/2 -rotate-45" : ""
          }`}
        />
      </span>
    </button>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const authenticated = useAuthenticated();
  const navLinks = primaryLinks.filter(
    (l) => l.label !== "Account" || authenticated,
  );

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = () => setOpen(false);

  const beforeAuth = () => {
    setOpen(false);
    document.body.style.overflow = "";
  };

  // Flat list used for the staggered mobile menu.
  const mobileLinks = navLinks.map((l) => ({
    ...l,
    external: l.external ?? false,
  }));

  return (
    <>
    <header className="load-fade fixed inset-x-0 top-0 z-50 border-b border-line bg-[var(--nav-bg)] backdrop-blur-xl md:sticky">
      <div className="page-shell flex items-center justify-between py-5 md:py-6">
        <a href="/" className="flex items-center gap-3.5" onClick={close}>
          <img
            src="/brand-mark.svg"
            alt="Nuro"
            className="brand-mark h-9 w-9 object-contain md:h-10 md:w-10"
          />
          <span className="font-display text-2xl leading-none tracking-[0.14em] md:text-[1.7rem]">
            nuro ai
          </span>
        </a>
        <nav className="hidden items-center gap-10 text-sm text-mute md:flex">
          {navLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              {...(l.external ? { target: "_blank", rel: "noreferrer" } : {})}
              className="transition-colors duration-300 hover:text-[var(--fg)]"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-4 md:gap-5">
          <div className="hidden items-center gap-3.5 md:flex">
            {socialLinks.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="text-mute transition-colors duration-300 hover:text-[var(--fg)]"
              >
                <Icon className="h-[18px] w-[18px]" />
              </a>
            ))}
          </div>
          <ThemeToggle />
          <LoginButton
            className="btn-secondary px-4 py-2 text-xs md:px-5 md:py-2.5"
            onBeforeAuth={beforeAuth}
          />
          <MenuToggle open={open} onClick={() => setOpen((v) => !v)} />
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden border-t border-line bg-[var(--nav-bg)] backdrop-blur-xl transition-[max-height,opacity] duration-300 ease-out md:hidden ${
          open ? "max-h-[85vh] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="page-shell flex flex-col py-4">
          {mobileLinks.map((item, i) => (
            <a
              key={item.label}
              href={item.href}
              onClick={close}
              {...(item.external ? { target: "_blank", rel: "noreferrer" } : {})}
              style={{ transitionDelay: open ? `${i * 45}ms` : "0ms" }}
              className={`border-b border-line py-4 text-lg text-[var(--fg)]/80 transition-all duration-300 hover:text-[var(--fg)] ${
                open ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
              }`}
            >
              {item.label}
            </a>
          ))}

          <div
            style={{ transitionDelay: open ? `${mobileLinks.length * 45}ms` : "0ms" }}
            className={`mt-6 transition-all duration-300 ${
              open ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
            }`}
          >
            <LoginButton
              className="btn-primary w-full justify-center px-5 py-3 text-sm"
              onBeforeAuth={beforeAuth}
            />
          </div>

          <div
            style={{ transitionDelay: open ? `${(mobileLinks.length + 1) * 45}ms` : "0ms" }}
            className={`mt-6 flex items-center gap-5 transition-all duration-300 ${
              open ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
            }`}
          >
            {socialLinks.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="text-mute transition-colors duration-300 hover:text-[var(--fg)]"
              >
                <Icon className="h-6 w-6" />
              </a>
            ))}
          </div>
        </nav>
      </div>
    </header>
    {/* Holds the document flow on mobile while the bar is position:fixed. */}
    <div className="h-[4.75rem] md:hidden" aria-hidden />
    </>
  );
}

export function SiteFooter({ flush = false }: { flush?: boolean }) {
  return (
    <footer className={flush ? "" : "border-t border-line"}>
      <div className="page-shell flex flex-col gap-6 py-10 md:flex-row md:items-end md:justify-between">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img
              src="/brand-mark.svg"
              alt=""
              className="brand-mark h-8 w-8 object-contain"
            aria-hidden="true"
          />
          <span className="font-display text-xl leading-none tracking-[0.14em] md:text-2xl">
            nuro ai
          </span>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-mute">
            Uncensored, private, decentralized inference - powered by GPUs people
            contribute, not rent.
          </p>
          <ContractAddress />
        </div>
        <div className="flex flex-col gap-3 text-sm text-mute md:items-end">
          <div className="flex items-center gap-4">
            {socialLinks.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="text-mute transition-colors duration-300 hover:text-[var(--fg)]"
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
          <p>© {new Date().getFullYear()} Nuro AI</p>
          <div className="flex gap-8">
            <a href="/assistant" className="hover:text-[var(--fg)]">
              Chat
            </a>
            <a href="https://nuroai.xyz" className="hover:text-[var(--fg)]">
              nuroai.xyz
            </a>
            <a href="/paper" className="hover:text-[var(--fg)]">
              Paper
            </a>
            <a href={DOCS_URL} className="hover:text-[var(--fg)]">
              Docs
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
