// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useContext, useMemo } from 'react';

import generatedIcons from '../icon/generated/icons';
import { IconSizeOverrideMap, InternalIconContext, InternalIconSizeOverrideContext } from './context';
import { IconProviderProps } from './interfaces';

function InternalIconProvider({
  children,
  icons,
  iconSizeSmall,
  iconSizeNormal,
  iconSizeMedium,
  iconSizeBig,
  iconSizeLarge,
  iconSizeInherit,
}: IconProviderProps) {
  const contextIcons = useContext(InternalIconContext);
  const contextSizeOverrides = useContext(InternalIconSizeOverrideContext);

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

  // Build the size override map by merging parent context with this provider's props.
  const sizeOverridesToProvide = useMemo<IconSizeOverrideMap>(() => {
    const map: IconSizeOverrideMap = { ...contextSizeOverrides };

    if (iconSizeSmall !== undefined) {
      map.small = iconSizeSmall;
    }
    if (iconSizeNormal !== undefined) {
      map.normal = iconSizeNormal;
    }
    if (iconSizeMedium !== undefined) {
      map.medium = iconSizeMedium;
    }
    if (iconSizeBig !== undefined) {
      map.big = iconSizeBig;
    }
    if (iconSizeLarge !== undefined) {
      map.large = iconSizeLarge;
    }
    if (iconSizeInherit !== undefined) {
      map.inherit = iconSizeInherit;
    }

    return map;
  }, [
    contextSizeOverrides,
    iconSizeSmall,
    iconSizeNormal,
    iconSizeMedium,
    iconSizeBig,
    iconSizeLarge,
    iconSizeInherit,
  ]);

  return (
    <InternalIconContext.Provider value={iconsToProvide}>
      <InternalIconSizeOverrideContext.Provider value={sizeOverridesToProvide}>
        {children}
      </InternalIconSizeOverrideContext.Provider>
    </InternalIconContext.Provider>
  );
}

export default InternalIconProvider;
