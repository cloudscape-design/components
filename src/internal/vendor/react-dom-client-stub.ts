// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// Stub for react-dom/client when React 18 is not available
// This allows the build to pass for React 16/17 while token mode features are disabled

export interface Root {
  render: (element: any) => void;
  unmount: () => void;
}

// Stub createRoot that does nothing (token mode won't work in React 16/17)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function createRoot(_container?: HTMLElement): Root {
  return {
    render: () => {
      // No-op in React 16/17
    },
    unmount: () => {
      // No-op in React 16/17
    },
  };
}
