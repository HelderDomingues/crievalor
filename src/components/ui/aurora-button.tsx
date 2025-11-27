import * as React from "react";
import { cn } from "@/lib/utils";

type BaseAuroraButtonProps = {
  className?: string;
  children: React.ReactNode;
  glowClassName?: string;
};

type AuroraButtonAsButton = BaseAuroraButtonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never;
  };

type AuroraButtonAsLink = BaseAuroraButtonProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

type AuroraButtonProps = AuroraButtonAsButton | AuroraButtonAsLink;

export function AuroraButton({
  className,
  children,
  glowClassName,
  ...props
}: AuroraButtonProps) {
  const isLink = "href" in props && props.href;
  const Component = isLink ? "a" : "button";

  return (
    <div className="relative group">
      {/* Gradient border container */}
      <div
        className={cn(
          "absolute -inset-[2px] rounded-lg bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 opacity-75 blur-lg transition-all",
          "group-hover:opacity-100 group-hover:blur-xl",
          glowClassName
        )}
      />

      {/* Button/Link */}
      <Component
        className={cn(
          "relative block w-full rounded-lg bg-slate-950/90 px-4 py-2 text-center",
          "text-slate-100 shadow-xl",
          "transition-all hover:bg-slate-950/70",
          "border border-slate-800",
          className
        )}
        {...(props as any)}
      >
        {children}
      </Component>
    </div>
  );
}
