// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import debounce from '../../debounce';
import { sortByPriority } from '../helpers/utils';

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
  orderPriority?: number;
  mountContent: (container: HTMLElement, context: ActionContext) => void;
  unmountContent: (container: HTMLElement) => void;
}

export type ActionRegistrationListener = (action: Array<ActionConfig>) => void;

export interface ActionsApiPublic {
  registerAction(config: ActionConfig): void;
}

export interface ActionsApiInternal {
  clearRegisteredActions(): void;
  onActionRegistered(listener: ActionRegistrationListener): () => void;
}

export class ActionButtonsController {
  private listeners: Array<ActionRegistrationListener> = [];
  private actions: Array<ActionConfig> = [];

  private scheduleUpdate = debounce(() => {
    this.listeners.forEach(listener => listener(this.actions));
  }, 0);

  registerAction = (action: ActionConfig) => {
    this.actions.push(action);
    this.actions = sortByPriority(this.actions);
    this.scheduleUpdate();
  };

  clearRegisteredActions = () => {
    this.actions = [];
  };

  onActionRegistered = (listener: ActionRegistrationListener) => {
    this.listeners.push(listener);
    this.scheduleUpdate();
    return () => {
      this.listeners = this.listeners.filter(item => item !== listener);
    };
  };

  installPublic(api: Partial<ActionsApiPublic> = {}): ActionsApiPublic {
    api.registerAction ??= this.registerAction;
    return api as ActionsApiPublic;
  }

  installInternal(internalApi: Partial<ActionsApiInternal> = {}): ActionsApiInternal {
    internalApi.clearRegisteredActions ??= this.clearRegisteredActions;
    internalApi.onActionRegistered ??= this.onActionRegistered;
    return internalApi as ActionsApiInternal;
  }
}
