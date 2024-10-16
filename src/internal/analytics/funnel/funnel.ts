// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { FunnelBase } from './funnel-base';
import { dispatchFunnelEvent } from './funnel-logger';
import { FunnelStep } from './funnel-step';
import { ErrorScope, FunnelResult, FunnelStatus, FunnelStepConfig, FunnelStepProps, Observer } from './types';

export class Funnel extends FunnelBase<FunnelStatus> {
  protected result: FunnelResult;
  protected steps: FunnelStep[] = [new FunnelStep({ index: 0 })];
  public currentStep: FunnelStep;
  public name?: string;

  constructor(name?: string) {
    super('initial');
    this.name = name;
    this.currentStep = this.steps[0];
  }

  setName(name: string) {
    this.name = name;
    this.notifyObservers();
  }

  get domAttributes() {
    return { 'data-funnel-id': this.id };
  }

  private reset() {
    this.status = ['initial'];
    this.result = undefined;
  }

  start() {
    if (this.getStatus() !== 'initial') {
      return;
    }

    this.reset();
    super.start(() => {
      dispatchFunnelEvent({ header: 'Funnel started', status: 'success', details: this.name });
    });

    this.currentStep?.start();
  }

  submit() {
    if (this.getStatus() === 'validating') {
      return;
    }

    this.currentStep?.complete();
    this.result = 'submitted';
    this.setStatus('validating');

    dispatchFunnelEvent({ header: 'Funnel validating', status: 'in-progress', details: this.name });
    this.notifyObservers();
  }

  error(errorText: string, scope: ErrorScope) {
    super.error(errorText, scope);
    this.notifyObservers();
  }

  cancel() {
    if (this.getStatus() === 'completed') {
      return;
    }

    this.result = 'cancelled';
    this.notifyObservers();
  }

  navigate(reason: string, requestedStepIndex: number) {
    dispatchFunnelEvent({
      header: 'Funnel step navigation',
      status: 'success',
      details: JSON.stringify({ reason, requestedStepIndex }),
    });
  }

  complete() {
    if (this.getStatus() === 'completed') {
      return;
    }

    this.currentStep?.complete();
    if (!this.result) {
      this.result = 'cancelled';
    }

    super.complete(() => {
      dispatchFunnelEvent({
        header: `Funnel ${this.result}`,
        status: this.result === 'cancelled' ? 'error' : 'success',
        details: this.name,
      });

      this.notifyObservers();
    });
  }

  addStep(config: FunnelStepConfig): FunnelStep {
    const index = this.steps.length;
    const step = new FunnelStep({ index, ...config });
    this.steps.push(step);

    if (!this.currentStep) {
      this.currentStep = step;
    }

    this.notifyObservers();
    return step;
  }

  addSteps(configs: FunnelStepConfig[]): FunnelStep[] {
    const steps = configs.map(config => {
      const index = this.steps.length;
      const step = new FunnelStep({ index, ...config });
      this.steps.push(step);
      return step;
    });

    this.notifyObservers();
    return steps;
  }

  setSteps(configs: FunnelStepProps[], currentStepIndex = 0): FunnelStep[] {
    this.steps = configs.map(config => {
      return new FunnelStep(config);
    });

    this.currentStep = this.steps[currentStepIndex];
    this.notifyObservers();
    return this.steps;
  }

  removeStep(step: FunnelStep) {
    this.steps = this.steps.filter(s => s !== step);
    this.notifyObservers();
  }

  setCurrentStep(index: number) {
    if (this.steps.length > 0 && this.currentStep?.index !== index) {
      this.currentStep?.complete();
      this.currentStep = this.steps[index];
      this.currentStep?.start();
      this.notifyObservers();
    }
  }
}

class FunnelConsoleLogger implements Observer {
  update(subject: any) {
    console.debug(`Funnel Logger - Subject ID: ${subject.id}, Status: ${subject.getStatus()}`);
  }
}

export class FunnelFactory {
  static create(name?: string): Funnel {
    const funnel = new Funnel(name);
    funnel.addObserver(new FunnelConsoleLogger());
    return funnel;
  }
}
