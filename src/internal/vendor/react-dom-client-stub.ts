// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

//
// React DOM Client compatibility layer
//
// Provides createRoot for React 18+ while remaining safe to import in React 16/17.
// The main react-dom export includes createRoot in React 18 but logs a deprecation
// warning when it's called. We suppress that single warning around the call since
// a static import of react-dom/client would break React 16/17 at build time.
//

import React from 'react';
import ReactDOM from 'react-dom';

export interface Root {
  render: (element: React.ReactElement) => void;
  unmount: () => void;
}

export type CreateRootFn = (container: HTMLElement) => Root;

const nativeCreateRoot: CreateRootFn | undefined =
  typeof (ReactDOM as any).createRoot === 'function' ? (ReactDOM as any).createRoot : undefined;

/**
 * createRoot resolved from the current React environment.
 * - React 16/17: undefined (createRoot doesn't exist)
 * - React 18+: wraps the native createRoot, suppressing the deprecation warning
 *   that React 18 emits when createRoot is called from the main react-dom export
 */
export const createRoot: CreateRootFn | undefined = nativeCreateRoot
  ? (container: HTMLElement): Root => {
      const prev = console.error;
      console.error = (...args: any[]) => {
        if (typeof args[0] === 'string' && args[0].includes('importing createRoot from "react-dom"')) {
          return;
        }
        prev.apply(console, args);
      };
      try {
        return nativeCreateRoot!(container);
      } finally {
        console.error = prev;
      }
    }
  : undefined;
