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
 * Holds icon groups (role-based, higher-precedence icon usages). Empty by default: with no
 * groups registered, components render the icon that `icons` (or the default set) provides.
 */
export const InternalIconGroupContext = createContext<IconProviderProps.IconGroups>({});
