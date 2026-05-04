// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useContext } from 'react';

import generatedIcons from '../icon/generated/icons';
import { InternalIconContext, InternalIconScaleContext } from './context';
import { IconProviderProps } from './interfaces';

function InternalIconProvider({ children, icons, iconScale }: IconProviderProps) {
  const contextIcons = useContext(InternalIconContext);
  const contextScale = useContext(InternalIconScaleContext);

  let iconsToProvide: IconProviderProps.Icons = generatedIcons;

  // Merge the context icons with the custom icons, this allows child instances of IconProvider to persist parent configurations
  if (icons !== null) {
    const clonedIcons = { ...icons };

    // Reset null icon values to their generated default, or the inherited context value for custom icons
    Object.keys(clonedIcons).forEach(name => {
      const iconName = name as keyof typeof generatedIcons;
      if (clonedIcons[iconName] === null) {
        clonedIcons[iconName] = generatedIcons[iconName] ?? contextIcons[iconName];
      }
    });

    iconsToProvide = { ...contextIcons, ...clonedIcons };
  }

  // If iconScale is explicitly provided, use it. Otherwise inherit from the parent provider.
  const scaleToProvide = iconScale ?? contextScale;

  return (
    <InternalIconContext.Provider value={iconsToProvide}>
      <InternalIconScaleContext.Provider value={scaleToProvide}>{children}</InternalIconScaleContext.Provider>
    </InternalIconContext.Provider>
  );
}

export default InternalIconProvider;
