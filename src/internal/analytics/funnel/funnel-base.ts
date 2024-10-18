// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { AnalyticsMetadata } from '../interfaces';
import { ErrorDetails, FunnelBaseStatus, Observer } from './types';
import { getUuid } from './utils';

export abstract class FunnelBase<TStatus extends string = FunnelBaseStatus> {
  public id: string;
  protected status: TStatus[] = [];
  protected observers: Observer[] = [];
  public metadata?: AnalyticsMetadata;

  constructor(initialStatus: TStatus) {
    this.id = getUuid();
    this.status = [initialStatus];
  }

  protected setStatus(newStatus: TStatus) {
    if (this.getStatus() !== newStatus) {
      this.status.push(newStatus);
      this.notifyObservers();
    }
  }

  setMetadata(metadata?: AnalyticsMetadata) {
    if (this.metadata === metadata) {
      return;
    }

    this.metadata = metadata;
    this.notifyObservers();
  }

  getStatus(): TStatus {
    if (this.status.length === 0) {
      return 'unknown' as TStatus;
    }
    return this.status[this.status.length - 1];
  }

  getPreviousStatus(): TStatus {
    if (this.status.length < 2) {
      return 'unknown' as TStatus;
    }

    return this.status[this.status.length - 2];
  }

  start(callback?: () => void) {
    if (this.getStatus() === 'started') {
      return;
    }

    this.setStatus('started' as TStatus);
    callback?.();
  }

  complete(callback?: () => void) {
    if (this.getStatus() === 'completed') {
      return;
    }

    this.setStatus('completed' as TStatus);
    callback?.();
  }

  error(details: ErrorDetails, callback?: () => void) {
    this.setStatus('error' as TStatus);
    callback?.();
  }

  addObserver(observer: Observer) {
    this.observers.push(observer);
  }

  removeObserver(observer: Observer) {
    this.observers = this.observers.filter(obs => obs !== observer);
  }

  protected notifyObservers() {
    for (const observer of this.observers) {
      observer.update(this);
    }
  }
}
