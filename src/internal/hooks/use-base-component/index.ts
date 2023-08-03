// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { MutableRefObject } from 'react';
import { useComponentMetadata } from '@cloudscape-design/component-toolkit/internal';
import { useTelemetry } from '../use-telemetry';
import { PACKAGE_VERSION } from '../../environment';
import useFocusVisible from '../focus-visible';
import { useVisualRefresh } from '../use-visual-mode';

export interface InternalBaseComponentProps {
  __internalRootRef?: MutableRefObject<any> | null;
}

/**
 * This hook is used for components which are exported to customers. The returned __internalRootRef needs to be
 * attached to the (internal) component's root DOM node. The hook takes care of attaching the metadata to this
 * root DOM node and emits the telemetry for this component.
 */
export default function useBaseComponent<T = any>(componentName: string, componentConfiguration?: Record<string, any>) {
  const isVisualRefresh = useVisualRefresh();
  if (isVisualRefresh && typeof document !== 'undefined' && !document.querySelector('.awsui-visual-refresh')) {
    document.body.classList.add('awsui-visual-refresh');
  }
  useTelemetry(componentName);
  useFocusVisible();
  const elementRef = useComponentMetadata<T>(componentName, PACKAGE_VERSION, componentConfiguration);
  return { __internalRootRef: elementRef };
}
