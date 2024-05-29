// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { DependencyList, RefObject, useEffect, useRef } from 'react';
import { ButtonProps } from '../../button/interfaces';

export type SplitPanelLastInteraction = { type: 'open' } | { type: 'close' } | { type: 'position' };

export interface SplitPanelFocusControlRefs {
  toggle: RefObject<ButtonProps.Ref>;
  slider: RefObject<HTMLDivElement>;
  preferences: RefObject<ButtonProps.Ref>;
}
export interface SplitPanelFocusControlState {
  refs: SplitPanelFocusControlRefs;
  setLastInteraction: (interaction: SplitPanelLastInteraction) => void;
}

export function useSplitPanelFocusControl(dependencies: DependencyList): SplitPanelFocusControlState {
  const refs = {
    toggle: useRef<ButtonProps.Ref>(null),
    slider: useRef<HTMLDivElement>(null),
    preferences: useRef<ButtonProps.Ref>(null),
  };
  const lastInteraction = useRef<SplitPanelLastInteraction | null>(null);

  useEffect(() => {
    switch (lastInteraction.current?.type) {
      case 'open':
        refs.slider.current?.focus();
        break;
      case 'close':
        refs.toggle.current?.focus();
        break;
      case 'position':
        refs.preferences.current?.focus();
        break;
    }
    lastInteraction.current = null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return {
    refs,
    setLastInteraction: (interaction: SplitPanelLastInteraction) => (lastInteraction.current = interaction),
  };
}
