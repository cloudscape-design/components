// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useContext } from 'react';

import generatedIcons from '../icon/generated/icons';
import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { InternalIconContext } from './context';
import { IconProviderProps } from './interfaces';

/**
 * @awsuiSystem core
 */
export { IconProviderProps };

/**
 * @awsuiSystem core
 */
export default function IconProvider({ children, icons }: IconProviderProps) {
  useBaseComponent('IconProvider');
  const contextIcons = useContext(InternalIconContext);

  let iconsToProvide: IconProviderProps.Icons = generatedIcons;

  // Merge the context icons with the custom icons, this allows child instances of IconProvider to persist parent configurations
  if (icons !== null) {
    const iconsResetWithBuiltInIcons = { ...icons };

    // Reset null icon values to their original definitions
    Object.keys(iconsResetWithBuiltInIcons).forEach(name => {
      const iconName = name as keyof typeof generatedIcons;
      if (iconName in generatedIcons && iconsResetWithBuiltInIcons[iconName] === null) {
        iconsResetWithBuiltInIcons[iconName] = generatedIcons[iconName];
      }
    });

    iconsToProvide = { ...contextIcons, ...iconsResetWithBuiltInIcons };
  }

  return <InternalIconContext.Provider value={iconsToProvide}>{children}</InternalIconContext.Provider>;
}

applyDisplayName(IconProvider, 'IconProvider');
