// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { TilesProps } from './interfaces';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import useBaseComponent from '../internal/hooks/use-base-component';
import InternalTiles from './internal';

export { TilesProps };

export default function Tiles(props: TilesProps) {
  const baseComponentProps = useBaseComponent('Tiles');
  return <InternalTiles {...props} {...baseComponentProps} />;
}

applyDisplayName(Tiles, 'Tiles');
