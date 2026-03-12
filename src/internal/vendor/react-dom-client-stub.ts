// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// Compatibility layer for React 16/17
// This is only used when react-dom/client (React 18+) is not available

import React from 'react';
import ReactDOM from 'react-dom';

export interface Root {
  render: (element: React.ReactElement) => void;
  unmount: () => void;
}

export function createRoot(container: HTMLElement): Root {
  // React 16/17 compatible implementation using legacy render API
  return {
    render: (element: React.ReactElement) => {
      ReactDOM.render(element, container);
    },
    unmount: () => {
      ReactDOM.unmountComponentAtNode(container);
    },
  };
}
