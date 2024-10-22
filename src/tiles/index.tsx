// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { getAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { GeneratedAnalyticsMetadataTilesComponent } from './analytics-metadata/interfaces';
import { TilesProps } from './interfaces';
import InternalTiles from './internal';

export { TilesProps };

const Tiles = React.forwardRef((props: TilesProps, ref: React.Ref<TilesProps.Ref>) => {
  const baseComponentProps = useBaseComponent('Tiles', {
    props: { columns: props.columns, readOnly: props.readOnly },
  });
  const componentAnalyticsMetadata: GeneratedAnalyticsMetadataTilesComponent = {
    name: 'awsui.Tiles',
    label: { root: 'self' },
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
