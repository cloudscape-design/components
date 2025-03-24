// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentConfiguration, useComponentMetrics } from '@cloudscape-design/component-toolkit/internal';

import { PACKAGE_SOURCE, PACKAGE_VERSION, THEME } from '../../environment';
import { getVisualTheme } from '../../utils/get-visual-theme';
import { useVisualRefresh } from '../use-visual-mode';

export function useTelemetry(componentName: string, config?: ComponentConfiguration) {
  const isVisualRefresh = useVisualRefresh();
  const theme = getVisualTheme(THEME, isVisualRefresh);
  useComponentMetrics(componentName, { packageSource: PACKAGE_SOURCE, packageVersion: PACKAGE_VERSION, theme }, config);
}
