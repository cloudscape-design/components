// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { FunnelConfig, FunnelStepConfig, FunnelSubStepConfig, FunnelType } from './interfaces';

type FunnelState = 'initial' | 'in-progress' | 'submitting' | 'completed' | 'error' | 'cancelled';

export class FunnelSubstep {
  public name: string | undefined;
  public state: FunnelState = 'initial';
  public number: number | undefined;
  public errors: Map<string, string> = new Map();

  constructor({ name, number }: FunnelSubStepConfig & { number: number }) {
    this.name = name;
    this.number = number;
  }

  start() {
    if (this.state === 'in-progress') {
      return;
    }

    console.log('[Funnel v2] Funnel substep started', { name: this.name, number: this.number });
    this.state = 'in-progress';
  }

  complete() {
    if (this.state === 'completed') {
      return;
    }

    console.log('[Funnel v2] Funnel substep completed', { name: this.name, number: this.number });
    this.state = 'completed';
  }

  error(fieldId?: string, fieldErrorId?: string) {
    this.state = 'error';
    console.log('[Funnel v2] Funnel substep error', { name: this.name, number: this.number, fieldId, fieldErrorId });
  }

  setFieldError(fieldId: string, fieldErrorId: string) {
    if (!fieldErrorId) {
      this.errors.delete(fieldId);
      this.state = 'in-progress';

      console.log('[Funnel v2] Funnel substep error cleared', { name: this.name, number: this.number, fieldId });
      return;
    }

    this.errors.set(fieldId, fieldErrorId);
    this.error(fieldId, fieldErrorId);
  }
}

export class FunnelStep {
  public number: number | undefined;
  public name: string | undefined;
  public isOptional: boolean | undefined;
  public substeps: FunnelSubstep[] = [];
  public state: FunnelState = 'initial';
  public activeSubstep: FunnelSubstep | undefined | null;

  constructor({ number, name, isOptional }: FunnelStepConfig) {
    this.number = number;
    this.name = name;
    this.isOptional = isOptional;
  }

  start() {
    console.log('[Funnel v2] Funnel step started', { name: this.name, number: this.number });
  }

  complete() {
    this.activeSubstep?.complete();
    console.log('[Funnel v2] Funnel step completed', { name: this.name, number: this.number });
  }

  error(errorText: string | undefined | null) {
    this.state = 'error';
    console.log('[Funnel v2] Funnel step errored', { name: this.name, number: this.number, errorText });
  }

  setActiveSubstep(number: number | undefined | null) {
    if (this.activeSubstep?.number === number) {
      return;
    }

    this.activeSubstep?.complete();
    this.activeSubstep = number ? this.substeps[number - 1] : undefined;
    this.activeSubstep?.start();
  }

  registerSubsteps(substepConfigs: FunnelSubStepConfig[]) {
    this.substeps = substepConfigs.map((config, index) => new FunnelSubstep({ ...config, number: index + 1 }));
  }
}

export class Funnel {
  public version = '2.0';
  public name: string | undefined;
  public type: FunnelType | undefined;
  public steps: FunnelStep[] = [];
  public interactionId: string | undefined;
  public activeStep: FunnelStep | undefined | null;
  public state: FunnelState = 'initial';
  public stepConfiguration: FunnelConfig['stepConfiguration'] = [];

  constructor({ name, type, stepConfiguration }: FunnelConfig) {
    this.name = name;
    this.type = type;
    this.stepConfiguration = stepConfiguration;
  }

  start() {
    this.interactionId = 'funnel-interaction-id';
    console.log('[Funnel v2] Funnel started', { name: this.name, type: this.type });
    this.state = 'in-progress';

    if (!this.activeStep && this.steps.length > 0) {
      this.activeStep = this.steps[0];
    }

    this.activeStep?.start();
  }

  complete() {
    this.activeStep?.complete();

    const result = this.state === 'submitting' ? 'successful' : 'cancelled';
    this.state = 'completed';
    console.log('[Funnel v2] Funnel completed', { name: this.name, type: this.type, result });
  }

  cancel() {
    this.state = 'cancelled';
    console.log('[Funnel v2] Funnel cancelled', { name: this.name, type: this.type });
  }

  submit() {
    this.state = 'submitting';
    console.log('[Funnel v2] Funnel submitting', { name: this.name, type: this.type });
  }

  error() {
    this.state = 'error';
    console.log('[Funnel v2] Funnel errored', { name: this.name, type: this.type });
  }

  interaction(type: 'info' | 'external') {
    const props = {
      stepName: this.activeStep?.name,
      stepNumber: this.activeStep?.number,
    };

    switch (type) {
      case 'info':
        console.log('[Funnel v2] Funnel info link interaction', props);
        break;
      case 'external':
        console.log('[Funnel v2] Funnel external link interaction', props);
        break;
    }
  }

  setActiveStepIndex(index: number) {
    this.setActiveStep(this.steps[index]);
  }

  setActiveStep(step: FunnelStep) {
    if (this.activeStep === step) {
      return;
    }

    if (this.state === 'in-progress') {
      this.activeStep?.complete();
      this.activeStep = step;
      this.activeStep.start();
    }
  }

  registerStep(step: FunnelStep) {
    this.steps.push(step);
  }

  unregisterStep(step: FunnelStep) {
    this.steps = this.steps.filter(s => s !== step);
  }
}
