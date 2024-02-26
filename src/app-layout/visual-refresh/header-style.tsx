// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext } from 'react';
import { HeroHeaderProps } from './context';

// Context for headerBackground
export const CustomHeaderStyle = React.createContext(() => {});

export function useHeaderStyle() {
  return useContext(CustomHeaderStyle);
}

interface HeroHeader {
  handleHeroHeaderProps: (headerProps: HeroHeaderProps) => void;
}
// Context for heroHeader
export const HeroHeader = React.createContext<HeroHeader>({
  handleHeroHeaderProps: () => {},
});

export function useHeroHeader() {
  return useContext(HeroHeader);
}
