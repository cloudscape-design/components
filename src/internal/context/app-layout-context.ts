// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useContext } from 'react';
import { createDomContext } from '../hooks/dom-context';

export interface AppLayoutContextProps {
  stickyOffsetBottom: number;
  stickyOffsetTop: number;
}

export const AppLayoutDomContext = createDomContext<AppLayoutContextProps>('app-layout-context', {
  stickyOffsetTop: 0,
  stickyOffsetBottom: 0,
});

export function useAppLayoutContext() {
  const context = useContext(AppLayoutDomContext.context);
  return { ...context };
}
