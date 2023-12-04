// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { getFocusableElement } from './utils';
import { FocusableChangeHandler, FocusableDefinition, FocusableOptions } from './interfaces';

export class GridNavigationFocusStore {
  private focusables = new Set<FocusableDefinition>();
  private focusableSuppressed = new Set<FocusableDefinition>();
  private focusTargetHandlers = new Map<FocusableDefinition, FocusableChangeHandler>();

  public registerFocusable = (
    focusable: FocusableDefinition,
    changeHandler: FocusableChangeHandler,
    { suppressNavigation = false }: FocusableOptions = {}
  ) => {
    this.focusables.add(focusable);
    this.focusTargetHandlers.set(focusable, changeHandler);
    if (suppressNavigation) {
      this.focusableSuppressed.add(focusable);
    }
    return () => this.unregisterFocusable(focusable);
  };

  public unregisterFocusable = (focusable: FocusableDefinition) => {
    this.focusables.delete(focusable);
    this.focusableSuppressed.delete(focusable);
    this.focusTargetHandlers.delete(focusable);
  };

  public getNavigableElements = (): Set<HTMLElement> => {
    const registeredElements = new Set<HTMLElement>();
    for (const focusable of this.focusables) {
      const element = getFocusableElement(focusable);
      if (element) {
        registeredElements.add(element);
      }
    }
    return registeredElements;
  };

  public setFocusTarget(focusTarget: HTMLElement) {
    const focusable = [...this.focusables].find(f => getFocusableElement(f) === focusTarget);
    if (focusable) {
      this.focusTargetHandlers.forEach(handler => handler(focusTarget));
    }
  }

  public isSuppressed(focusTarget: HTMLElement) {
    const focusable = [...this.focusables].find(f => getFocusableElement(f) === focusTarget);
    return focusable && this.focusableSuppressed.has(focusable);
  }
}
