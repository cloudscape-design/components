// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { RefObject, useEffect } from 'react';

import { ComponentConfiguration } from '@cloudscape-design/component-toolkit/internal';

import { AnalyticsMetadata } from '../analytics/interfaces';
import { trackEvent } from '../analytics-v2';

function toKebabCase(str: string) {
  return str
    .trim()
    .replace(/\s+/g, '-')
    .replace(/_/g, '-')
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase();
}

export function useComponentTracking<T>(
  ref: RefObject<T>,
  componentName: string,
  config?: ComponentConfiguration,
  analyticsMetadata?: AnalyticsMetadata
) {
  useEffect(() => {
    if (ref.current) {
      const node = ref.current as unknown as HTMLElement;
      node.setAttribute('data-analytics-component', toKebabCase(componentName));
      trackEvent(node, 'render', { componentName, detail: { config, analyticsMetadata } });
    }
  });

  useEffect(() => {
    if (ref.current) {
      const node = ref.current as unknown as HTMLElement;
      node.setAttribute('data-analytics-component', toKebabCase(componentName));
      trackEvent(node, 'mount', { componentName, detail: { config, analyticsMetadata } });

      return () => {
        trackEvent(node, 'unmount', { componentName });
      };
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
