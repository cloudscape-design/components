// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
// react-dom/client not available in React 16 — using legacy ReactDOM.render
import React from 'react';
import ReactDOM from 'react-dom';

export function mount(element: React.ReactElement, container: HTMLElement): void {
  ReactDOM.render(element, container);
}

export function unmount(container: HTMLElement): void {
  ReactDOM.unmountComponentAtNode(container);
}
