// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext } from 'react';
import { HeroHeaderProps, HeaderTypeProps, HeaderDarkVisualContextProps } from './context';

////// Context for heroHeader //////
interface HeroHeader {
  handleHeroHeaderProps: (headerProps: HeroHeaderProps) => void;
}

export const HeroHeader = React.createContext<HeroHeader>({
  handleHeroHeaderProps: () => {},
});

export function useHeroHeader() {
  return useContext(HeroHeader);
}

////// Context for headerBackground //////
interface HeaderType {
  handleHeaderTypeProps: (headerTypeProps: HeaderTypeProps) => void;
}

export const HeaderType = React.createContext<HeaderType>({
  handleHeaderTypeProps: () => {},
});

export function useHeaderStyle() {
  return useContext(HeaderType);
}

////// Context for headerDarkVisualContext //////
interface HeaderDarkVisualContext {
  handleHeaderDarkVisualContextProps: (headerDarkVisualContextProps: HeaderDarkVisualContextProps) => void;
}

export const HeaderDarkVisualContext = React.createContext<HeaderDarkVisualContext>({
  handleHeaderDarkVisualContextProps: () => {},
});

export function useHeaderDarkVisualContext() {
  return useContext(HeaderDarkVisualContext);
}
