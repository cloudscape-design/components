// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext } from 'react';
import { HeroHeaderProps, CustomHeaderStyleProps, HeaderDarkVisualContextProps } from './context';

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
interface CustomHeaderStyle {
  handleCustomHeaderStyleProps: (customHeaderStyleProps: CustomHeaderStyleProps) => void;
}

export const CustomHeaderStyle = React.createContext<CustomHeaderStyle>({
  handleCustomHeaderStyleProps: () => {},
});

export function useHeaderStyle() {
  return useContext(CustomHeaderStyle);
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
