// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { Funnel } from './funnel';
import { FunnelBase } from './funnel-base';
import { dispatchFunnelEvent } from './funnel-logger';
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

  start() {
    super.start(() => {
      dispatchFunnelEvent({
        header: `Funnel step started`,
        status: 'success',
        details: {
          context: this.name,
        },
      });
    });
  }

  complete(callback?: CallbackFunction) {
    super.complete(() => {
      dispatchFunnelEvent({
        header: `Funnel step completed`,
        status: 'success',
        details: {
          context: this.name,
        },
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
          status: 'in-progress',
          details: { context: this.name },
        });
      });
    }
  }

  error(details: ErrorDetails) {
    if (details.errorText) {
      super.error(details, () => {
        dispatchFunnelEvent({
          header: 'Step error',
          details: {
            context: this.name,
            metadata: {
              errorText: details.errorText,
            },
          },
          status: 'error',
        });
      });
    } else if (this.getStatus() === 'error') {
      this.setStatus(this.getPreviousStatus());
      dispatchFunnelEvent({
        header: 'Step error cleared',
        details: {
          context: this.name,
        },
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
