// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { MutableRefObject } from 'react';
import { ComponentConfiguration, useComponentMetadata } from '@cloudscape-design/component-toolkit/internal';

import { useTelemetry } from '../use-telemetry';
import { PACKAGE_VERSION } from '../../environment';
import useFocusVisible from '../focus-visible';
import { AnalyticsMetadata } from '../../analytics/interfaces';

export interface InternalBaseComponentProps<T = any> {
  __internalRootRef?: MutableRefObject<T | null> | null;
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
  const elementRef = useComponentMetadata<T>(componentName, PACKAGE_VERSION, { ...analyticsMetadata });
  return { __internalRootRef: elementRef };
}
