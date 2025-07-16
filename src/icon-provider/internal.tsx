// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useContext } from 'react';

import generatedIcons from '../icon/generated/icons';
import { InternalIconContext } from './context';
import { IconProviderProps } from './interfaces';

function InternalIconProvider({ children, icons }: IconProviderProps) {
  const contextIcons = useContext(InternalIconContext);

  let iconsToProvide: IconProviderProps.Icons = generatedIcons;

  // Merge the context icons with the custom icons, this allows child instances of IconProvider to persist parent configurations
  if (icons !== null) {
    const clonedIcons = { ...icons };

    // Reset null icon values to their original definitions
    Object.keys(clonedIcons).forEach(name => {
      const iconName = name as keyof typeof generatedIcons;
      if (iconName in generatedIcons && clonedIcons[iconName] === null) {
        clonedIcons[iconName] = generatedIcons[iconName];
      }
    });

    iconsToProvide = { ...contextIcons, ...clonedIcons };
  }

  return <InternalIconContext.Provider value={iconsToProvide}>{children}</InternalIconContext.Provider>;
}

export default InternalIconProvider;
