// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { Funnel } from './funnel';
import { FunnelBase } from './funnel-base';
import { dispatchFunnelEvent } from './funnel-logger';
import { FunnelStep } from './funnel-step';
import { ErrorDetails, InteractionScope } from './types';

const DEBOUNCE_TIMEOUT_IN_MS = 20;

export class FunnelSubstep extends FunnelBase {
  protected index = -1;
  public context: FunnelStep | null = null;

  private debounceTimeout: ReturnType<typeof setTimeout> | null = null;

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

  setIndex(index: number) {
    this.index = index;
    this.notifyObservers();
  }

  setName(name: string) {
    this.name = name;
    this.notifyObservers();
  }

  setContext(funnelStep: FunnelStep | null) {
    this.context = funnelStep;
    this.notifyObservers();
  }

  private debounce(callback: () => void) {
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }

    this.debounceTimeout = setTimeout(callback, DEBOUNCE_TIMEOUT_IN_MS);
  }

  start() {
    this.debounce(() => {
      super.start(() => {
        dispatchFunnelEvent({ header: 'Funnel substep started', status: 'success', details: { message: this.name } });
      });
    });
  }

  complete() {
    if (this.getStatus() === 'initial' || this.getStatus() === 'completed') {
      return;
    }

    this.debounce(() => {
      super.complete(() => {
        dispatchFunnelEvent({ header: 'Funnel substep completed', status: 'success', details: { message: this.name } });
      });
    });
  }

  error(details: ErrorDetails) {
    if (details.errorText) {
      super.error(details, () => {
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
