// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useContext, createContext } from 'react';

export interface AppLayoutContextProps {
  stickyOffsetBottom: number;
  stickyOffsetTop: number;
  mobileBarHeight?: number;
  setHasStickyBackground?: (hasBackground: boolean) => void;
}

export const defaultValue: AppLayoutContextProps = {
  stickyOffsetTop: 0,
  stickyOffsetBottom: 0,
  mobileBarHeight: 0,
};

export const AppLayoutContext = createContext(defaultValue);

export function useAppLayoutContext() {
  return useContext(AppLayoutContext);
}
