import type { ReactNode, MouseEventHandler } from "react";

/** Square, bordered, uppercase button. Primary (black) is the default; use volt once per view at most. */
export interface ButtonProps {
  /** "primary" black fill · "volt" accent fill · "outline" transparent with a 2px ink border. */
  variant?: "primary" | "volt" | "outline";
  /** "md" 48px tall · "sm" 40px tall. */
  size?: "md" | "sm";
  /** Renders an <a> instead of a <button>. */
  href?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: MouseEventHandler;
  className?: string;
  children: ReactNode;
}

/** Uppercase Space Mono label set above a heading or under a value. */
export interface EyebrowProps {
  /** The surface it sits on, which picks the muted colour: "ground" (default), "block", "volt". */
  on?: "ground" | "block" | "volt";
  /** Element to render; defaults to span. */
  as?: "span" | "p" | "div" | "h2" | "h3";
  className?: string;
  children: ReactNode;
}

/** One number and its caption. Compose in a grid with an 8px gap; mix tones. */
export interface StatBlockProps {
  /** Up to 6 characters, set in Archivo Black: "0", "1 KB", "2010+", "No wire". */
  value: string;
  /** Mono caption: "crashes in production". */
  label: string;
  /** "outline" white card with ink border (default) · "volt" accent fill · "block" ink fill. */
  tone?: "outline" | "volt" | "block";
  className?: string;
}

/** Bordered card for one capability: optional icon, eyebrow, sentence-case title, body, and a mono spec line. */
export interface FeatureCardProps {
  title: string;
  /** Inline stroke SVG, 24px grid, 2px stroke, currentColor. */
  icon?: ReactNode;
  eyebrow?: string;
  /** Mono footer line for the measurable claim: "<30 KB flash · 1 KB RAM". */
  spec?: string;
  /** "surface" white on ground (default) · "block" ink fill. */
  tone?: "surface" | "block";
  className?: string;
  /** Body copy, rendered as a paragraph. */
  children?: ReactNode;
}

export declare const Button: (props: ButtonProps) => JSX.Element;
export declare const Eyebrow: (props: EyebrowProps) => JSX.Element;
export declare const StatBlock: (props: StatBlockProps) => JSX.Element;
export declare const FeatureCard: (props: FeatureCardProps) => JSX.Element;
