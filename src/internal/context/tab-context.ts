// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { createContext, useContext } from 'react';
export interface TabContextProps {
  isInFirstTab: boolean | null;
}
export const TabContext = createContext<TabContextProps>({
  isInFirstTab: null,
});
export const useTabContext = () => {
  return useContext(TabContext);
};
