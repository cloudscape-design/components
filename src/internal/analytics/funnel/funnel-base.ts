// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { AnalyticsMetadata } from '../interfaces';
import { ErrorDetails, FunnelBaseStatus, Observer } from './types';
import { getUuid } from './utils';

export abstract class FunnelBase<TStatus extends string = FunnelBaseStatus> {
  protected status: TStatus[] = [];
  protected observers: Observer[] = [];

  public id: string;
  public name?: string;
  public metadata?: AnalyticsMetadata;

  constructor(initialStatus: TStatus) {
    this.id = getUuid();
    this.status = [initialStatus];
  }

  protected setStatus(newStatus: TStatus): void {
    if (this.getStatus() !== newStatus) {
      this.status.push(newStatus);
      this.notifyObservers();
    }
  }

  setName(name: string): void {
    this.name = name;
    this.notifyObservers();
  }

  setMetadata(metadata?: AnalyticsMetadata): void {
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

  start(): Promise<void> {
    return new Promise(resolve => {
      if (this.getStatus() === 'started') {
        resolve();
        return;
      }

      this.setStatus('started' as TStatus);
      resolve();
    });
  }

  complete(): Promise<void> {
    return new Promise(resolve => {
      if (this.getStatus() === 'completed') {
        resolve();
        return;
      }

      this.setStatus('completed' as TStatus);
      resolve();
    });
  }

  error(details: ErrorDetails): Promise<void> {
    return new Promise(resolve => {
      if (!details.errorText) {
        resolve();
        return;
      }

      console.log('error', details);
      this.setStatus('error' as TStatus);
      resolve();
    });
  }

  addObserver(observer: Observer): void {
    this.observers.push(observer);
  }

  removeObserver(observer: Observer): void {
    this.observers = this.observers.filter(obs => obs !== observer);
  }

  protected notifyObservers(): void {
    for (const observer of this.observers) {
      observer.update(this);
    }
  }
}
