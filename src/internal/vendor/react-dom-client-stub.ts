// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import ReactDOM from 'react-dom';

// Stub for react-dom/client when React 18 is not available
// This provides React 16/17 compatibility using the legacy render API

export interface Root {
  render: (element: any) => void;
  unmount: () => void;
}

// Map to track which containers have been rendered to
const containerMap = new Map<HTMLElement, any>();

// Stub createRoot that uses legacy ReactDOM.render for React 16/17
export function createRoot(container: HTMLElement): Root {
  containerMap.set(container, true);

  return {
    render: (element: any) => {
      ReactDOM.render(element, container);
    },
    unmount: () => {
      ReactDOM.unmountComponentAtNode(container);
      containerMap.delete(container);
    },
  };
}
