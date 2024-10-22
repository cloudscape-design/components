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
  protected steps: FunnelStep[] = [];

  public currentStep: FunnelStep;
  public context?: Funnel | null = null;

  constructor(props?: FunnelProps) {
    super('initial');
    this.name = props?.name;
    this.context = props?.context;

    const funnelStep = new FunnelStep({ index: 0 });
    funnelStep.context = this;
    this.steps.push(funnelStep);

    this.currentStep = funnelStep;
  }

  get domAttributes() {
    return { 'data-funnel-id': this.id, id: this.id };
  }

  start() {
    if (this.getStatus() !== 'initial') {
      return;
    }

    super.start(() => {
      dispatchFunnelEvent({ header: 'Funnel started', status: 'success', details: { context: this.name } });

      this.currentStep?.start();
    });
  }

  submit() {
    if (this.getStatus() === 'submitted') {
      return;
    }

    this.currentStep?.complete();

    this.result = 'submitted';
    this.setStatus('submitted', () => {
      dispatchFunnelEvent({ header: 'Funnel submitted', status: 'success', details: { context: this.name } });
    });
  }

  validate(value: boolean) {
    if ((value && this.getStatus() === 'validating') || (!value && this.getStatus() === 'validated')) {
      return;
    }

    if (value) {
      this.setStatus('validating', () => {
        dispatchFunnelEvent({ header: 'Funnel validating', status: 'in-progress', details: { context: this.name } });
      });
    } else if (this.getStatus() === 'validating') {
      this.setStatus('validated', () => {
        dispatchFunnelEvent({ header: 'Funnel validated', status: 'success', details: { context: this.name } });
      });
    }
  }

  async error(details: ErrorDetails): Promise<void> {
    await super.error(details);
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
      details: {
        context: this.name,
        metadata: {
          reason,
          requestedStepIndex,
        },
      },
    });
    this.currentStep.validate(true);
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
        details: { context: this.name },
      });

      this.notifyObservers();
    });
  }

  addStep(config: FunnelStepConfig): FunnelStep {
    const index = this.steps.length;
    const step = new FunnelStep({ index, ...config });
    step.context = this;
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
      step.context = this;

      this.steps.push(step);
      return step;
    });

    this.notifyObservers();
    return steps;
  }

  setSteps(configs: FunnelStepProps[], initialStepIndex = 0): FunnelStep[] {
    this.steps = configs.map(config => {
      const funnelStep = new FunnelStep(config);
      funnelStep.context = this;
      return funnelStep;
    });

    this.currentStep = this.steps[initialStepIndex];
    this.notifyObservers();
    return this.steps;
  }

  removeStep(step: FunnelStep) {
    this.steps = this.steps.filter(s => s !== step);
    this.notifyObservers();
  }

  updateSteps(configs: FunnelStepProps[]): FunnelStep[] {
    this.steps = configs.map((config, index) => {
      const funnelStep = new FunnelStep({
        ...config,
        status: this.steps[index] ? this.steps[index].getStatus() : 'initial',
      });
      funnelStep.context = this;
      return funnelStep;
    });

    dispatchFunnelEvent({
      header: 'Funnel configuration changed',
      details: {
        context: this.name,
        metadata: {
          steps: [...this.steps].map(step => step.name).join(','),
        },
      },
      status: 'info',
    });
    this.notifyObservers();
    return this.steps;
  }

  setCurrentStep(index: number) {
    if (this.steps.length === 0 || this.currentStep?.index === index) {
      return;
    }

    this.currentStep?.complete();
    this.currentStep = this.steps[index];
    this.currentStep?.start();
    this.notifyObservers();
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

    if (!(window as any).__awsuiAnalytics__) {
      (window as any).__awsuiAnalytics__ = {
        funnels: {},
      };
    }

    (window as any).__awsuiAnalytics__.funnels[funnel.id] = funnel;
    return funnel;
  }
}
