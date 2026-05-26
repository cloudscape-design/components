// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { createContext } from 'react';

import generatedIcons from '../icon/generated/icons';
import { IconProviderProps } from './interfaces';

/**
 * A mapping from each icon size variant to an optional target pixel size.
 * When a key is set, icons that would normally render at that size will instead have their
 * inline-size (both wrapper span and child SVG) set to the target pixel value.
 * An empty object means no overrides — icons render at their original size.
 */
export type IconSizeOverrideMap = Partial<Record<string, number>>;

/**
 * A mapping from each icon size variant to an optional stroke-width value.
 * When a key is set, icons at that size will use the specified stroke-width
 * instead of the default token value and automatic compensation.
 * An empty object means no overrides — icons use their token-defined stroke-widths.
 */
export type IconStrokeWidthOverrideMap = Partial<Record<string, number>>;

export interface InternalIconContextValue {
  icons: IconProviderProps.Icons;
  /**
   * Per-size-variant icon size overrides (in pixels).
   * Each key corresponds to an icon size variant (e.g. "normal", "inherit");
   * the value is the target pixel size number (e.g. 12).
   * An empty object means no overrides.
   */
  sizeOverrides: IconSizeOverrideMap;
  /**
   * Per-size-variant stroke-width overrides.
   * Each key corresponds to an icon size variant (e.g. "normal", "small");
   * the value is the target stroke-width number in pixels (e.g. 1.5).
   * An empty object means no overrides.
   */
  strokeWidthOverrides: IconStrokeWidthOverrideMap;
}

/**
 * Combined internal context for the IconProvider.
 * Preloaded with the generated icon set so Icon components work without an explicit IconProvider.
 */
export const InternalIconContext = createContext<InternalIconContextValue>({
  icons: generatedIcons,
  sizeOverrides: {},
  strokeWidthOverrides: {},
});
