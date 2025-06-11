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

  const mergedIcons = useMemo(() => ({ ...contextIcons, ...icons }), [contextIcons, icons]);

  return (
    <InternalIconContext.Provider value={icons === null ? generatedIcons : mergedIcons}>
      {children}
    </InternalIconContext.Provider>
  );
}

applyDisplayName(IconProvider, 'IconProvider');
