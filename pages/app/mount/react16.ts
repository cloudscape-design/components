// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import ReactDOM from 'react-dom';

console.log(`Using React ${React.version}`);

export function mount(element: React.ReactElement, container: HTMLElement) {
  ReactDOM.render(element, container);
}
export function unmount(container: Element) {
  ReactDOM.unmountComponentAtNode(container);
}
