// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useContext } from 'react';

import { InternalComponentIconsContext } from './context';
import { IconProviderProps } from './interfaces';

/** Returns the custom icons provided for the given component via `IconProvider` `componentIcons`. */
export function useInternalComponentIcons<K extends keyof IconProviderProps.ComponentIcons>(
  component: K
): IconProviderProps.ComponentIcons[K] {
  return useContext(InternalComponentIconsContext)[component];
}
