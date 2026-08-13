// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import {
  ComponentConfiguration,
  initThemes,
  useComponentMetadata,
  useComponentMetrics,
  useFocusVisible,
} from '@cloudscape-design/component-toolkit/internal';

import { AnalyticsMetadata } from '../../../types/analytics';
import { ALWAYS_VISUAL_REFRESH, PACKAGE_SOURCE, PACKAGE_VERSION, THEME } from '../../environment';
import { getVisualTheme } from '../../utils/get-visual-theme';
import { useVisualRefresh } from '../use-visual-mode';
import { useMissingStylesCheck } from './styles-check';

export interface InternalBaseComponentProps {
  // Typescript requires Ref type to be exact DOM element type it is assigned to, e.g. HTMLDivElement
  // Typical community practice is explicit type casting: https://stackoverflow.com/questions/61102101/cannot-assign-refobjecthtmldivelement-to-refobjecthtmlelement-instance
  // To avoid doing this, we use any to skip type checks. Treat this type as pass through, never
  // read `__internalRootRef.current`, use your own refs if you need
  __internalRootRef?: React.Ref<any>;
}

/**
 * This hook is used for components which are exported to customers. The returned __internalRootRef needs to be
 * attached to the (internal) component's root DOM node. The hook takes care of attaching the metadata to this
 * root DOM node and emits the telemetry for this component.
 */

let themesInitialized = false;

/** for testing only */
export function clearThemesInitialized() {
  themesInitialized = false;
}

export default function useBaseComponent(
  componentName: string,
  config?: ComponentConfiguration,
  analyticsMetadata?: AnalyticsMetadata
) {
  if (!themesInitialized) {
    initThemes({ skipVisualRefresh: ALWAYS_VISUAL_REFRESH });
    themesInitialized = true;
  }

  const isVisualRefresh = useVisualRefresh();
  const theme = getVisualTheme(THEME, isVisualRefresh);
  useComponentMetrics(componentName, { packageSource: PACKAGE_SOURCE, packageVersion: PACKAGE_VERSION, theme }, config);
  const elementRef = useComponentMetadata(
    componentName,
    { packageName: PACKAGE_SOURCE, version: PACKAGE_VERSION, theme },
    analyticsMetadata as any
  );
  useMissingStylesCheck(elementRef);
  useFocusVisible(elementRef);
  return { __internalRootRef: elementRef };
}
