// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useContext, useMemo } from 'react';

import generatedIcons from '../icon/generated/icons';
import {
  IconSizeOverrideMap,
  IconStrokeWidthOverrideMap,
  InternalIconContext,
  InternalIconSizeOverrideContext,
  InternalIconStrokeWidthOverrideContext,
} from './context';
import { IconProviderProps } from './interfaces';

function InternalIconProvider({ children, icons, sizes, strokeWidths }: IconProviderProps) {
  const contextIcons = useContext(InternalIconContext);
  const contextSizeOverrides = useContext(InternalIconSizeOverrideContext);
  const contextStrokeWidthOverrides = useContext(InternalIconStrokeWidthOverrideContext);

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

  // Build the size override map by merging parent context with this provider's sizes prop.
  const sizeOverridesToProvide = useMemo<IconSizeOverrideMap>(() => {
    if (!sizes) {
      return contextSizeOverrides;
    }

    const map: IconSizeOverrideMap = { ...contextSizeOverrides };

    if (sizes['x-small'] !== undefined) {
      map['x-small'] = sizes['x-small'];
    }
    if (sizes.small !== undefined) {
      map.small = sizes.small;
    }
    if (sizes.normal !== undefined) {
      map.normal = sizes.normal;
    }
    if (sizes.medium !== undefined) {
      map.medium = sizes.medium;
    }
    if (sizes.big !== undefined) {
      map.big = sizes.big;
    }
    if (sizes.large !== undefined) {
      map.large = sizes.large;
    }
    if (sizes.inherit !== undefined) {
      map.inherit = sizes.inherit;
    }

    return map;
  }, [contextSizeOverrides, sizes]);

  // Build the stroke-width override map by merging parent context with this provider's strokeWidths prop.
  const strokeWidthOverridesToProvide = useMemo<IconStrokeWidthOverrideMap>(() => {
    if (!strokeWidths) {
      return contextStrokeWidthOverrides;
    }

    const map: IconStrokeWidthOverrideMap = { ...contextStrokeWidthOverrides };

    if (strokeWidths['x-small'] !== undefined) {
      map['x-small'] = strokeWidths['x-small'];
    }
    if (strokeWidths.small !== undefined) {
      map.small = strokeWidths.small;
    }
    if (strokeWidths.normal !== undefined) {
      map.normal = strokeWidths.normal;
    }
    if (strokeWidths.medium !== undefined) {
      map.medium = strokeWidths.medium;
    }
    if (strokeWidths.big !== undefined) {
      map.big = strokeWidths.big;
    }
    if (strokeWidths.large !== undefined) {
      map.large = strokeWidths.large;
    }
    if (strokeWidths.inherit !== undefined) {
      map.inherit = strokeWidths.inherit;
    }

    return map;
  }, [contextStrokeWidthOverrides, strokeWidths]);

  return (
    <InternalIconContext.Provider value={iconsToProvide}>
      <InternalIconSizeOverrideContext.Provider value={sizeOverridesToProvide}>
        <InternalIconStrokeWidthOverrideContext.Provider value={strokeWidthOverridesToProvide}>
          {children}
        </InternalIconStrokeWidthOverrideContext.Provider>
      </InternalIconSizeOverrideContext.Provider>
    </InternalIconContext.Provider>
  );
}

export default InternalIconProvider;
