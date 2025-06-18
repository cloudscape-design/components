// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useContext, useMemo } from 'react';

import generatedIcons from '../icon/generated/icons';
import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { InternalIconContext } from './context';
import { IconProviderProps } from './interfaces';

/**
 * @awsuiSystem core
 */
export { IconProviderProps };

/**
 * @awsuiSystem core
 */
export default function IconProvider({ children, icons }: IconProviderProps) {
  useBaseComponent('IconProvider');
  const contextIcons = useContext(InternalIconContext);

  const iconsToProvide: IconProviderProps.Icons = useMemo(() => {
    // Reset icons to the original set when the configuration is explicitly null
    if (icons === null) {
      return generatedIcons;
    }

    // Merge the icons with the context icons, this allows child instances of IconProvider to persist parent configurations
    return { ...contextIcons, ...icons };
  }, [contextIcons, icons]);

  return <InternalIconContext.Provider value={iconsToProvide}>{children}</InternalIconContext.Provider>;
}

applyDisplayName(IconProvider, 'IconProvider');
