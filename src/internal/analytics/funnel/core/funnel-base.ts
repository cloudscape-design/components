// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { AnalyticsMetadata } from '../../interfaces';
import { CallbackFunction, ErrorDetails, FunnelBaseStatus, FunnelType, Observer } from '../types';
import { getUuid } from '../utils';

export abstract class FunnelBase<TStatus extends string = FunnelBaseStatus> {
  protected status: TStatus[] = [];
  protected observers: Observer[] = [];

  public id: string;
  public type?: FunnelType;
  public name?: string;
  public metadata?: AnalyticsMetadata;

  constructor(initialStatus: TStatus) {
    this.id = getUuid();
    this.status = [initialStatus];
  }

  protected setStatus(newStatus: TStatus, callback?: CallbackFunction): void {
    if (this.getStatus() !== newStatus) {
      this.status.push(newStatus);
      this.notifyObservers();

      callback?.();
    }
  }

  setName(name: string): void {
    this.name = name;
    this.notifyObservers();
  }

  setFunnelType(type: FunnelType): void {
    this.type = type;
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

  start(callback?: CallbackFunction) {
    if (this.getStatus() === 'started') {
      return;
    }

    this.setStatus('started' as TStatus);
    callback?.();
  }

  complete(callback?: CallbackFunction) {
    if (this.getStatus() === 'completed') {
      return;
    }

    this.setStatus('completed' as TStatus);
    callback?.();
  }

  error(details: ErrorDetails, callback?: CallbackFunction) {
    if (!details.errorText) {
      return;
    }

    this.setStatus('error' as TStatus);
    callback?.();
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
