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
  const sizeOverridesToProvide = useMemo<IconSizeOverrideMap>(
    () => (sizes ? { ...contextSizeOverrides, ...sizes } : contextSizeOverrides),
    [contextSizeOverrides, sizes]
  );

  // Build the stroke-width override map by merging parent context with this provider's strokeWidths prop.
  const strokeWidthOverridesToProvide = useMemo<IconStrokeWidthOverrideMap>(
    () => (strokeWidths ? { ...contextStrokeWidthOverrides, ...strokeWidths } : contextStrokeWidthOverrides),
    [contextStrokeWidthOverrides, strokeWidths]
  );

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
