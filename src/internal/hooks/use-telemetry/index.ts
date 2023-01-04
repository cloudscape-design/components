// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useEffect } from 'react';
import { THEME } from '../../environment';
import { Metrics } from '../../metrics';
import { useVisualRefresh } from '../use-visual-mode';

export function useTelemetry(componentName: string) {
  const isVisualRefresh = useVisualRefresh();

  useEffect(() => {
    Metrics.initMetrics(isVisualRefresh ? 'vr' : THEME);
    if (typeof window !== 'undefined') {
      Metrics.sendMetricOnce('awsui-viewport-width', window.innerWidth || 0);
      Metrics.sendMetricOnce('awsui-viewport-height', window.innerHeight || 0);
    }
    Metrics.logComponentLoaded();
    Metrics.logComponentUsed(componentName.toLowerCase());
    // Components do not change the name dynamically. Explicit empty array to prevent accidential double metrics
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
