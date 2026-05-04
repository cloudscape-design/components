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
 * Provides a scale factor to all descendant Icon components.
 * When set to a value other than 1, icons will be rendered with `transform: scale(factor)`
 * while preserving their original layout box size.
 * A value of 1 means no scaling (default behavior).
 */
export const InternalIconScaleContext = createContext<number>(1);
