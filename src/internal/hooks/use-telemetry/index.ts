// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useComponentMetrics } from '@cloudscape-design/component-toolkit/internal';
import { PACKAGE_SOURCE, PACKAGE_VERSION, THEME } from '../../environment';
import { useVisualRefresh } from '../use-visual-mode';

export function useTelemetry(componentName: string) {
  const theme = useVisualRefresh() ? 'vr' : THEME;
  useComponentMetrics(componentName, { packageSource: PACKAGE_SOURCE, packageVersion: PACKAGE_VERSION, theme });
}
