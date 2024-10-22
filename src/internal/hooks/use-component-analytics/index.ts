// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useRef } from 'react';

import { ComponentMetrics } from '../../analytics';
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

export function useComponentAnalytics(
  componentName: string,
  elementRef: React.RefObject<HTMLElement>,
  getDetails: () => Record<string, string | boolean | number | undefined>
) {
  const taskInteractionId = useRandomId();
  const attributes = useTaskInteractionAttribute(elementRef, taskInteractionId);

  useEffect(() => {
    ComponentMetrics.componentMounted({ taskInteractionId, componentName, details: getDetails() });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskInteractionId]);

  return { taskInteractionId, attributes };
}
