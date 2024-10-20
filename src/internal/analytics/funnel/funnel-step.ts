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

  setName(name: string) {
    this.name = name;
    this.notifyObservers();
  }

  private updateSubstepIndices() {
    Array.from(this.substeps).forEach((substep, index) => {
      substep.setIndex(index);
    });

    if (this.getStatus() !== 'initial') {
      dispatchFunnelEvent({
        header: 'Funnel step configuration changed',
        details: JSON.stringify([...this.substeps].map(substep => substep.name)),
        status: 'info',
      });

      this.notifyObservers();
    }
  }

  start(): void {
    super.start(() => {
      dispatchFunnelEvent({
        header: `Funnel step started`,
        status: 'success',
        details: this.name,
      });
    });
  }

  complete(): void {
    super.complete(() => {
      dispatchFunnelEvent({
        header: `Funnel step completed`,
        status: 'success',
        details: this.name,
      });
    });
  }

  error(details: ErrorDetails): void {
    if (details.errorText) {
      super.error(details, () => {
        dispatchFunnelEvent({
          header: 'Step error',
          details: [this.name].join(' / '),
          status: 'error',
        });
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

  registerSubstep(substep: FunnelSubstep) {
    this.substeps.add(substep);
    this.updateSubstepIndices();
  }

  unregisterSubstep(substep: FunnelSubstep) {
    this.substeps.delete(substep);
    this.updateSubstepIndices();
    this.notifyObservers();
  }

  setCurrentSubstep(substep: FunnelSubstep | undefined) {
    if (this.currentSubstep !== substep) {
      this.currentSubstep?.complete();
      this.currentSubstep = substep;
      this.currentSubstep?.start();
      this.notifyObservers();
    }
  }
}
