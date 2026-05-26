// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useContext, useMemo } from 'react';

import generatedIcons from '../icon/generated/icons';
import { InternalIconContext, InternalIconContextValue } from './context';
import { IconProviderProps } from './interfaces';

function InternalIconProvider({ children, icons, sizes, strokeWidths }: IconProviderProps) {
  const {
    icons: contextIcons,
    sizeOverrides: contextSizeOverrides,
    strokeWidthOverrides: contextStrokeWidthOverrides,
  } = useContext(InternalIconContext);

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

  const contextValue = useMemo<InternalIconContextValue>(
    () => ({
      icons: iconsToProvide,
      // Build the size override map by merging parent context with this provider's sizes prop.
      sizeOverrides: sizes ? { ...contextSizeOverrides, ...sizes } : contextSizeOverrides,
      // Build the stroke-width override map by merging parent context with this provider's strokeWidths prop.
      strokeWidthOverrides: strokeWidths
        ? { ...contextStrokeWidthOverrides, ...strokeWidths }
        : contextStrokeWidthOverrides,
    }),

    [iconsToProvide, contextSizeOverrides, sizes, contextStrokeWidthOverrides, strokeWidths]
  );

  return <InternalIconContext.Provider value={contextValue}>{children}</InternalIconContext.Provider>;
}

export default InternalIconProvider;
