// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useRef } from 'react';

import { ComponentMetrics, PerformanceMetrics } from '../../analytics';
import { useEffectOnUpdate } from '../use-effect-on-update';
import { useRandomId } from '../use-unique-id';

function useTaskInteractionAttribute(elementRef: React.RefObject<HTMLElement>, value: string) {
  const attributeName = 'data-analytics-task-interaction-id';

  const attributeValueRef = useRef<string | undefined>();

  useEffect(() => {
    // With this effect, we apply the attribute only on the client, to avoid hydration errors.
    attributeValueRef.current = value;
    elementRef.current?.setAttribute(attributeName, value);
  }, [value, elementRef]);

  return {
    [attributeName]: attributeValueRef.current,
  };
}

/*
If the last user interaction is more than this time ago, it is not considered
to be the cause of the current loading state.
*/
const USER_ACTION_TIME_LIMIT = 1_000;

export interface UseTableInteractionMetricsProps {
  elementRef: React.RefObject<HTMLElement>;
  instanceIdentifier: string | undefined;
  loading: boolean | undefined;
  itemCount: number;
  getComponentIdentifier: () => string | undefined;
  getComponentConfiguration: () => string | undefined;
  interactionMetadata: () => string;
}

export function useTableInteractionMetrics({
  elementRef,
  itemCount,
  instanceIdentifier,
  getComponentIdentifier,
  getComponentConfiguration,
  loading = false,
  interactionMetadata,
}: UseTableInteractionMetricsProps) {
  const taskInteractionId = useRandomId();
  const tableInteractionAttributes = useTaskInteractionAttribute(elementRef, taskInteractionId);
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

      ComponentMetrics.componentUpdated({
        taskInteractionId,
        componentName: 'table',
        actionType: capturedUserAction.current ?? '',
        componentConfiguration: metadata.current.getComponentConfiguration(),
      });
    }
  }, [instanceIdentifier, loading, taskInteractionId]);

  return {
    tableInteractionAttributes,
    setLastUserAction: (name: string) => void (lastUserAction.current = { name, time: performance.now() }),
  };
}
