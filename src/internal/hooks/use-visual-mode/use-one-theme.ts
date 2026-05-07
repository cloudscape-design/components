// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import { isDevelopment } from '../../is-development';

/**
 * Mirrors `useRuntimeVisualRefresh`. The theme activation is decided once on
 * first render (presence of `.awsui-one-theme` anywhere in the document) and
 * cached. In development we warn if the state changes later, matching the
 * "set on <body> before initial React render" contract Cloudscape uses for VR.
 */

// We expect One Theme to be set only once and before the application is rendered.
let oneThemeState: boolean | undefined;

// Exposed for tests; mirrors clearVisualRefreshState.
export function clearOneThemeState(): void {
  oneThemeState = undefined;
  if (typeof document !== 'undefined') {
    document.body.classList.remove('awsui-one-theme');
  }
}

function detectOneThemeClassName(): boolean {
  return typeof document !== 'undefined' && !!document.querySelector('.awsui-one-theme');
}

export function useOneTheme(): boolean {
  if (oneThemeState === undefined) {
    oneThemeState = detectOneThemeClassName();
  }
  if (isDevelopment) {
    const newState = detectOneThemeClassName();
    if (newState !== oneThemeState) {
      warnOnce(
        'One Theme',
        'Dynamic one-theme change detected. This is not supported. ' +
          'Make sure `awsui-one-theme` is attached to the `<body>` element before initial React render'
      );
    }
  }
  return oneThemeState;
}
