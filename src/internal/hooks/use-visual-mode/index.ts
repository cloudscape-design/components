// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useRuntimeVisualRefresh } from '@cloudscape-design/component-toolkit/internal';

import { ALWAYS_VISUAL_REFRESH } from '../../environment';

export const useVisualRefresh = ALWAYS_VISUAL_REFRESH ? () => true : useRuntimeVisualRefresh;

function useRuntimeOneTheme(): boolean {
  if (typeof document === 'undefined') {
    return false;
  }
  return document.body.classList.contains('awsui-one-theme');
}

export const useOneTheme = useRuntimeOneTheme;
