// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { RefObject, useEffect, useRef, useState } from 'react';
import { ButtonProps } from '../../button/interfaces';

export type SplitPanelLastInteraction = { type: 'open' } | { type: 'close' } | { type: 'position' };

export interface SplitPanelFocusControlRefs {
  toggle: RefObject<ButtonProps.Ref>;
  slider: RefObject<HTMLDivElement>;
  preferences: RefObject<ButtonProps.Ref>;
}
interface SplitPanelFocusControlState {
  refs: SplitPanelFocusControlRefs;
  setLastInteraction: (interaction: SplitPanelLastInteraction) => void;
}

export function useSplitPanelFocusControl(): SplitPanelFocusControlState {
  const refs = {
    toggle: useRef<ButtonProps.Ref>(null),
    slider: useRef<HTMLDivElement>(null),
    preferences: useRef<ButtonProps.Ref>(null),
  };
  const [lastInteraction, setLastInteraction] = useState<SplitPanelLastInteraction | undefined>();

  useEffect(() => {
    switch (lastInteraction?.type) {
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
    setLastInteraction(undefined);
    // We explictly only want this effect to run when `lastInteraction` changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastInteraction]);

  return {
    refs,
    setLastInteraction,
  };
}
