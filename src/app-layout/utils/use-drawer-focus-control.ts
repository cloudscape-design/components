// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { DependencyList, RefObject, useEffect, useRef } from 'react';
import { ButtonProps } from '../../button/interfaces';

export type DrawerLastInteraction = { type: 'open' } | { type: 'close' };

export interface DrawerFocusControlRefs {
  toggle: RefObject<ButtonProps.Ref>;
  slider: RefObject<HTMLDivElement>;
}
interface DrawerFocusControlState {
  refs: DrawerFocusControlRefs;
  setLastInteraction: (interaction: DrawerLastInteraction) => void;
}

export function useDrawerFocusControl(dependencies: DependencyList): DrawerFocusControlState {
  const refs = {
    toggle: useRef<ButtonProps.Ref>(null),
    slider: useRef<HTMLDivElement>(null),
  };
  const lastInteraction = useRef<DrawerLastInteraction | null>(null);

  useEffect(() => {
    switch (lastInteraction.current?.type) {
      case 'open':
        refs.slider.current?.focus();
        break;
      case 'close':
        refs.toggle.current?.focus();
        break;
    }
    lastInteraction.current = null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return {
    refs,
    setLastInteraction: (interaction: DrawerLastInteraction) => (lastInteraction.current = interaction),
  };
}
