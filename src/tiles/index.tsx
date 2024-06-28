// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { TilesProps } from './interfaces';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import useBaseComponent from '../internal/hooks/use-base-component';
import InternalTiles from './internal';
import { getAnalyticsMetadataAttribute } from '../internal/analytics/autocapture/utils';

export { TilesProps };
const componentName = 'Tiles';

const Tiles = React.forwardRef((props: TilesProps, ref: React.Ref<TilesProps.Ref>) => {
  const baseComponentProps = useBaseComponent(componentName, {
    props: { columns: props.columns },
  });
  return (
    <InternalTiles
      ref={ref}
      {...props}
      {...baseComponentProps}
      {...getAnalyticsMetadataAttribute({
        component: {
          name: componentName,
          label: '&',
        },
      })}
    />
  );
});

applyDisplayName(Tiles, componentName);
export default Tiles;
