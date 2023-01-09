// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useContext, createContext } from 'react';

export interface AppLayoutContextProps {
  stickyOffsetBottom: number;
  stickyOffsetTop: number;
  hasBreadcrumbs: boolean;
  setHasStickyBackground?: (hasBackground: boolean) => void;
  setDynamicOverlapHeight?: (height: number) => void;
}

export const AppLayoutContext = createContext<AppLayoutContextProps>({
  stickyOffsetTop: 0,
  stickyOffsetBottom: 0,
  hasBreadcrumbs: false,
});

export function useAppLayoutContext() {
  const context = useContext(AppLayoutContext);
  return { ...context };
}
