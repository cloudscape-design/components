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
  getHeader: () => HTMLElement | null;
  disableContentPaddings?: boolean;
  contentWidthStyles?: React.CSSProperties;
  contentWrapperPaddings?: {
    closedNav: boolean;
    closedTools: boolean;
  };
  isCopy?: boolean;
  isOpen?: boolean;
  isMobile: boolean;
  isForcedPosition: boolean;
  // The lastInteraction property indicates last meaningful state transition used to trigger split-panel effects.
  // We can't observe properties in a regular way because split-panel is being mounted in several places at once.
  lastInteraction?: SplitPanelLastInteraction;
  splitPanelRef?: React.Ref<any>;
  splitPanelHeaderRef?: React.Ref<any>;
  onResize: (detail: { size: number }) => void;
  onToggle: () => void;
  onPreferencesChange: (detail: { position: 'side' | 'bottom' }) => void;
  reportSize: (pixels: number) => void;
  openButtonAriaLabel?: string;
  setOpenButtonAriaLabel?: (value: string) => void;
}

export const SplitPanelContext = createContext<SplitPanelContextProps>({
  topOffset: 0,
  bottomOffset: 0,
  leftOffset: 0,
  rightOffset: 0,
  position: 'bottom',
  size: 0,
  getMaxWidth: () => 0,
  getMaxHeight: () => 0,
  getHeader: () => null,
  isCopy: false,
  isOpen: true,
  isMobile: false,
  isForcedPosition: false,
  lastInteraction: undefined,
  splitPanelRef: undefined,
  splitPanelHeaderRef: undefined,
  onResize: () => {},
  onToggle: () => {},
  onPreferencesChange: () => {},
  reportSize: () => {},
});

export function useSplitPanelContext() {
  return useContext(SplitPanelContext);
}
