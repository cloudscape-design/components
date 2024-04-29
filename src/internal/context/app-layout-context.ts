// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useContext, createContext } from 'react';

export interface AppLayoutContextProps {
  setHasStickyBackground?: (hasBackground: boolean) => void;
}

export const defaultValue: AppLayoutContextProps = {};

export const AppLayoutContext = createContext(defaultValue);

export function useAppLayoutContext() {
  return useContext(AppLayoutContext);
}
