// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import {
  CallbackFunction,
  ErrorDetails,
  FunnelContext,
  FunnelStepProps,
  FunnelStepStatus,
  StepMetadata,
} from '../types';
import { funnelAnalytics } from '.';
import { Funnel } from './funnel';
import { FunnelBase } from './funnel-base';
import { FunnelSubstep } from './funnel-substep';

export class FunnelStep extends FunnelBase<FunnelStepStatus> {
  public index: number;
  public substeps: Set<FunnelSubstep> = new Set();
  public currentSubstep: FunnelSubstep | undefined;
  public context: Funnel | null = null;

  public optional: boolean;

  constructor({ index, name = '', optional = false, metadata, status = 'initial' }: FunnelStepProps) {
    super(status);
    this.index = index;
    this.name = name;
    this.optional = optional;
    this.metadata = metadata;
  }

  get domAttributes() {
    return {
      'data-funnel-step-id': this.id,
      'data-funnel-step-index': this.index,
    };
  }

  getMetadata(): StepMetadata {
    return {
      index: this.index,
      name: this.name || '',
      isOptional: this.optional,
      totalSubsteps: this.substeps.size,
      instanceIdentifier: this.metadata?.instanceIdentifier,
    };
  }

  getContext(): FunnelContext {
    return {
      path: this.getPath(),
      funnel: this.context?.getMetadata(),
      step: this.getMetadata(),
    };
  }

  private updateSubstepIndices(): void {
    Array.from(this.substeps).forEach((substep, index) => {
      substep.setIndex(index);
    });

    if (this.getStatus() !== 'initial' && this.getStatus() !== 'validating' && this.getStatus() !== 'completed') {
      funnelAnalytics.track('funnel:step:configuration-changed', this.getMetadata(), this.getContext(), {
        configuration: {
          substeps: [...this.substeps].map(substep => ({
            name: substep.name || '',
            index: substep.index,
          })),
        },
      });

      this.notifyObservers();
    }
  }

  setContext(funnel: Funnel | null) {
    this.context = funnel;
    this.notifyObservers();
  }

  getPath() {
    const combinedContext: string[] = [this.name || ''];

    let parentContext: Funnel | null | undefined = this.context;
    while (parentContext) {
      combinedContext.push(parentContext.name || '');
      parentContext = parentContext.context;
    }

    return combinedContext.filter(Boolean).reverse();
  }

  start() {
    super.start(() => {
      funnelAnalytics.track('funnel:step:start', this.getMetadata(), this.getContext());
    });
  }

  complete(callback?: CallbackFunction) {
    super.complete(() => {
      funnelAnalytics.track('funnel:step:complete', this.getMetadata(), this.getContext());

      callback?.();
    });
  }

  validate(value: boolean) {
    if (value && this.getStatus() === 'validating') {
      return;
    }

    if (value) {
      this.setStatus('validating', () => {
        funnelAnalytics.track('funnel:step:validating', this.getMetadata(), this.getContext());
      });
    }
  }

  error(details: ErrorDetails) {
    if (details.errorText) {
      super.error(details, () => {
        funnelAnalytics.track('funnel:step:error', this.getMetadata(), this.getContext(), {
          error: {
            message: details.errorText || '',
            source: details.scope.source,
            label: details.scope.label,
          },
        });
      });
    } else if (this.getStatus() === 'error') {
      this.setStatus(this.getPreviousStatus());
      funnelAnalytics.track('funnel:step:error-cleared', this.getMetadata(), this.getContext());
    }
  }

  registerSubstep(substep: FunnelSubstep): void {
    this.substeps.add(substep);
    this.updateSubstepIndices();
    substep.setContext(this);
  }

  unregisterSubstep(substep: FunnelSubstep): void {
    substep.complete();
    substep.setContext(null);
    this.substeps.delete(substep);
    this.updateSubstepIndices();
    this.notifyObservers();
  }

  async setCurrentSubstep(substep: FunnelSubstep | undefined): Promise<void> {
    await this.currentSubstep?.complete();
    this.currentSubstep = substep;
    await this.currentSubstep?.start();

    this.notifyObservers();
    return Promise.resolve();
  }
}
