// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { Funnel } from './funnel';
import { FunnelBase } from './funnel-base';
import { dispatchFunnelEvent } from './funnel-logger';
import { FunnelSubstep } from './funnel-substep';
import { ErrorDetails, FunnelStepProps } from './types';

export class FunnelStep extends FunnelBase {
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

    if (this.getStatus() !== 'initial' && this.getStatus() !== 'completed') {
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

  async start(): Promise<void> {
    if (this.getStatus() === 'started') {
      return;
    }

    await super.start();
    dispatchFunnelEvent({
      header: `Funnel step started`,
      status: 'success',
      details: {
        context: this.name,
      },
    });
  }

  async complete(): Promise<void> {
    if (this.getStatus() === 'completed') {
      return;
    }

    await super.complete();
    dispatchFunnelEvent({
      header: `Funnel step completed`,
      status: 'success',
      details: {
        context: this.name,
      },
    });
  }

  async error(details: ErrorDetails): Promise<void> {
    if (details.errorText) {
      await super.error(details);
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
    this.substeps.delete(substep);
    this.updateSubstepIndices();
    this.notifyObservers();
  }

  async setCurrentSubstep(substep: FunnelSubstep | undefined): Promise<void> {
    if (this.currentSubstep !== substep) {
      if (this.currentSubstep) {
        await this.currentSubstep.complete();
      }
      this.currentSubstep = substep;
      if (this.currentSubstep) {
        await this.currentSubstep.start();
      }
      this.notifyObservers();
    }
  }
}
