// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { memo } from 'react';

import VerticalMarker from '../../internal/components/cartesian-chart/vertical-marker';

import { AreaChartProps } from '../interfaces';
import { ChartModel } from '../model';
import { useSelector } from '../../internal/async-store';

export default memo(AreaVerticalMarker) as typeof AreaVerticalMarker;

function AreaVerticalMarker<T extends AreaChartProps.DataTypes>({ model }: { model: ChartModel<T> }) {
  const highlightedX = useSelector(model.interactions, state => state.highlightedX);

  const verticalMarker = (highlightedX || []).map(point => ({
    key: `${point.index.x}:${point.index.s}`,
    x: point.scaled.x,
    y: point.scaled.y1,
    color: model.getInternalSeries(model.series[point.index.s]).color,
  }));

  return <VerticalMarker height={model.height} points={verticalMarker} ref={model.refs.verticalMarker} />;
}
