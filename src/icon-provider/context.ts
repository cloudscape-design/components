// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { createContext } from 'react';

import generatedIcons from '../icon/generated/icons';
import { IconProps } from '../icon/interfaces';
import { IconProviderProps } from './interfaces';

/**
 * Preload the context with the existing icon set.
 * This allows the Icon component to have these icons available in the context even when no IconProvider is used.
 */
export const InternalIconContext = createContext<IconProviderProps.Icons>(generatedIcons);

/**
 * A mapping from each icon size variant to an optional override size.
 * When a key is set, icons that would normally render at that size will instead render at the mapped value.
 */
export type IconSizeMap = Partial<Record<IconProps.Size, IconProps.Size>>;

/**
 * Provides per-size-variant icon size overrides to all descendant Icon components.
 * Each key in the map corresponds to an original icon size; the value is the size it should render as.
 * An empty object means no overrides — icons render at their original size.
 */
export const InternalIconSizeContext = createContext<IconSizeMap>({});
