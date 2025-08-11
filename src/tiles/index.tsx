// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import useBaseComponent from '../internal/hooks/use-base-component/index.js';
import { applyDisplayName } from '../internal/utils/apply-display-name.js';
import { GeneratedAnalyticsMetadataTilesComponent } from './analytics-metadata/interfaces.js';
import { TilesProps } from './interfaces.js';
import InternalTiles from './internal.js';

export { TilesProps };

const Tiles = React.forwardRef((props: TilesProps, ref: React.Ref<TilesProps.Ref>) => {
  const baseComponentProps = useBaseComponent('Tiles', {
    props: { columns: props.columns, readOnly: props.readOnly },
  });
  const componentAnalyticsMetadata: GeneratedAnalyticsMetadataTilesComponent = {
    name: 'awsui.Tiles',
    label: { root: 'self' },
    properties: {
      value: `${props.value}`,
    },
  };
  return (
    <InternalTiles
      ref={ref}
      {...props}
      {...baseComponentProps}
      {...getAnalyticsMetadataAttribute({
        component: componentAnalyticsMetadata,
      })}
    />
  );
});

applyDisplayName(Tiles, 'Tiles');
export default Tiles;
