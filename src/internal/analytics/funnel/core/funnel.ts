// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ErrorDetails, FunnelMetadata, FunnelResult, FunnelStatus, FunnelStepConfig, FunnelStepProps } from '../types';
import { funnelAnalytics } from './';
import { FunnelBase } from './funnel-base';
import { FunnelStep } from './funnel-step';

interface FunnelProps {
  name?: string;
  context?: Funnel | undefined;
}

export class Funnel extends FunnelBase<FunnelStatus> {
  protected result: FunnelResult;
  public steps: FunnelStep[] = [];

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

  private getPath() {
    const path = [this.name || ''];
    let currentContext = this.context;

    while (currentContext) {
      if (currentContext.name) {
        path.push(currentContext.name);
      }
      currentContext = currentContext.context;
    }

    return path.filter(Boolean).reverse();
  }

  getMetadata(): FunnelMetadata {
    return {
      funnelId: this.id,
      funnelName: this.name || '',
      funnelResult: this.result,
      flowType: this.metadata?.flowType,
      resourceType: this.metadata?.resourceType,
      instanceIdentifier: this.metadata?.instanceIdentifier,
      funnelType: this.type,
      totalSteps: this.steps.length,
      optionalStepNumbers: this.steps.filter(step => step.optional).map(step => step.index),
    };
  }

  start() {
    if (this.getStatus() !== 'initial') {
      return;
    }

    super.start(() => {
      funnelAnalytics.track(
        'funnel:start',
        {
          ...this.getMetadata(),
          totalSteps: this.steps.length,
          stepConfiguration: this.steps.map(step => ({
            name: step.name || '',
            number: step.index + 1,
            isOptional: step.optional,
          })),
        },
        {
          path: this.getPath(),
        }
      );
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
      funnelAnalytics.track('funnel:submitted', this.getMetadata(), {
        path: this.getPath(),
      });
    });
  }

  validate(value: boolean) {
    if ((value && this.getStatus() === 'validating') || (!value && this.getStatus() === 'validated')) {
      return;
    }

    if (value) {
      this.setStatus('validating', () => {
        funnelAnalytics.track('funnel:validating', this.getMetadata(), {
          path: this.getPath(),
        });
      });
    } else if (this.getStatus() === 'validating') {
      this.setStatus('validated', () => {
        funnelAnalytics.track('funnel:validated', this.getMetadata(), {
          path: this.getPath(),
        });
      });
    }
  }

  error(details: ErrorDetails) {
    if (details.errorText) {
      super.error(details, () => {
        funnelAnalytics.track(
          'funnel:error',
          this.getMetadata(),
          {
            path: this.getPath(),
          },
          {
            error: {
              message: details.errorText || '',
              source: details.scope.source,
            },
          }
        );
      });
    } else if (this.getStatus() === 'error') {
      this.setStatus(this.getPreviousStatus());
      funnelAnalytics.track('funnel:error-cleared', this.getMetadata(), {
        path: this.getPath(),
      });
    }
  }

  cancel() {
    this.result = 'cancelled';
    this.notifyObservers();
  }

  navigate(reason: string, requestedStepIndex: number) {
    const currentStepIndex = this.currentStep?.index ?? 0;

    funnelAnalytics.track(
      'funnel:navigation',
      this.getMetadata(),
      {
        path: this.getPath(),
        step: {
          index: currentStepIndex,
          name: this.currentStep?.name ?? '',
          isOptional: this.currentStep?.optional ?? false,
        },
      },
      {
        navigation: {
          from: this.steps[currentStepIndex]?.name ?? '',
          to: this.steps[requestedStepIndex]?.name ?? '',
          reason,
        },
      }
    );

    this.currentStep.validate(true);
  }

  complete() {
    this.currentStep?.complete();
    super.complete(() => {
      if (!this.result) {
        this.cancel();
      }

      funnelAnalytics.track('funnel:complete', this.getMetadata(), {
        path: this.getPath(),
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

    funnelAnalytics.track(
      'funnel:configuration-changed',
      this.getMetadata(),
      {
        path: this.getPath(),
      },
      {
        configuration: {
          steps: this.steps.map(step => ({
            name: step.name,
            index: step.index,
            isOptional: step.optional,
          })),
        },
      }
    );

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

// TODO: Move to global Analytics plugin
export class FunnelFactory {
  static create(config?: FunnelProps): Funnel {
    const funnel = new Funnel(config);

    if (!(window as any).__awsuiAnalytics__) {
      (window as any).__awsuiAnalytics__ = {
        funnels: {},
      };
    }

    (window as any).__awsuiAnalytics__.funnels[funnel.id] = funnel;
    return funnel;
  }
}
