// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import useBaseComponent from '../internal/hooks/use-base-component';
import { SplitPanelInternal } from './internal';
import { SplitPanelProps } from './interfaces';

export { SplitPanelProps };

export default function SplitPanel({
  hidePreferencesButton = false,
  closeBehavior = 'collapse',
  ...restProps
}: SplitPanelProps) {
  const { __internalRootRef } = useBaseComponent('SplitPanel', {
    props: { closeBehavior, hidePreferencesButton },
  });
  return (
    <SplitPanelInternal
      {...restProps}
      ref={__internalRootRef}
      hidePreferencesButton={hidePreferencesButton}
      closeBehavior={closeBehavior}
    />
  );
}

applyDisplayName(SplitPanel, 'SplitPanel');
