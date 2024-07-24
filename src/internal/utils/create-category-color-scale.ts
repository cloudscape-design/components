// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { colorChartsThresholdNeutral as thresholdColor } from '../generated/styles/tokens';
import { categoryPalette } from '../styles/colors';
import { parseCssVariable } from './dom';

export default function createCategoryColorScale<T>(
  items: readonly T[],
  isThreshold: (item: T) => boolean = () => false,
  getOwnColor: (item: T) => null | string = () => null
): string[] {
  const colors = [];

  let categoryIndex = 0;
  for (const it of items) {
    const ownColor = getOwnColor(it);
    const defaultColor = isThreshold(it) ? thresholdColor : categoryPalette[categoryIndex % categoryPalette.length];
    colors.push(parseCssVariable(ownColor || defaultColor));

    if (!isThreshold(it) && !ownColor) {
      categoryIndex++;
    }
  }

  return colors;
}
