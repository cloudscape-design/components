// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { Funnel } from './funnel';
import { FunnelBase } from './funnel-base';
import { dispatchFunnelEvent, FunnelLogEventDetail, Metadata } from './funnel-logger';
import { FunnelSubstep } from './funnel-substep';
import { CallbackFunction, ErrorDetails, FunnelStepProps, FunnelStepStatus } from './types';

export class FunnelStep extends FunnelBase<FunnelStepStatus> {
  public index: number;
  public substeps: Set<FunnelSubstep> = new Set();
  public currentSubstep: FunnelSubstep | undefined;
  public context: Funnel | null = null;

  protected optional: boolean;

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

  private updateSubstepIndices(): void {
    Array.from(this.substeps).forEach((substep, index) => {
      substep.setIndex(index);
    });

    if (this.getStatus() !== 'initial' && this.getStatus() !== 'validating' && this.getStatus() !== 'completed') {
      dispatchFunnelEvent({
        header: 'Funnel step configuration changed',
        action: 'funnel-step-configuration-changed',
        details: {
          context: this.name,
          metadata: {
            substeps: [...this.substeps].map(substep => substep.name).join(','),
          },
        },
        status: 'info',
      });

      this.notifyObservers();
    }
  }

  private getDetails(metadata?: Metadata): FunnelLogEventDetail['details'] {
    return {
      fullContext: this.getFullContext(),
      context: this.name,
      metadata: {
        name: this.name,
        stepIndex: this.index,
        optional: this.optional,
        ...metadata,
      },
    };
  }

  setContext(funnel: Funnel | null) {
    this.context = funnel;
    this.notifyObservers();
  }

  getFullContext() {
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
      dispatchFunnelEvent({
        header: `Funnel step started`,
        action: 'funnel-step-started',
        status: 'success',
        details: this.getDetails(),
      });
    });
  }

  complete(callback?: CallbackFunction) {
    super.complete(() => {
      dispatchFunnelEvent({
        header: `Funnel step completed`,
        action: 'funnel-step-completed',
        status: 'success',
        details: this.getDetails(),
      });

      callback?.();
    });
  }

  validate(value: boolean) {
    if (value && this.getStatus() === 'validating') {
      return;
    }

    if (value) {
      this.setStatus('validating', () => {
        dispatchFunnelEvent({
          header: 'Funnel step validating',
          action: 'funnel-step-validating',
          status: 'in-progress',
          details: this.getDetails(),
        });
      });
    }
  }

  error(details: ErrorDetails) {
    if (details.errorText) {
      super.error(details, () => {
        dispatchFunnelEvent({
          header: 'Step error',
          action: 'funnel-step-error',
          details: this.getDetails({
            errorText: details.errorText,
          }),
          status: 'error',
        });
      });
    } else if (this.getStatus() === 'error') {
      this.setStatus(this.getPreviousStatus());
      dispatchFunnelEvent({
        header: 'Step error cleared',
        action: 'funnel-step-error-cleared',
        details: this.getDetails(),
        status: 'info',
      });
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
