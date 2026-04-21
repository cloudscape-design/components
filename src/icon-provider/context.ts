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
 * Provides a default icon size to all descendant Icon components.
 * When set, Icon components that don't specify an explicit size (or use the default "normal")
 * will render at this size instead. `undefined` means no override — use the component's own default.
 */
export const InternalIconSizeContext = createContext<IconProps.Size | undefined>(undefined);
