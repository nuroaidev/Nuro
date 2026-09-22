import type { ReactNode } from "react";

export function OsWindow({
  title,
  children,
  className = "",
  featured = false,
}: {
  title: string;
  children: ReactNode;
  className?: string;
  featured?: boolean;
}) {
  return (
    <article className={`os-window ${featured ? "os-window-featured" : ""} ${className}`}>
      <header className="os-window-bar">{title}</header>
      <div className="os-window-body">{children}</div>
    </article>
  );
}
