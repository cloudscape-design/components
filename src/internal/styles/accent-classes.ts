// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/**
 * @experimental Accent utility class names. Available to selected builders only.
 * These names may change without notice.
 *
 * Usage:
 *   import { accentClass } from '.../accent-classes';
 *   <span className={`${accentClass.indigo} ${accentClass.sharp}`}>...</span>
 *
 * Or use the string literals directly:
 *   <span className="awsui-accent-indigo awsui-accent-sharp">...</span>
 */

export type AccentVariant = 'red' | 'yellow' | 'indigo' | 'green' | 'orange' | 'purple' | 'mint' | 'lime' | 'grey';
export type AccentShape = 'sharp' | 'circle';

/** Typed accent class name constants. */
export const accentClass = {
  // Color variants
  red: 'awsui-accent-red',
  yellow: 'awsui-accent-yellow',
  indigo: 'awsui-accent-indigo',
  green: 'awsui-accent-green',
  orange: 'awsui-accent-orange',
  purple: 'awsui-accent-purple',
  mint: 'awsui-accent-mint',
  lime: 'awsui-accent-lime',
  grey: 'awsui-accent-grey',

  // Shape modifiers
  sharp: 'awsui-accent-sharp',
  circle: 'awsui-accent-circle',
} as const satisfies Record<AccentVariant | AccentShape, string>;
