// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { RefObject } from 'react';
import { useComponentMetadata } from '@cloudscape-design/component-toolkit/internal';
import { useTelemetry } from '../use-telemetry';
import { PACKAGE_VERSION } from '../../environment';
import useFocusVisible from '../focus-visible';

export interface InternalBaseComponentProps<T = any> {
  __internalRootRef?: RefObject<T> | null;
}

/**
 * This hook is used for components which are exported to customers. The returned __internalRootRef needs to be
 * attached to the (internal) component's root DOM node. The hook takes care of attaching the metadata to this
 * root DOM node and emits the telemetry for this component.
 */
export default function useBaseComponent<T = any>(componentName: string, componentConfiguration?: Record<string, any>) {
  useTelemetry(componentName);
  useFocusVisible();
  const elementRef = useComponentMetadata<T>(componentName, PACKAGE_VERSION, componentConfiguration);
  return { __internalRootRef: elementRef };
}
