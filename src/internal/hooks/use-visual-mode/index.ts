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

// We expect VR is to be set only once and before the application is rendered.
let visualRefreshState: undefined | boolean = undefined;

export function useVisualRefresh() {
  if (visualRefreshState === undefined) {
    const supportsCSSVariables = typeof window !== 'undefined' && window.CSS?.supports?.('color', 'var(--test-var)');

    if (ALWAYS_VISUAL_REFRESH) {
      visualRefreshState = true;
    } else if (!supportsCSSVariables) {
      visualRefreshState = false;
    } else {
      visualRefreshState = !!document.querySelector('.awsui-visual-refresh');
    }
  }
  return visualRefreshState;
}

export function useReducedMotion(elementRef: React.RefObject<HTMLElement>) {
  const [value, setValue] = useState(false);
  useMutationObserver(elementRef, node => {
    setValue(isMotionDisabled(node));
  });
  return value;
}
