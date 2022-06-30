// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { ALWAYS_VISUAL_REFRESH } from '../../environment';
import { isMotionDisabled } from '../../motion';
import { findUpUntil } from '../../utils/dom';
import { useMutationObserver } from '../use-mutation-observer';

export function useCurrentMode(elementRef: React.RefObject<HTMLElement>) {
  const [value, setValue] = useState<'light' | 'dark'>('light');
  useMutationObserver(elementRef, node => {
    const darkModeParent = findUpUntil(
      node,
      node => node.classList.contains('awsui-polaris-dark-mode') || node.classList.contains('awsui-dark-mode')
    );
    setValue(darkModeParent ? 'dark' : 'light');
  });
  return value;
}

export function useDensityMode(elementRef: React.RefObject<HTMLElement>) {
  const [value, setValue] = useState<'comfortable' | 'compact'>('comfortable');
  useMutationObserver(elementRef, node => {
    const compactModeParent = findUpUntil(
      node,
      node => node.classList.contains('awsui-polaris-compact-mode') || node.classList.contains('awsui-compact-mode')
    );
    setValue(compactModeParent ? 'compact' : 'comfortable');
  });
  return value;
}

export function useVisualRefresh(elementRef: React.RefObject<HTMLElement>) {
  const [value, setValue] = useState(Boolean(ALWAYS_VISUAL_REFRESH));
  useMutationObserver(elementRef, node => {
    const supportsCSSVariables = window.CSS?.supports?.('color', 'var(--test-var)');
    if (!supportsCSSVariables || ALWAYS_VISUAL_REFRESH) {
      return;
    }
    const visualRefreshParent = findUpUntil(node, node => node.classList.contains('awsui-visual-refresh'));
    setValue(!!visualRefreshParent);
  });
  return value;
}

export function useReducedMotion(elementRef: React.RefObject<HTMLElement>) {
  const [value, setValue] = useState(false);
  useMutationObserver(elementRef, node => {
    setValue(isMotionDisabled(node));
  });
  return value;
}
