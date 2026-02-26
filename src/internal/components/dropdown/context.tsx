// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useMemo } from 'react';

type Position = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

const DropdownContext = React.createContext<{ position: Position }>({
  position: 'bottom-right',
});

export interface DropdownContextProviderProps {
  position?: Position;
  children?: React.ReactNode;
}

export function DropdownContextProvider({ children, position = 'bottom-right' }: DropdownContextProviderProps) {
  const value = useMemo(() => ({ position }), [position]);
  return <DropdownContext.Provider value={value}>{children}</DropdownContext.Provider>;
}

export function useDropdownContext() {
  return useContext(DropdownContext);
}
