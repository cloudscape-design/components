// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { Funnel } from './funnel';
import { FunnelBase } from './funnel-base';
import { dispatchFunnelEvent } from './funnel-logger';
import { FunnelStep } from './funnel-step';
import { ErrorDetails, FunnelBaseStatus, InteractionScope } from './types';

const DEBOUNCE_TIMEOUT_IN_MS = 10;

export class FunnelSubstep extends FunnelBase {
  public index = -1;
  public context: FunnelStep | null = null;

  private stateTimeout: ReturnType<typeof setTimeout> | null = null;
  private latestAction: 'start' | 'complete' | null = null;

  constructor(name = '') {
    super('initial');
    this.name = name;
  }

  get domAttributes() {
    return {
      id: this.id,
      'data-funnel-substep-id': this.id,
      'data-funnel-substep-index': `${this.index}`,
    };
  }

  setIndex(index: number): void {
    this.index = index;
    this.notifyObservers();
  }

  setContext(funnelStep: FunnelStep | null): void {
    this.context = funnelStep;
    this.notifyObservers();
  }

  private debounceState(action: 'start' | 'complete'): Promise<void> {
    return new Promise(resolve => {
      this.latestAction = action;

      if (this.stateTimeout) {
        clearTimeout(this.stateTimeout);
      }

      this.stateTimeout = setTimeout(async () => {
        if (this.latestAction === 'start') {
          await super.start();
        } else if (this.latestAction === 'complete') {
          await super.complete();
        }

        this.stateTimeout = null;
        this.latestAction = null;
        resolve();
      }, DEBOUNCE_TIMEOUT_IN_MS);
    });
  }

  async start(): Promise<void> {
    await this.debounceState('start');
    dispatchFunnelEvent({
      header: 'Funnel substep started',
      status: 'success',
      details: {
        context: this.getFullContext().join('/'),
      },
    });
  }

  async complete(): Promise<void> {
    const validStates: FunnelBaseStatus[] = ['started', 'error'];
    if (!validStates.includes(this.getStatus())) {
      return; // No-op if not in valid state
    }

    await this.debounceState('complete');
    dispatchFunnelEvent({
      header: 'Funnel substep completed',
      status: 'success',
      details: {
        context: this.getFullContext().join('/'),
      },
    });
  }

  async error(details: ErrorDetails): Promise<void> {
    if (details.errorText) {
      await super.error(details);
      dispatchFunnelEvent({
        header: 'Field error',
        status: 'error',
        details: {
          context: [details.scope.label, ...this.getFullContext()].join('/'),
          metadata: {
            errorText: details.errorText,
          },
        },
      });
    } else if (this.getStatus() === 'error') {
      this.setStatus(this.getPreviousStatus());
      dispatchFunnelEvent({
        header: 'Field error cleared',
        status: 'info',
        details: {
          context: [details.scope.label, ...this.getFullContext()].join('/'),
        },
      });
    }
  }

  getFullContext() {
    const combinedContext = [this.name];

    let parentContext: Funnel | FunnelStep | null | undefined = this.context;
    while (parentContext) {
      combinedContext.push(parentContext.name);
      parentContext = parentContext.context;
    }

    return combinedContext.filter(Boolean);
  }

  logInteractation(scope: InteractionScope): void {
    dispatchFunnelEvent({
      header: 'Funnel Substep interaction',
      status: 'info',
      details: {
        context: this.getFullContext().join('/'),
        metadata: scope.metadata,
      },
    });
  }
}
