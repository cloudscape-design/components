// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

declare module '~mount' {
  import type React from 'react';

  export function mount(element: React.ReactElement, container: HTMLElement): void;
  export function unmount(container: Element): void;
}
