// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useMemo } from 'react';
import AsyncStore, { ReadonlyAsyncStore } from '../../area-chart/async-store';
import { FocusableDefinition } from './interfaces';

interface GridNavigationFocusState {
  focusableId: null | string;
  focusTarget: null | HTMLElement;
}

export interface GridNavigationFocus extends ReadonlyAsyncStore<GridNavigationFocusState> {
  registerFocusable(focusableId: string, focusable: FocusableDefinition): () => void;
  unregisterFocusable(focusable: FocusableDefinition): void;
  getFocusableElements(): HTMLElement[];
  setFocusTarget(focusTarget: HTMLElement): void;
}

export function useGridNavigationFocusStore(): GridNavigationFocus {
  return useMemo(() => new GridNavigationFocusStore(), []);
}

export class GridNavigationFocusStore extends AsyncStore<GridNavigationFocusState> {
  private focusables = new Set<FocusableDefinition>();
  private focusableToId = new Map<FocusableDefinition, string>();

  constructor() {
    super({ focusableId: null, focusTarget: null });
  }

  public registerFocusable = (focusableId: string, focusable: FocusableDefinition) => {
    this.focusables.add(focusable);
    this.focusableToId.set(focusable, focusableId);
    return () => this.unregisterFocusable(focusable);
  };

  public unregisterFocusable = (focusable: FocusableDefinition) => {
    this.focusables.delete(focusable);
    this.focusableToId.delete(focusable);
  };

  public getFocusableElements = (): HTMLElement[] => {
    const registeredElements = new Array<HTMLElement>();
    for (const focusable of this.focusables) {
      const element = getFocusableElement(focusable);
      if (element) {
        registeredElements.push(element);
      }
    }
    return [...registeredElements];
  };

  public setFocusTarget(focusTarget: HTMLElement) {
    const focusable = [...this.focusables].find(f => getFocusableElement(f) === focusTarget);
    const focusableId = focusable ? this.focusableToId.get(focusable) : null;
    if (focusable && focusableId) {
      this.set(() => ({ focusTarget, focusableId }));
    }
  }
}

function getFocusableElement(focusable: FocusableDefinition): null | HTMLElement {
  return typeof focusable === 'function' ? focusable() : focusable.current;
}
