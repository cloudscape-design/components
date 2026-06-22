// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/**
 * @experimental This component and hook are unstable and subject to change without
 * a major version bump. Available to selected builders only.
 */

import React, { createContext, CSSProperties, useContext, useRef } from 'react';

import { useCurrentMode } from '@cloudscape-design/component-toolkit/internal';

// ─── Variant type ─────────────────────────────────────────────────────────────

export type ColorContextVariant =
  | 'red'
  | 'yellow'
  | 'indigo'
  | 'green'
  | 'orange'
  | 'purple'
  | 'mint'
  | 'lime'
  | 'grey';

// ─── Palette ──────────────────────────────────────────────────────────────────
// Source: style-dictionary/core/color-palette.ts
// Each entry: [light-bg (50), dark-bg (950 @ 80%), light-content (600), dark-content (200)]

const PALETTE: Record<
  ColorContextVariant,
  { bgLight: string; bgDark: string; contentLight: string; contentDark: string }
> = {
  red: { bgLight: '#fff5f5', bgDark: 'rgba(82,0,0,0.6)', contentLight: '#db0000', contentDark: '#ffc2c2' },
  yellow: { bgLight: '#fffef0', bgDark: 'rgba(87,58,0,0.6)', contentLight: '#855900', contentDark: '#fef571' },
  indigo: { bgLight: '#f5f7ff', bgDark: 'rgba(0,20,117,0.6)', contentLight: '#295eff', contentDark: '#c2d1ff' },
  green: { bgLight: '#effff1', bgDark: 'rgba(0,51,17,0.6)', contentLight: '#00802f', contentDark: '#aeffa8' },
  orange: { bgLight: '#fff7f5', bgDark: 'rgba(71,17,0,0.6)', contentLight: '#A82700', contentDark: '#ffc0ad' },
  purple: { bgLight: '#faf5ff', bgDark: 'rgba(48,0,97,0.6)', contentLight: '#962eff', contentDark: '#e8d1ff' },
  mint: { bgLight: '#ebfff6', bgDark: 'rgba(0,51,34,0.6)', contentLight: '#006b48', contentDark: '#8fffce' },
  lime: { bgLight: '#f7ffeb', bgDark: 'rgba(0,46,0,0.6)', contentLight: '#007000', contentDark: '#d1ff8a' },
  grey: { bgLight: '#fcfcfc', bgDark: '#2d2d2db7', contentLight: '#1A1A1A', contentDark: '#f5f5f5' },
};

// ─── Base styles applied to every provider instance ─────────────────────────
// Builders can override any of these via the `style` prop.

const BASE_STYLES: CSSProperties = {
  display: 'inline-flex',
  paddingInline: '2px',
  paddingBlock: '0px',
};
// These hash suffixes are derived from token names and stable across builds.

const CSS_PROPS_LIGHT = (color: string): CSSProperties =>
  ({
    '--color-text-body-default-a7br70': color,
    '--color-text-heading-default-5p4ugs': color,
    '--color-text-body-secondary-6zl7e0': color,
    '--color-text-heading-secondary-c1zwy4': color,
    '--color-text-icon-subtle-xnb03v': color,
    '--color-text-small-ldm4or': color,
  }) as CSSProperties;

// ─── React Context ─────────────────────────────────────────────────────────────

interface ColorContextValue {
  variant: ColorContextVariant;
  colorScheme: 'light' | 'dark';
}

const ColorContext = createContext<ColorContextValue | null>(null);

/**
 * Returns the active ColorContext value, or null if no provider is in scope.
 *
 * @experimental
 */
export function useColorContext(): ColorContextValue | null {
  return useContext(ColorContext);
}

// ─── Provider props ───────────────────────────────────────────────────────────

export interface ColorContextProviderProps {
  /**
   * The color variant to activate. Each variant provides a background color
   * and re-scopes text/icon CSS custom properties to a matching hue:
   *   light mode → 600-level  |  dark mode → 400-level
   *
   * Dark mode is detected automatically from the nearest Cloudscape dark-mode
   * ancestor — no `colorScheme` prop needed.
   *
   * @experimental
   */
  variant: ColorContextVariant;

  /**
   * The HTML element rendered as the context boundary. Defaults to `"div"`.
   * Use a semantic element (e.g. `"section"`, `"aside"`) when appropriate.
   */
  as?: keyof JSX.IntrinsicElements;

  /** Additional class names to merge onto the wrapper element. */
  className?: string;

  /** Additional inline styles. These are merged with the injected CSS custom properties. */
  style?: CSSProperties;

  children: React.ReactNode;
}

/**
 * ColorContextProvider activates a color variant for its subtree by injecting
 * CSS custom properties as inline styles on a wrapper element. Dark mode is
 * detected automatically — when a Cloudscape dark-mode class is present on an
 * ancestor, the 950-level backgrounds and 400-level content colors are applied.
 *
 * The active variant is also available via `useColorContext()`.
 *
 * @experimental
 */
export function ColorContextProvider({
  variant,
  as: Tag = 'div',
  className,
  style,
  children,
}: ColorContextProviderProps) {
  const ref = useRef<HTMLElement>(null);
  const colorMode = useCurrentMode(ref);
  const isDark = colorMode === 'dark';

  const { bgLight, bgDark, contentLight, contentDark } = PALETTE[variant];
  const backgroundColor = isDark ? bgDark : bgLight;
  const contentColor = isDark ? contentDark : contentLight;

  const injectedStyles: CSSProperties = {
    ...BASE_STYLES,
    backgroundColor,
    ...CSS_PROPS_LIGHT(contentColor),
    ...style,
  };

  return (
    <ColorContext.Provider value={{ variant, colorScheme: colorMode ?? 'light' }}>
      <Tag className={className} style={injectedStyles}>
        {/* Hidden span to anchor the color-mode probe ref */}
        <span ref={ref} style={{ display: 'none' }} aria-hidden="true" />
        {children}
      </Tag>
    </ColorContext.Provider>
  );
}
