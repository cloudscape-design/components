// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, createContext } from 'react';

export type SplitPanelLastInteraction = { type: 'open' } | { type: 'close' } | { type: 'position' };

export interface SplitPanelContextProps {
  topOffset: number;
  bottomOffset: number;
  leftOffset: number;
  rightOffset: number;
  position: 'side' | 'bottom';
  size: number;
  getMaxWidth: () => number;
  getMaxHeight: () => number;
  disableContentPaddings?: boolean;
  contentWidthStyles?: React.CSSProperties;
  contentWrapperPaddings?: {
    closedNav: boolean;
    closedTools: boolean;
  };
  isOpen?: boolean;
  isMobile: boolean;
  isForcedPosition: boolean;
  // The lastInteraction property indicates last meaningful state transition used to trigger split-panel effects.
  // We can't observe properties in a regular way because split-panel is being mounted in several places at once.
  lastInteraction?: SplitPanelLastInteraction;
  onResize: (detail: { size: number }) => void;
  onToggle: () => void;
  onPreferencesChange: (detail: { position: 'side' | 'bottom' }) => void;
  reportSize: (pixels: number) => void;
  reportHeaderHeight: (pixels: number) => void;
  openButtonAriaLabel?: string;
  setOpenButtonAriaLabel?: (value: string) => void;
  headerShouldStick: () => boolean;
}

const SplitPanelContext = createContext<SplitPanelContextProps | null>(null);

export const SplitPanelContextProvider = SplitPanelContext.Provider;

export function useSplitPanelContext() {
  const ctx = useContext(SplitPanelContext);
  if (!ctx) {
    throw new Error('Split panel can only be used inside app layout');
  }
  return ctx;
}
