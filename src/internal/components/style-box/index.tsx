// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/**
 * @experimental This component is unstable and subject to change without a
 * major version bump. It is available to selected builders only.
 * Do not use it unless you have been explicitly invited to test it.
 */

import React from 'react';
import clsx from 'clsx';

import styles from './styles.css.js';

export type StyleBoxVariant = 'red' | 'yellow' | 'indigo' | 'green' | 'orange' | 'purple' | 'mint' | 'lime' | 'grey';

/**
 * Controls the shape (border-radius and geometry) of the StyleBox wrapper.
 *
 * - `"sharp"`   — 2px, a barely-rounded square corner. This is the default.
 * - `"circle"`  — equal width and height with 50% border-radius, producing a perfect circle.
 *                 Content is centered.
 *
 * @experimental
 */
export type StyleBoxShape = 'sharp' | 'circle';

export interface StyleBoxProps {
  /**
   * The color variant to apply to the wrapper.
   *
   * Each variant renders the same padding (unless `shape="circle"`). Background and content
   * colors are drawn from the corresponding Cloudscape core color palette:
   *
   * | Variant    | Light bg (`50`) | Dark bg (`1000`) | Text/icon (`600`/`400`) |
   * |------------|-----------------|------------------|-------------------------|
   * | `red`      | `colorRed50`    | `colorRed1000`   | `colorRed600/400`       |
   * | `yellow`   | `colorYellow50` | `colorYellow1000`| `colorYellow600/400`    |
   * | `indigo`   | `colorIndigo50` | `colorIndigo1000`| `colorIndigo600/400`    |
   * | `green`    | `colorGreen50`  | `colorGreen1000` | `colorGreen600/400`     |
   * | `orange`   | `colorOrange50` | `colorOrange1000`| `colorOrange600/400`    |
   * | `purple`   | `colorPurple50` | `colorPurple1000`| `colorPurple600/400`    |
   * | `mint`     | `colorMint50`   | `colorMint1000`  | `colorMint600/400`      |
   * | `lime`     | `colorLime50`   | `colorLime1000`  | `colorLime600/400`      |
   *
   * @experimental
   */
  variant: StyleBoxVariant;

  /**
   * Controls the shape of the wrapper.
   *
   * - `"sharp"`   — 2px. This is the default.
   * - `"circle"`  — 50% border-radius with equal width/height. Content is centered.
   *
   * @experimental
   */
  shape?: StyleBoxShape;

  /**
   * The HTML element rendered as the wrapper. Defaults to `"div"`.
   * Use a semantic element (e.g. `"section"`, `"aside"`) when the region
   * has landmark meaning.
   */
  as?: keyof JSX.IntrinsicElements;

  /** Additional class names to merge onto the wrapper element. */
  className?: string;

  children: React.ReactNode;
}

const VARIANT_CLASS: Record<StyleBoxVariant, string> = {
  red: styles['variant-red'],
  yellow: styles['variant-yellow'],
  indigo: styles['variant-indigo'],
  green: styles['variant-green'],
  orange: styles['variant-orange'],
  purple: styles['variant-purple'],
  mint: styles['variant-mint'],
  lime: styles['variant-lime'],
  grey: styles['variant-grey'],
};

const SHAPE_CLASS: Record<StyleBoxShape, string> = {
  sharp: styles['shape-sharp'],
  circle: styles['shape-circle'],
};

/**
 * StyleBox wraps content in a color-tinted container. Background, content text
 * color, and shape are all controlled through props.
 *
 * @experimental
 */
export function StyleBox({ variant, shape = 'sharp', as: Tag = 'div', className, children }: StyleBoxProps) {
  return <Tag className={clsx(VARIANT_CLASS[variant], SHAPE_CLASS[shape], className)}>{children}</Tag>;
}
