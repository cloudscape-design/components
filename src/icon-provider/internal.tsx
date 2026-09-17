// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useContext } from 'react';

import generatedIcons from '../icon/generated/icons';
import { InternalComponentIconsContext, InternalIconContext } from './context';
import { IconProviderProps } from './interfaces';

function InternalIconProvider({ children, icons, componentIcons }: IconProviderProps) {
  const contextIcons = useContext(InternalIconContext);
  const contextComponentIcons = useContext(InternalComponentIconsContext);

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

  // Merge with inherited component icons, per component and per icon (closest provider wins).
  let componentIconsToProvide: IconProviderProps.ComponentIcons = contextComponentIcons;
  if (componentIcons === null) {
    componentIconsToProvide = {};
  } else if (componentIcons) {
    componentIconsToProvide = { ...contextComponentIcons };
    for (const name of Object.keys(componentIcons) as (keyof IconProviderProps.ComponentIcons)[]) {
      const value = componentIcons[name];
      componentIconsToProvide[name] = value === null ? undefined : { ...contextComponentIcons[name], ...value };
    }
  }

  return (
    <InternalIconContext.Provider value={iconsToProvide}>
      <InternalComponentIconsContext.Provider value={componentIconsToProvide}>
        {children}
      </InternalComponentIconsContext.Provider>
    </InternalIconContext.Provider>
  );
}

export default InternalIconProvider;
