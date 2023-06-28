// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, createContext } from 'react';
import { SplitPanelFocusControlRefs } from '../../app-layout/utils/use-split-panel-focus-control';

export interface SplitPanelSideToggleProps {
  displayed: boolean;
  ariaLabel: string | undefined;
}

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
  onResize: (detail: { size: number }) => void;
  onToggle: () => void;
  onPreferencesChange: (detail: { position: 'side' | 'bottom' }) => void;
  reportSize: (pixels: number) => void;
  reportHeaderHeight: (pixels: number) => void;
  setSplitPanelToggle: (config: SplitPanelSideToggleProps) => void;
  refs: SplitPanelFocusControlRefs;
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
