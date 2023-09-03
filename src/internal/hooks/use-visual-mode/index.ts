// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { ALWAYS_VISUAL_REFRESH } from '../../environment';
import { isDevelopment } from '../../is-development';
import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

interface ExtendedWindow extends Window {
  [key: symbol]: (() => boolean) | undefined;
}
declare const window: ExtendedWindow;

export const useVisualRefresh = ALWAYS_VISUAL_REFRESH ? () => true : useVisualRefreshDynamic;

// We expect VR is to be set only once and before the application is rendered.
let visualRefreshState: undefined | boolean = undefined;

// for testing
export function clearVisualRefreshState() {
  visualRefreshState = undefined;
}

function detectVisualRefresh() {
  return typeof document !== 'undefined' && !!document.querySelector('.awsui-visual-refresh');
}

export function useVisualRefreshDynamic() {
  if (visualRefreshState === undefined) {
    if (typeof window !== 'undefined' && window[Symbol.for('isVisualRefresh')]?.()) {
      document.body.classList.add('awsui-visual-refresh');
    }
    visualRefreshState = detectVisualRefresh();
  }
  if (isDevelopment) {
    const newVisualRefreshState = detectVisualRefresh();
    if (newVisualRefreshState !== visualRefreshState) {
      warnOnce(
        'Visual Refresh',
        'Dynamic visual refresh change detected. This is not supported. ' +
          'Make sure `awsui-visual-refresh` is attached to the `<body>` element before initial React render'
      );
    }
  }
  return visualRefreshState;
}
