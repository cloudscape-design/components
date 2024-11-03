// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { funnelAnalytics } from '../core';
import { ErrorDetails, FunnelContext, InteractionScope, SubstepMetadata } from '../types';
import { Funnel } from './funnel';
import { FunnelBase } from './funnel-base';
import { FunnelStep } from './funnel-step';

const DEBOUNCE_TIMEOUT_IN_MS = 20;

export class FunnelSubstep extends FunnelBase {
  public index = -1;
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

  getContext(): FunnelContext {
    return {
      path: this.getPath(),
      funnel: this.context?.context?.getMetadata(),
      step: this.context?.getMetadata(),
      substep: this.getMetadata(),
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

  getPath() {
    const combinedContext: string[] = [this.name || ''];

    let parentContext: Funnel | FunnelStep | null | undefined = this.context;
    while (parentContext) {
      combinedContext.push(parentContext.name || '');
      parentContext = parentContext.context;
    }

    return combinedContext.filter(Boolean).reverse();
  }

  getMetadata(): SubstepMetadata {
    return {
      index: this.index,
      name: this.name || '',
    };
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
        funnelAnalytics.track('funnel:substep:start', this.getMetadata(), this.getContext());
      });
    });
  }

  complete() {
    if (this.getStatus() === 'initial' || this.getStatus() === 'completed') {
      return;
    }

    this.debounce(() => {
      super.complete(() => {
        funnelAnalytics.track('funnel:substep:complete', this.getMetadata(), this.getContext());
      });
    });
  }

  error(details: ErrorDetails) {
    if (details.errorText) {
      super.error(details, () => {
        funnelAnalytics.track('funnel:substep:error', this.getMetadata(), this.getContext(), {
          error: {
            message: details.errorText || '',
            source: details.scope.source,
            label: details.scope.label,
          },
        });
      });
    } else if (this.getStatus() === 'error') {
      this.setStatus(this.getPreviousStatus());
      funnelAnalytics.track('funnel:substep:error-cleared', this.getMetadata(), this.getContext());
    }
  }

  logInteractation(scope: InteractionScope): void {
    funnelAnalytics.track('funnel:interaction', this.getMetadata(), this.getContext(), {
      interaction: {
        type: 'info',
        target: scope.componentName,
        metadata: scope.metadata,
      },
    });
  }
}
