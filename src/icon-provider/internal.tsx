// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useContext } from 'react';

import generatedIcons from '../icon/generated/icons';
import { InternalIconContext, InternalIconGroupContext } from './context';
import { IconGroupName, IconProviderProps } from './interfaces';

function InternalIconProvider({ children, icons, iconGroups }: IconProviderProps) {
  const contextIcons = useContext(InternalIconContext);
  const contextIconGroups = useContext(InternalIconGroupContext);

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

  // Merge icon groups with the inherited ones (closest provider wins). `iconGroups={null}` resets all
  // inherited groups; a specific group set to `null` resets just that one to its default.
  let iconGroupsToProvide: IconProviderProps.IconGroups = contextIconGroups;
  if (iconGroups === null) {
    iconGroupsToProvide = {};
  } else if (iconGroups) {
    // Start from inherited icon groups, then apply the provided ones (closest provider wins).
    const mergedIconGroups: IconProviderProps.IconGroups = { ...contextIconGroups, ...iconGroups };
    // A group explicitly set to null/undefined means "reset to default" — remove the inherited entry.
    (Object.keys(iconGroups) as IconGroupName[]).forEach(name => {
      if (iconGroups[name] === null || iconGroups[name] === undefined) {
        delete mergedIconGroups[name];
      }
    });
    iconGroupsToProvide = mergedIconGroups;
  }

  return (
    <InternalIconContext.Provider value={iconsToProvide}>
      <InternalIconGroupContext.Provider value={iconGroupsToProvide}>{children}</InternalIconGroupContext.Provider>
    </InternalIconContext.Provider>
  );
}

export default InternalIconProvider;
