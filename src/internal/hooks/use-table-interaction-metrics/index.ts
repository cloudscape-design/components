// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useRef } from 'react';

import { ComponentMetrics, PerformanceMetrics } from '../../analytics';
import { JSONObject } from '../../analytics/interfaces';
import { useDOMAttribute } from '../use-dom-attribute';
import { useEffectOnUpdate } from '../use-effect-on-update';
import { useRandomId } from '../use-unique-id';

/*
If the last user interaction is more than this time ago, it is not considered
to be the cause of the current loading state.
*/
const USER_ACTION_TIME_LIMIT = 1_000;

export interface UseTableInteractionMetricsProps<T> {
  elementRef: React.RefObject<HTMLElement>;
  instanceIdentifier: string | undefined;
  loading: boolean | undefined;
  items: readonly T[];
  itemCount: number;
  getComponentIdentifier: () => string | undefined;
  getComponentConfiguration: () => JSONObject;
  interactionMetadata: () => string;
}

export function useTableInteractionMetrics<T>({
  elementRef,
  itemCount,
  instanceIdentifier,
  getComponentIdentifier,
  getComponentConfiguration,
  loading = false,
  interactionMetadata,
  items,
}: UseTableInteractionMetricsProps<T>) {
  const taskInteractionId = useRandomId();
  const tableInteractionAttributes = useDOMAttribute(
    elementRef,
    'data-analytics-task-interaction-id',
    taskInteractionId
  );
  const lastUserAction = useRef<{ name: string; time: number } | null>(null);
  const capturedUserAction = useRef<string | null>(null);
  const loadingStartTime = useRef<number | null>(null);

  const metadata = useRef({ itemCount, getComponentIdentifier, getComponentConfiguration, interactionMetadata });
  metadata.current = { itemCount, getComponentIdentifier, getComponentConfiguration, interactionMetadata };

  useEffect(() => {
    ComponentMetrics.componentMounted({
      taskInteractionId,
      componentName: 'table',
      componentConfiguration: metadata.current.getComponentConfiguration(),
    });
  }, [taskInteractionId]);

  useEffect(() => {
    if (loading) {
      loadingStartTime.current = performance.now();

      if (lastUserAction.current && lastUserAction.current.time > performance.now() - USER_ACTION_TIME_LIMIT) {
        capturedUserAction.current = lastUserAction.current.name;
      } else {
        capturedUserAction.current = null;
      }
    }
  }, [loading]);

  useEffectOnUpdate(() => {
    if (!loading && loadingStartTime.current !== null) {
      const loadingDuration = performance.now() - loadingStartTime.current;
      loadingStartTime.current = null;

      PerformanceMetrics.tableInteraction({
        userAction: capturedUserAction.current ?? '',
        interactionTime: Math.round(loadingDuration),
        interactionMetadata: metadata.current.interactionMetadata(),
        componentIdentifier: metadata.current.getComponentIdentifier(),
        instanceIdentifier,
        noOfResourcesInTable: metadata.current.itemCount,
      });
    }
  }, [instanceIdentifier, loading, taskInteractionId]);

  useEffectOnUpdate(() => {
    if (!loading) {
      ComponentMetrics.componentUpdated({
        taskInteractionId,
        componentName: 'table',
        actionType: (capturedUserAction.current || lastUserAction.current?.name) ?? '',
        componentConfiguration: metadata.current.getComponentConfiguration(),
      });
    }
  }, [items, taskInteractionId, loading]);

  return {
    tableInteractionAttributes,
    setLastUserAction: (name: string) => void (lastUserAction.current = { name, time: performance.now() }),
  };
}
