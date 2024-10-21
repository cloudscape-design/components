// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { FunnelBase } from './funnel-base';
import { dispatchFunnelEvent } from './funnel-logger';
import { FunnelStep } from './funnel-step';
import { ErrorDetails, FunnelBaseStatus } from './types';

const DEBOUNCE_TIMEOUT_IN_MS = 10;

export class FunnelSubstep extends FunnelBase {
  protected index = -1;
  public context: FunnelStep | null = null;
  public name: string;

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

  setName(name: string): void {
    this.name = name;
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
    dispatchFunnelEvent({ header: 'Funnel substep started', status: 'success', details: this.name });
  }

  async complete(): Promise<void> {
    const validStates: FunnelBaseStatus[] = ['started', 'error'];
    if (!validStates.includes(this.getStatus())) {
      return; // No-op if not in valid state
    }

    await this.debounceState('complete');
    dispatchFunnelEvent({ header: 'Funnel substep completed', status: 'success', details: this.name });
  }

  async error(details: ErrorDetails): Promise<void> {
    if (details.errorText) {
      await super.error(details);
      dispatchFunnelEvent({
        header: 'Field error',
        status: 'error',
        details: [this.name, details.scope.label].join(' / '),
      });
    } else if (this.getStatus() === 'error') {
      this.setStatus(this.getPreviousStatus());
      dispatchFunnelEvent({
        header: 'Field error cleared',
        status: 'info',
        details: [this.name, details.scope.label].join(' / '),
      });
    }
  }
}
