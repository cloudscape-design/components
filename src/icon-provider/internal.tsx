// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useContext } from 'react';

import generatedIcons from '../icon/generated/icons';
import { InternalIconContext, InternalIconOverrideContext } from './context';
import { IconOverrideName, IconProviderProps } from './interfaces';

function InternalIconProvider({ children, icons, overrides }: IconProviderProps) {
  const contextIcons = useContext(InternalIconContext);
  const contextOverrides = useContext(InternalIconOverrideContext);

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

  // Merge overrides with the inherited ones (closest provider wins). `overrides={null}` resets all
  // inherited overrides; a specific override set to `null` resets just that one to its default.
  let overridesToProvide: IconProviderProps.Overrides = contextOverrides;
  if (overrides === null) {
    overridesToProvide = {};
  } else if (overrides) {
    // Start from inherited overrides, then apply the provided ones (closest provider wins).
    const mergedOverrides: IconProviderProps.Overrides = { ...contextOverrides, ...overrides };
    // An override explicitly set to null/undefined means "reset to default" — remove the inherited entry.
    (Object.keys(overrides) as IconOverrideName[]).forEach(name => {
      if (overrides[name] === null || overrides[name] === undefined) {
        delete mergedOverrides[name];
      }
    });
    overridesToProvide = mergedOverrides;
  }

  return (
    <InternalIconContext.Provider value={iconsToProvide}>
      <InternalIconOverrideContext.Provider value={overridesToProvide}>{children}</InternalIconOverrideContext.Provider>
    </InternalIconContext.Provider>
  );
}

export default InternalIconProvider;
