// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import debounce from '../debounce';

// this code should not depend on React typings, because it is portable between major versions
interface RefShim<T> {
  current: T | null;
}

export interface ActionContext {
  type: string;
  headerRef: RefShim<HTMLElement>;
  contentRef: RefShim<HTMLElement>;
}

export interface ActionConfig {
  id: string;
  mountContent: (container: HTMLElement, context: ActionContext) => void;
  unmountContent: (container: HTMLElement) => void;
}

export type ActionRegistrationListener = (action: ActionConfig | null) => void;

export class ActionButtonsController {
  private listeners: Array<ActionRegistrationListener> = [];
  private action: ActionConfig | null = null;

  private scheduleUpdate = debounce(() => {
    this.listeners.forEach(listener => listener(this.action));
  }, 0);

  registerAction = (action: ActionConfig) => {
    this.action = action;
    this.scheduleUpdate();
  };

  onActionRegistered = (listener: ActionRegistrationListener) => {
    this.listeners.push(listener);
    this.scheduleUpdate();
    return () => {
      this.listeners = this.listeners.filter(item => item !== listener);
    };
  };
}
