// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useCallback, useEffect, useRef } from 'react';

import { awsuiPluginsInternal } from '../../../internal/plugins/api';
import { BreadcrumbsConsumerPayload, WidgetMessage } from '../../../internal/plugins/widget/interfaces';

/**
 * Bridges breadcrumbs consumers registered through the widget API into the shared breadcrumbs
 * controller. The controller stays the coordination point -- it aggregates producers across App
 * Layout instances and drives the yield -- while the widget API is the entry point a surface outside
 * App Layout uses to subscribe.
 *
 * Returns a handler that reports whether it consumed the message.
 */
export function useBreadcrumbsConsumers() {
  const disposers = useRef(new Map<string, () => void>());

  useEffect(
    () => () => {
      disposers.current.forEach(dispose => dispose());
      disposers.current.clear();
    },
    []
  );

  return useCallback((message: WidgetMessage) => {
    if (message.type === 'registerBreadcrumbsConsumer') {
      const { id, onBreadcrumbsChange } = message.payload as BreadcrumbsConsumerPayload;
      // Re-registering the same id replaces the previous subscription rather than leaking it.
      disposers.current.get(id)?.();
      disposers.current.set(id, awsuiPluginsInternal.breadcrumbs.onBreadcrumbsChange(onBreadcrumbsChange));
      return true;
    }

    if (message.type === 'deregisterBreadcrumbsConsumer') {
      const { id } = message.payload;
      disposers.current.get(id)?.();
      disposers.current.delete(id);
      return true;
    }

    return false;
  }, []);
}
