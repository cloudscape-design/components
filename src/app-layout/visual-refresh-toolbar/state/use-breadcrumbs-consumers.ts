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
  const unregister = useRef<(() => void) | null>(null);

  useEffect(
    () => () => {
      unregister.current?.();
      unregister.current = null;
    },
    []
  );

  return useCallback((message: WidgetMessage) => {
    if (message.type === 'registerBreadcrumbsConsumer') {
      const { onBreadcrumbsChange } = message.payload as BreadcrumbsConsumerPayload;
      // The controller refuses a second consumer and warns; keep the live registration in that case.
      const registration = awsuiPluginsInternal.breadcrumbs.onBreadcrumbsChange(onBreadcrumbsChange);
      if (registration.registered) {
        unregister.current = registration.unregister;
      }
      return true;
    }

    if (message.type === 'deregisterBreadcrumbsConsumer') {
      unregister.current?.();
      unregister.current = null;
      return true;
    }

    return false;
  }, []);
}
