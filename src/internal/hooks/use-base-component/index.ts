// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { MutableRefObject } from 'react';

import {
  ComponentConfiguration,
  useComponentMetadata,
  useComponentMetrics,
  useFocusVisible,
} from '@cloudscape-design/component-toolkit/internal';

import { AnalyticsMetadata } from '../../analytics/interfaces.js';
import { PACKAGE_SOURCE, PACKAGE_VERSION, THEME } from '../../environment.js';
import { getVisualTheme } from '../../utils/get-visual-theme.js';
import { useVisualRefresh } from '../use-visual-mode/index.js';
import { useMissingStylesCheck } from './styles-check.js';

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
  const elementRef = useComponentMetadata<T>(
    componentName,
    { packageName: PACKAGE_SOURCE, version: PACKAGE_VERSION, theme },
    analyticsMetadata as any
  );
  useMissingStylesCheck(elementRef as React.RefObject<HTMLElement>);
  useFocusVisible(elementRef as React.RefObject<HTMLElement>);
  return { __internalRootRef: elementRef };
}
