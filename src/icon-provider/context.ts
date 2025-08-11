// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { createContext } from 'react';

import generatedIcons from '../icon/generated/icons.js';
import { IconProviderProps } from './interfaces.js';

/**
 * Preload the context with the existing icon set.
 * This allows the Icon component to have these icons available in the context even when no IconProvider is used.
 */
export const InternalIconContext = createContext<IconProviderProps.Icons>(generatedIcons);
