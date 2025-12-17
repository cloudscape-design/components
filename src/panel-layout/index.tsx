// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { getExternalProps } from '../internal/utils/external-props';
import { PanelLayoutProps } from './interfaces';
import InternalPanelLayout from './internal';

export { PanelLayoutProps };

const PanelLayout = React.forwardRef<PanelLayoutProps.Ref, PanelLayoutProps>(function PanelLayout(
  { panelPosition = 'side-start', resizable = false, display = 'all', ...props },
  ref
) {
  const baseComponentProps = useBaseComponent('PanelLayout', {
    props: { panelPosition, resizable },
    metadata: {
      mainFocusable: props.mainFocusable !== undefined,
      panelFocusable: props.panelFocusable !== undefined,
      hasDefaultPanelSize: props.defaultPanelSize !== undefined,
      hasPanelSize: props.panelSize !== undefined,
      hasMinPanelSize: props.minPanelSize !== undefined,
      hasMaxPanelSize: props.maxPanelSize !== undefined,
    },
  });
  return (
    <InternalPanelLayout
      ref={ref}
      panelPosition={panelPosition}
      resizable={resizable}
      display={display}
      {...getExternalProps(props)}
      {...baseComponentProps}
    />
  );
});

export default PanelLayout;

applyDisplayName(PanelLayout, 'PanelLayout');
