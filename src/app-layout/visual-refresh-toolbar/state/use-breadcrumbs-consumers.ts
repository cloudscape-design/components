// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useCallback, useEffect, useRef } from 'react';

import { awsuiPluginsInternal } from '../../../internal/plugins/api';
import { BreadcrumbsConsumerPayload, WidgetMessage } from '../../../internal/plugins/widget/interfaces';

/**
 * Bridges the breadcrumbs consumer registered through the widget API into the shared controller. The
 * controller stays the coordination point -- it aggregates producers across App Layout instances and
 * drives the yield -- while the widget API is only the entry point. Drawing is exclusive, so at most
 * one consumer is held.
 *
 * Returns a handler that reports whether it consumed the message.
 */
export function useBreadcrumbsConsumers() {
  const dispose = useRef<(() => void) | null>(null);

  useEffect(
    () => () => {
      dispose.current?.();
      dispose.current = null;
    },
    []
  );

  return useCallback((message: WidgetMessage) => {
    if (message.type === 'registerBreadcrumbsConsumer') {
      const { onBreadcrumbsChange } = message.payload as BreadcrumbsConsumerPayload;
      // Registered without disposing the previous subscription first, so the controller can apply its
      // replace policy and tell the outgoing consumer to stop drawing. The superseded disposer is
      // inert, so dropping it here leaks nothing.
      dispose.current = awsuiPluginsInternal.breadcrumbs.onBreadcrumbsChange(onBreadcrumbsChange);
      return true;
    }

    if (message.type === 'deregisterBreadcrumbsConsumer') {
      dispose.current?.();
      dispose.current = null;
      return true;
    }

    return false;
  }, []);
}
