// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { createContext } from 'react';

import generatedIcons from '../icon/generated/icons';
import { IconProviderProps } from './interfaces';

/**
 * Preload the context with the existing icon set.
 * This allows the Icon component to have these icons available in the context even when no IconProvider is used.
 */
export const InternalIconContext = createContext<IconProviderProps.Icons>(generatedIcons);

/**
 * A mapping from each icon size variant to an optional target pixel size.
 * When a key is set, icons that would normally render at that size will instead have their
 * inline-size (both wrapper span and child SVG) set to the target pixel value.
 * An empty object means no overrides — icons render at their original size.
 */
export type IconSizeOverrideMap = Partial<Record<string, string>>;

/**
 * Provides per-size-variant icon size overrides (in pixels) to all descendant Icon components.
 * Each key corresponds to an original icon size variant (e.g. "normal", "inherit");
 * the value is the target pixel size string (e.g. "12px").
 * An empty object means no overrides.
 */
export const InternalIconSizeOverrideContext = createContext<IconSizeOverrideMap>({});
