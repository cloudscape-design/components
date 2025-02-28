// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useCallback, useEffect } from 'react';

import { fireNonCancelableEvent, NonCancelableEventHandler } from '../../internal/events/index.js';
import { useControllable } from '../../internal/hooks/use-controllable/index.js';
import { AreaChartProps } from '../interfaces.js';

type HighlightProps<T> = [null | AreaChartProps.Series<T>, (s: null | AreaChartProps.Series<T>) => void];

// Provides controlled or uncontrolled props to highlight chart elements.
export default function useHighlightProps<T>(
  series: readonly AreaChartProps.Series<T>[],
  controlledHighlightedSeries?: null | AreaChartProps.Series<T>,
  controlledOnHighlightChange?: NonCancelableEventHandler<AreaChartProps.HighlightChangeDetail<T>>
): HighlightProps<T> {
  const [highlightedSeries = null, setHighlightedSeries] = useControllable(
    controlledHighlightedSeries,
    controlledOnHighlightChange,
    null,
    {
      componentName: 'AreaChart',
      controlledProp: 'highlightedSeries',
      changeHandler: 'onHighlightChange',
    }
  );

  const notifyHighlightedSeries = useCallback(
    (s: null | AreaChartProps.Series<T>) => {
      fireNonCancelableEvent(controlledOnHighlightChange, { highlightedSeries: s });
    },
    [controlledOnHighlightChange]
  );

  // Reset highlights if series change.
  useEffect(() => {
    if (controlledHighlightedSeries) {
      const highlightedSeriesIndex = series.indexOf(controlledHighlightedSeries);

      if (highlightedSeriesIndex === -1) {
        setHighlightedSeries(null);
        notifyHighlightedSeries(null);
      }
    }
  }, [series, controlledHighlightedSeries, setHighlightedSeries, notifyHighlightedSeries]);

  return [highlightedSeries, notifyHighlightedSeries];
}
