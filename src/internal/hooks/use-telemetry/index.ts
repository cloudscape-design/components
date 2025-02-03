// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentConfiguration, useComponentMetrics } from '@cloudscape-design/component-toolkit/internal';

import { PACKAGE_SOURCE, PACKAGE_VERSION } from '../../environment';

export function useTelemetry(componentName: string, config?: ComponentConfiguration) {
  const theme = 'vr';
  useComponentMetrics(componentName, { packageSource: PACKAGE_SOURCE, packageVersion: PACKAGE_VERSION, theme }, config);
}
