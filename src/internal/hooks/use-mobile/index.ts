// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { createSingletonState } from '@cloudscape-design/component-toolkit/internal';

import { getMatchingBreakpoint, mobileBreakpoint } from '../../breakpoints';

export const forceMobileModeSymbol = Symbol.for('awsui-force-mobile-mode');

function getIsMobile() {
  // allow overriding the mobile mode in tests
  // any is needed because of this https://github.com/microsoft/TypeScript/issues/36813
  const forceMobileMode = (globalThis as any)[forceMobileModeSymbol];
  if (typeof forceMobileMode !== 'undefined') {
    return forceMobileMode;
  }
  if (typeof window === 'undefined') {
    // assume desktop in server-rendering
    return false;
  }

  if (window.matchMedia) {
    /**
     * Some browsers include the scrollbar width in their media query calculations, but
     * some browsers don't. Thus we can't use `window.innerWidth` or
     * `document.documentElement.clientWidth` to get a very accurate result (since we
     * wouldn't know which one of them to use).
     * Instead, we use the media query here in JS too.
     */
    return window.matchMedia(`(max-width: ${mobileBreakpoint}px)`).matches;
  }

  return getMatchingBreakpoint(window.innerWidth, ['xs']) !== 'xs';
}

export const useMobile = createSingletonState<boolean>({
  initialState: () => getIsMobile(),
  factory: handler => {
    const listener = () => handler(getIsMobile());
    window.addEventListener('resize', listener);
    return () => {
      window.removeEventListener('resize', listener);
    };
  },
});
