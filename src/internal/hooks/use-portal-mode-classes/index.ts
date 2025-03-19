// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { useCurrentMode, useDensityMode } from '@cloudscape-design/component-toolkit/internal';

import { useVisualContext } from '../../components/visual-context';

export function usePortalModeClasses(ref: React.RefObject<HTMLElement>) {
  const colorMode = useCurrentMode(ref);
  const densityMode = useDensityMode(ref);
  const context = useVisualContext(ref);
  return clsx({
    'awsui-polaris-dark-mode awsui-dark-mode': colorMode === 'dark',
    'awsui-polaris-compact-mode awsui-compact-mode': densityMode === 'compact',
    [`awsui-context-${context}`]: context,
  });
}
