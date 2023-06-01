// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ClassArray } from 'clsx';
import { InternalColumnLayoutProps } from './interfaces';
import styles from './styles.css.js';

export function repeat<T>(value: T, times: number): T[] {
  const array = [];
  for (let i = 0; i < times; i++) {
    array[i] = value;
  }
  return array;
}

export function getCommonClasses({
  variant,
  borders,
  disableGutters,
}: Pick<InternalColumnLayoutProps, 'variant' | 'borders' | 'disableGutters' | 'columns'>): ClassArray {
  const isTextGridVariant = variant === 'text-grid';
  const shouldDisableGutters = !isTextGridVariant && disableGutters;
  const shouldHaveHorizontalBorders = !isTextGridVariant && (borders === 'horizontal' || borders === 'all');
  const shouldHaveVerticalBorders = !isTextGridVariant && (borders === 'vertical' || borders === 'all');

  return [
    styles.grid,
    styles[`grid-variant-${variant}`],
    {
      [styles['grid-horizontal-borders']]: shouldHaveHorizontalBorders,
      [styles['grid-vertical-borders']]: shouldHaveVerticalBorders,
      [styles['grid-no-gutters']]: shouldDisableGutters,
    },
  ];
}
