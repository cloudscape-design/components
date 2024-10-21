// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { FunnelBase } from './funnel-base';
import { dispatchFunnelEvent } from './funnel-logger';
import { FunnelSubstep } from './funnel-substep';
import { ErrorDetails, FunnelStepProps } from './types';

export class FunnelStep extends FunnelBase {
  public index: number;
  public name: string;
  public substeps: Set<FunnelSubstep> = new Set();
  public currentSubstep: FunnelSubstep | undefined;
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

  setName(name: string): void {
    this.name = name;
    this.notifyObservers();
  }

  private updateSubstepIndices(): void {
    Array.from(this.substeps).forEach((substep, index) => {
      substep.setIndex(index);
    });

    if (this.getStatus() !== 'initial' && this.getStatus() !== 'completed') {
      dispatchFunnelEvent({
        header: 'Funnel step configuration changed',
        details: JSON.stringify([...this.substeps].map(substep => substep.name)),
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
      details: this.name,
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
      details: this.name,
    });
  }

  async error(details: ErrorDetails): Promise<void> {
    if (details.errorText) {
      await super.error(details);
      dispatchFunnelEvent({
        header: 'Step error',
        details: [this.name].join(' / '),
        status: 'error',
      });
    } else if (this.getStatus() === 'error') {
      this.setStatus(this.getPreviousStatus());
      dispatchFunnelEvent({
        header: 'Step error cleared',
        details: [this.name].join(' / '),
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
