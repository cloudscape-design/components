// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { SplitViewProps } from './interfaces';
import InternalSplitView from './internal';

export { SplitViewProps };

const SplitView = React.forwardRef<SplitViewProps.Ref, SplitViewProps>(function SplitView(
  { panelPosition = 'side-start', resizable = false, panelVariant = 'panel', display = 'all', ...props },
  ref
) {
  const baseComponentProps = useBaseComponent('SplitView', {
    props: { panelPosition, resizable, panelVariant },
    metadata: {
      hasDefaultSize: props.defaultPanelSize !== undefined,
      hasSize: props.panelSize !== undefined,
      hasMinSize: props.minPanelSize !== undefined,
      hasMaxSize: props.maxPanelSize !== undefined,
    },
  });
  return (
    <InternalSplitView
      ref={ref}
      panelPosition={panelPosition}
      resizable={resizable}
      panelVariant={panelVariant}
      display={display}
      {...props}
      {...baseComponentProps}
    />
  );
});

export default SplitView;

applyDisplayName(SplitView, 'SplitView');
