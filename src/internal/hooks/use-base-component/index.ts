// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { MutableRefObject } from 'react';
import { useComponentMetadata } from '@cloudscape-design/component-toolkit/internal/base-component';
import { useTelemetry } from '../use-telemetry';
import { PACKAGE_VERSION } from '../../environment';

export interface InternalBaseComponentProps {
  __internalRootRef?: MutableRefObject<any> | null;
}

/**
 * This hook is used for components which are exported to customers. The returned __internalRootRef needs to be
 * attached to the (internal) component's root DOM node. The hook takes care of attaching the metadata to this
 * root DOM node and emits the telemetry for this component.
 */
export default function useBaseComponent<T = any>(componentName: string) {
  useTelemetry(componentName);
  const elementRef = useComponentMetadata<T>(componentName, PACKAGE_VERSION);
  return { __internalRootRef: elementRef };
}
