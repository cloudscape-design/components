// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { createContext, useContext } from 'react';

interface ContainerHeaderContextProps {
  isInContainer: boolean;
}

const ContainerHeaderContext = createContext<ContainerHeaderContextProps>({ isInContainer: false });
export const ContainerHeaderContextProvider = ({ children }: { children?: React.ReactNode }) => {
  return <ContainerHeaderContext.Provider value={{ isInContainer: true }}>{children}</ContainerHeaderContext.Provider>;
};
export const useContainerHeader = () => {
  const { isInContainer } = useContext(ContainerHeaderContext);
  return isInContainer;
};
