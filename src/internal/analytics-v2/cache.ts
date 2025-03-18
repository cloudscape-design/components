// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { Funnel } from './funnel';

class FunnelCache {
  private static instance: FunnelCache;
  private elementCache: WeakMap<HTMLElement, Funnel>;
  private funnels: Set<Funnel>; // A set to keep track of the values

  private constructor() {
    this.elementCache = new WeakMap<HTMLElement, Funnel>();
    this.funnels = new Set<Funnel>();
  }

  public static getInstance(): FunnelCache {
    if (!FunnelCache.instance) {
      FunnelCache.instance = new FunnelCache();
    }
    return FunnelCache.instance;
  }

  public set(element: HTMLElement, funnel: Funnel) {
    this.elementCache.set(element, funnel);
    this.funnels.add(funnel);
  }

  public delete(element: HTMLElement) {
    const funnelElement = this.elementCache.get(element);
    if (funnelElement) {
      this.funnels.delete(funnelElement);
    }
    this.elementCache.delete(element);
  }

  public get(element: HTMLElement): Funnel | undefined {
    return this.elementCache.get(element);
  }

  public has(element: HTMLElement): boolean {
    return this.elementCache.has(element);
  }

  public values(): Funnel[] {
    return Array.from(this.funnels);
  }
}

export const funnelCache = FunnelCache.getInstance();
