// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React from 'react';
import { useVisualContext } from '../../components/visual-context';
import { useCurrentMode, useDensityMode, useVisualRefresh } from '../use-visual-mode';

export function usePortalModeClasses(ref: React.RefObject<HTMLElement>) {
  const colorMode = useCurrentMode(ref);
  const densityMode = useDensityMode(ref);
  const context = useVisualContext(ref);
  const visualRefresh = useVisualRefresh();
  return clsx({
    'awsui-polaris-dark-mode awsui-dark-mode': colorMode === 'dark',
    'awsui-polaris-compact-mode awsui-compact-mode': densityMode === 'compact',
    'awsui-visual-refresh': visualRefresh,
    [`awsui-context-${context}`]: context,
  });
}

export function isInsidePortal(node: Element | null): boolean {
  return !!node?.closest(`.${styles.portal}`);
}
