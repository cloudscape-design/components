// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { FunnelBase } from './funnel-base';
import { dispatchFunnelEvent } from './funnel-logger';
import { FunnelStep } from './funnel-step';
import { ErrorDetails, FunnelResult, FunnelStatus, FunnelStepConfig, FunnelStepProps, Observer } from './types';

interface FunnelProps {
  name?: string;
  context?: Funnel | undefined;
}

export class Funnel extends FunnelBase<FunnelStatus> {
  protected result: FunnelResult;
  protected steps: FunnelStep[] = [new FunnelStep({ index: 0 })];
  public currentStep: FunnelStep;
  public name?: string;
  public context?: Funnel | undefined;

  constructor(props?: FunnelProps) {
    super('initial');
    this.name = props?.name;
    this.context = props?.context;
    this.currentStep = this.steps[0];
  }

  setName(name: string) {
    this.name = name;
    this.notifyObservers();
  }

  get domAttributes() {
    return { 'data-funnel-id': this.id, id: this.id };
  }

  private reset() {
    this.status = ['initial'];
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

    console.log(this);
  }

  submit() {
    if (this.getStatus() === 'submitted') {
      return;
    }

    this.currentStep?.complete();
    this.result = 'submitted';
    this.setStatus('submitted');

    dispatchFunnelEvent({ header: 'Funnel submitted', status: 'success', details: this.name });
    this.notifyObservers();
  }

  validate(value: boolean) {
    if ((value && this.getStatus() === 'validating') || (value === false && this.getStatus() === 'validated')) {
      return;
    }

    if (value) {
      this.setStatus('validating');
      dispatchFunnelEvent({ header: 'Funnel validating', status: 'in-progress', details: this.name });
      this.notifyObservers();
    } else if (this.getStatus() === 'validating') {
      this.setStatus('validated');
      dispatchFunnelEvent({ header: 'Funnel validated', status: 'success', details: this.name });
      this.notifyObservers();
    }
  }

  error(details: ErrorDetails) {
    super.error(details);
    this.notifyObservers();
  }

  cancel() {
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
    this.currentStep?.complete();
    super.complete(() => {
      if (!this.result) {
        this.cancel();
      }

      dispatchFunnelEvent({
        header: `Funnel completed with result ${this.result}`,
        status: this.result === 'cancelled' ? 'error' : 'success',
        details: this.name,
      });
    });

    this.notifyObservers();
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

  setSteps(configs: FunnelStepProps[], intitialStepIndex = 0): FunnelStep[] {
    this.steps = configs.map(config => new FunnelStep(config));

    this.currentStep = this.steps[intitialStepIndex];
    this.notifyObservers();
    return this.steps;
  }

  removeStep(step: FunnelStep) {
    this.steps = this.steps.filter(s => s !== step);
    this.notifyObservers();
  }

  updateSteps(configs: FunnelStepProps[]): FunnelStep[] {
    this.steps = configs.map((config, index) => new FunnelStep({ ...config, status: this.steps[index].getStatus() }));

    dispatchFunnelEvent({
      header: 'Funnel configuration changed',
      details: JSON.stringify([...this.steps].map(step => step.name)),
      status: 'info',
    });
    this.notifyObservers();
    return this.steps;
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
  static create(config?: FunnelProps): Funnel {
    const funnel = new Funnel(config);
    funnel.addObserver(new FunnelConsoleLogger());
    return funnel;
  }
}
