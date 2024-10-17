// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { FunnelBase } from './funnel-base';
import { dispatchFunnelEvent, Status } from './funnel-logger';
import { ErrorDetails } from './types';

export class FunnelSubstep extends FunnelBase {
  protected index = -1;
  public name: string;

  private stateTimeout: ReturnType<typeof setTimeout> | null = null;
  private latestAction: 'start' | 'complete' | null = null;

  constructor(name = '') {
    super('initial');
    this.name = name;
  }

  get domAttributes() {
    return {
      id: this.id,
      'data-funnel-substep-id': this.id,
      'data-funnel-substep-index': `${this.index}`,
    };
  }

  setIndex(index: number) {
    this.index = index;
    this.notifyObservers();
  }

  setName(name: string) {
    this.name = name;
    this.notifyObservers();
  }

  private debounceState(action: 'start' | 'complete') {
    this.latestAction = action;

    if (this.stateTimeout) {
      clearTimeout(this.stateTimeout);
    }

    this.stateTimeout = setTimeout(() => {
      if (this.latestAction === 'start') {
        super.start(() => {
          dispatchFunnelEvent({ header: 'Funnel substep started', status: 'success', details: this.name });
        });
      } else if (this.latestAction === 'complete') {
        super.complete(() => {
          dispatchFunnelEvent({ header: 'Funnel substep completed', status: 'success', details: this.name });
        });
      }

      this.stateTimeout = null;
      this.latestAction = null;
    }, 10);
  }

  start(): void {
    this.debounceState('start');
  }

  complete(): void {
    this.debounceState('complete');
  }

  error(details: ErrorDetails, callback?: () => void) {
    super.error(details, () => {
      const { errorText, scope } = details;
      const status: Status = errorText ? 'error' : 'info';
      switch (scope.type) {
        case 'field': {
          if (this.getStatus() === 'error') {
            dispatchFunnelEvent({
              header: errorText ? 'Field error' : 'Field error cleared',
              status,
              details: [this.name, scope.label].join(' / '),
            });
          }
          break;
        }
        default:
          dispatchFunnelEvent({ header: errorText ? 'Field error' : 'Substep error cleared', status });
          break;
      }

      callback?.();
    });
  }
}
