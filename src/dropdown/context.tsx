// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext } from 'react';

type Position = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

const DropdownContext = React.createContext<{ position: Position }>({
  position: 'bottom-right',
});

export interface DropdownContextProviderProps {
  position?: Position;
  children?: React.ReactNode;
}

export function DropdownContextProvider({ children, position = 'bottom-right' }: DropdownContextProviderProps) {
  return <DropdownContext.Provider value={{ position }}>{children}</DropdownContext.Provider>;
}

export function useDropdownContext() {
  return useContext(DropdownContext);
}
