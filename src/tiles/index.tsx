// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { TilesProps } from './interfaces';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import useBaseComponent from '../internal/hooks/use-base-component';
import InternalTiles from './internal';

export { TilesProps };

const Tiles = React.forwardRef((props: TilesProps, ref: React.Ref<TilesProps.Ref>) => {
  const baseComponentProps = useBaseComponent('Tiles', { value: props.value, items: props.items });
  return <InternalTiles ref={ref} {...props} {...baseComponentProps} />;
});

applyDisplayName(Tiles, 'Tiles');
export default Tiles;
