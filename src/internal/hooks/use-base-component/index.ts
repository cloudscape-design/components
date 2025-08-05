// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { MutableRefObject } from 'react';

import {
  ComponentConfiguration,
  useComponentMetadata,
  useComponentMetrics,
} from '@cloudscape-design/component-toolkit/internal';

import { AnalyticsMetadata } from '../../analytics/interfaces';
import { PACKAGE_SOURCE, PACKAGE_VERSION, THEME } from '../../environment';
import { getVisualTheme } from '../../utils/get-visual-theme';
import { useVisualRefresh } from '../use-visual-mode';
import { useMissingStylesCheck } from './styles-check';

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
  const isVisualRefresh = useVisualRefresh();
  const theme = getVisualTheme(THEME, isVisualRefresh);
  useComponentMetrics(componentName, { packageSource: PACKAGE_SOURCE, packageVersion: PACKAGE_VERSION, theme }, config);
  useMissingStylesCheck();
  const elementRef = useComponentMetadata<T>(
    componentName,
    { packageName: PACKAGE_SOURCE, version: PACKAGE_VERSION, theme },
    analyticsMetadata as any
  );
  useFocusVisible(elementRef as MutableRefObject<HTMLElement>);
  return { __internalRootRef: elementRef };
}
