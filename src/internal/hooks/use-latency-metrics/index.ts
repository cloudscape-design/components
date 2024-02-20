// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useRef } from 'react';
import { useIdFallback } from '../use-unique-id';
import { useEffectOnUpdate } from '../use-effect-on-update';
import { isInViewport } from './is-in-viewport';
import { metrics } from '../../analytics/metrics';

export function useLatencyMetrics(
  componentName: string,
  elementRef: React.RefObject<HTMLElement>,
  instanceId: string | undefined,
  loading: boolean | undefined = false,
  componentType: 'spinner' | undefined = undefined
) {
  const lifecycleId = useIdFallback();

  const isLoadingOrSpinner = loading || componentType === 'spinner';

  const loadingStartTime = useRef<undefined | number>(undefined);
  if (isLoadingOrSpinner && loadingStartTime.current === undefined) {
    loadingStartTime.current = performance.now();
  }

  useEffect(() => {
    if (!elementRef.current) {
      return;
    }

    const cleanup = isInViewport(elementRef.current!, inViewport => {
      emitMetric({
        type: 'mounted',
        lifecycleId,
        componentName,
        inViewport,
        metadata: { instanceId },
        loading: isLoadingOrSpinner,
        loadingDuration: undefined,
      });
    });

    return () => {
      cleanup();

      if (loadingStartTime.current !== undefined) {
        const loadingDuration = performance.now() - loadingStartTime.current;

        emitMetric({
          type: componentType === 'spinner' ? 'loading-finished' : 'loading-cancelled',
          lifecycleId,
          componentName,
          inViewport: undefined,
          metadata: { instanceId },
          loading: isLoadingOrSpinner,
          loadingDuration,
        });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffectOnUpdate(() => {
    if (componentType === 'spinner') {
      // The spinner component is handled in the other effect above.
      return;
    }
    if (loading) {
      emitMetric({
        type: 'loading-started',
        lifecycleId,
        componentName,
        inViewport: undefined,
        metadata: { instanceId },
        loading: isLoadingOrSpinner,
        loadingDuration: undefined,
      });
    } else {
      if (loadingStartTime.current === undefined) {
        return;
      }
      const loadingDuration = performance.now() - loadingStartTime.current;
      loadingStartTime.current = undefined;

      emitMetric({
        type: 'loading-finished',
        lifecycleId,
        componentName,
        inViewport: undefined,
        metadata: { instanceId },
        loading: isLoadingOrSpinner,
        loadingDuration,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);
}

interface EventDetail {
  type: 'mounted' | 'loading-started' | 'loading-finished' | 'loading-cancelled';
  lifecycleId: string;
  componentName: string;
  inViewport: boolean | undefined;
  metadata: { instanceId: string | undefined };
  loading: boolean;
  loadingDuration: number | undefined;
}

function emitMetric(eventDetail: EventDetail) {
  metrics.sendPanoramaMetric({ eventType: 'awsui-latency', eventDetail: JSON.stringify(eventDetail) });
}
