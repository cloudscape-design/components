// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useContext, useMemo } from 'react';

import generatedIcons from '../icon/generated/icons';
import { IconSizeMap, InternalIconContext, InternalIconSizeContext } from './context';
import { IconProviderProps } from './interfaces';

function InternalIconProvider({
  children,
  icons,
  iconSize,
  iconSizeSmall,
  iconSizeNormal,
  iconSizeMedium,
  iconSizeBig,
  iconSizeLarge,
  iconSizeInherit,
}: IconProviderProps) {
  const contextIcons = useContext(InternalIconContext);
  const contextSizeMap = useContext(InternalIconSizeContext);

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

  // Build the size map by merging parent context with this provider's props.
  // `iconSize` is a shorthand for `iconSizeNormal`; explicit `iconSizeNormal` takes precedence.
  const sizeMapToProvide = useMemo<IconSizeMap>(() => {
    const map: IconSizeMap = { ...contextSizeMap };

    // Apply the shorthand `iconSize` as the normal mapping (backward compat)
    if (iconSize !== undefined) {
      map.normal = iconSize;
    }

    // Per-variant overrides take precedence
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
    contextSizeMap,
    iconSize,
    iconSizeSmall,
    iconSizeNormal,
    iconSizeMedium,
    iconSizeBig,
    iconSizeLarge,
    iconSizeInherit,
  ]);

  return (
    <InternalIconContext.Provider value={iconsToProvide}>
      <InternalIconSizeContext.Provider value={sizeMapToProvide}>{children}</InternalIconSizeContext.Provider>
    </InternalIconContext.Provider>
  );
}

export default InternalIconProvider;
