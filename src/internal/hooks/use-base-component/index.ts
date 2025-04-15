// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { MutableRefObject } from 'react';

import {
  ComponentConfiguration,
  useComponentMetadata,
  useFocusVisible,
} from '@cloudscape-design/component-toolkit/internal';

import { AnalyticsMetadata } from '../../analytics/interfaces';
import { PACKAGE_VERSION } from '../../environment';
import { useTelemetry } from '../use-telemetry';

export interface InternalBaseComponentProps<T = any> {
  __internalRootRef?: MutableRefObject<T | null> | null;
}

export function transformAnalyticsMetadata(analyticsMetadata?: AnalyticsMetadata) {
  if (!analyticsMetadata) {
    return undefined;
  }

  const transformedAnalyticsMetadata = {
    ...analyticsMetadata,
    errorContext: { ...analyticsMetadata.errorContext },
  };

  // TODO: Remove "as any" once https://github.com/cloudscape-design/component-toolkit/pull/130 has been published to npm
  return transformedAnalyticsMetadata as any;
}

/**
 * This hook is used for components which are exported to customers. The returned __internalRootRef needs to be
 * attached to the (internal) component's root DOM node. The hook takes care of attaching the metadata to this
 * root DOM node and emits the telemetry for this component.
 */
export default function useBaseComponent<T = any>(
  componentName: string,
  config?: ComponentConfiguration,
  analyticsMetadata?: AnalyticsMetadata
) {
  useTelemetry(componentName, config);
  useFocusVisible();

  const metadata = transformAnalyticsMetadata(analyticsMetadata);
  const elementRef = useComponentMetadata<T>(componentName, PACKAGE_VERSION, metadata);
  return { __internalRootRef: elementRef };
}
