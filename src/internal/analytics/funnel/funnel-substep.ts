// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { Funnel } from './funnel';
import { FunnelBase } from './funnel-base';
import { dispatchFunnelEvent, FunnelLogEventDetail, Metadata } from './funnel-logger';
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

  private getDetails(metadata?: Metadata): FunnelLogEventDetail['details'] {
    return {
      fullContext: this.getFullContext(),
      context: this.name,
      metadata: {
        subStepName: this.name,
        subStepIndex: this.index,
        ...metadata,
      },
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

  getFullContext() {
    const combinedContext: string[] = [this.name || ''];

    let parentContext: Funnel | FunnelStep | null | undefined = this.context;
    while (parentContext) {
      combinedContext.push(parentContext.name || '');
      parentContext = parentContext.context;
    }

    return combinedContext.filter(Boolean).reverse();
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
        dispatchFunnelEvent({
          header: 'Funnel substep started',
          action: 'funnel-substep-started',
          status: 'success',
          details: this.getDetails(),
        });
      });
    });
  }

  complete() {
    if (this.getStatus() === 'initial' || this.getStatus() === 'completed') {
      return;
    }

    this.debounce(() => {
      super.complete(() => {
        dispatchFunnelEvent({
          header: 'Funnel substep completed',
          action: 'funnel-substep-completed',
          status: 'success',
          details: this.getDetails(),
        });
      });
    });
  }

  error(details: ErrorDetails) {
    if (details.errorText) {
      super.error(details, () => {
        dispatchFunnelEvent({
          header: 'Field error',
          action: 'funnel-substep-error',
          status: 'error',
          details: this.getDetails({
            fieldLabel: details.scope.label,
            fieldError: details.errorText,
          }),
        });
      });
    } else if (this.getStatus() === 'error') {
      this.setStatus(this.getPreviousStatus());
      dispatchFunnelEvent({
        header: 'Field error cleared',
        action: 'funnel-substep-error-cleared',
        status: 'info',
        details: this.getDetails({
          fieldLabel: details.scope.label,
        }),
      });
    }
  }

  logInteractation(scope: InteractionScope): void {
    dispatchFunnelEvent({
      header: 'Funnel Substep interaction',
      action: 'funnel-interaction',
      status: 'info',
      details: this.getDetails(scope.metadata),
    });
  }
}
