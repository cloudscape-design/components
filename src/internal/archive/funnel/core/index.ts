// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {
  AnalyticsPlugin,
  FunnelContext,
  FunnelEvent,
  FunnelEventDetails,
  FunnelEventName,
  FunnelMetadata,
  StepMetadata,
  SubstepMetadata,
} from '../types';

/**
 * Core analytics class that manages the funnel event system
 */
export class FunnelAnalytics {
  private static instance: FunnelAnalytics;
  private plugins: AnalyticsPlugin[] = [];
  private eventBuffer: FunnelEvent[] = [];
  private initialized = false;

  private constructor() {}

  static getInstance(): FunnelAnalytics {
    if (!FunnelAnalytics.instance) {
      FunnelAnalytics.instance = new FunnelAnalytics();
    }
    return FunnelAnalytics.instance;
  }

  initialize(plugins: AnalyticsPlugin[] = []) {
    if (this.initialized) {
      console.warn('FunnelAnalytics already initialized');
      return;
    }

    this.plugins = plugins;
    this.initialized = true;

    this.flushEventBuffer();
  }

  addPlugin(plugin: AnalyticsPlugin) {
    if (!this.plugins.some(p => p === plugin)) {
      this.plugins.push(plugin);
      this.flushEventBuffer();
    }
  }

  removePlugin(plugin: AnalyticsPlugin) {
    this.plugins = this.plugins.filter(p => p !== plugin);
  }

  dispatch(event: FunnelEvent) {
    const hydratedEvent = this.hydrateEvent(event);
    if (!this.initialized || this.plugins.length === 0) {
      this.eventBuffer.push(hydratedEvent);
      return;
    }

    this.sendToPlugins(hydratedEvent);
  }

  track(
    name: FunnelEventName,
    metadata: FunnelMetadata | StepMetadata | SubstepMetadata,
    context: FunnelContext,
    details?: FunnelEventDetails
  ) {
    const event = this.createEvent(name, metadata, context, details);
    this.dispatch(event);
  }

  getPlugins(): AnalyticsPlugin[] {
    return [...this.plugins];
  }

  reset() {
    this.plugins = [];
    this.eventBuffer = [];
    this.initialized = false;
  }

  private createEvent(
    name: FunnelEventName,
    metadata: FunnelMetadata | StepMetadata | SubstepMetadata,
    context: FunnelContext,
    details?: FunnelEventDetails
  ): FunnelEvent {
    return {
      name,
      metadata,
      context,
      details,
    };
  }

  private hydrateEvent(event: FunnelEvent): FunnelEvent {
    return {
      ...event,
      metadata: {
        ...event.metadata,
      },
    };
  }

  private sendToPlugins(event: FunnelEvent) {
    this.plugins.forEach(plugin => {
      try {
        plugin.track(event);
      } catch (error) {
        console.warn('Error in analytics plugin:', error);
      }
    });
  }

  private flushEventBuffer() {
    if (this.initialized && this.plugins.length > 0) {
      while (this.eventBuffer.length > 0) {
        const event = this.eventBuffer.shift();
        if (event) {
          this.sendToPlugins(event);
        }
      }
    }
  }
}

export const funnelAnalytics = FunnelAnalytics.getInstance();

export function createFunnelEvent(
  name: FunnelEventName,
  metadata: FunnelMetadata,
  context: FunnelContext,
  details?: FunnelEventDetails
): FunnelEvent {
  return {
    name,
    metadata,
    context,
    details,
  };
}

export function initializeFunnelAnalytics(plugins: AnalyticsPlugin[] = []) {
  funnelAnalytics.initialize(plugins);
}
