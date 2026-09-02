// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import debounce from '../../debounce';

type ChangeCallback<T> = (props: T | null) => void;
type RegistrationCallback = (isRegistered: boolean) => void;

export interface BreadcrumbsGlobalRegistration<T> {
  update(props: T): void;
  cleanup(): void;
}

export interface RegisterBreadcrumbsOptions {
  /**
   * The instance already renders in the position App Layout would draw it (the toolbar slot).
   * It publishes its props for external consumers, but App Layout must not draw a second copy,
   * and it only yields when an external consumer takes over rendering.
   */
  ownedByAppLayoutSlot?: boolean;
}

interface BreadcrumbsEntry<T> {
  props: T;
  onRegistered: RegistrationCallback;
  ownedByAppLayoutSlot: boolean;
}

export interface BreadcrumbsApiInternal<T> {
  registerAppLayout: (changeCallback: ChangeCallback<T>) => (() => void) | void;
  registerBreadcrumbs: (
    props: T,
    onRegistered: RegistrationCallback,
    options?: RegisterBreadcrumbsOptions
  ) => BreadcrumbsGlobalRegistration<T>;
  onBreadcrumbsChange: (changeCallback: ChangeCallback<T>) => () => void;
  hasExternalConsumer: () => boolean;
  getStateForTesting: () => {
    appLayoutUpdateCallback: ChangeCallback<T> | null;
    breadcrumbInstances: Array<{ props: T }>;
    breadcrumbRegistrations: Array<RegistrationCallback>;
  };
}

export class BreadcrumbsController<T> {
  #appLayoutUpdateCallback: ChangeCallback<T> | null = null;
  #entries: Array<BreadcrumbsEntry<T>> = [];
  #externalConsumers: Array<ChangeCallback<T>> = [];

  // External consumers see every registered trail, including the one App Layout renders itself.
  #latestProps = (): T | null => this.#entries[this.#entries.length - 1]?.props ?? null;

  // App Layout only draws trails it is not already rendering through its own slot.
  #latestDiscoverableProps = (): T | null => {
    for (let i = this.#entries.length - 1; i >= 0; i--) {
      if (!this.#entries[i].ownedByAppLayoutSlot) {
        return this.#entries[i].props;
      }
    }
    return null;
  };

  // App Layout is the fallback renderer: it receives the latest discoverable breadcrumbs, or null
  // (yield) whenever an external consumer owns rendering.
  #notifyAppLayout = debounce(() => {
    if (!this.#appLayoutUpdateCallback) {
      return;
    }
    this.#appLayoutUpdateCallback(this.hasExternalConsumer() ? null : this.#latestDiscoverableProps());
  }, 0);

  #notifyExternalConsumers = debounce(() => {
    const latestBreadcrumb = this.#latestProps();
    this.#externalConsumers.forEach(consumer => consumer(latestBreadcrumb));
  }, 0);

  // Producers hide themselves once something else draws their trail. A slot-owned instance is
  // already in the right place, so it only yields to an external consumer.
  #notifyBreadcrumbs = debounce(() => {
    const hasAppLayout = !!this.#appLayoutUpdateCallback;
    const hasExternal = this.hasExternalConsumer();
    this.#entries.forEach(entry => {
      entry.onRegistered(entry.ownedByAppLayoutSlot ? hasExternal : hasAppLayout || hasExternal);
    });
  }, 0);

  hasExternalConsumer = () => this.#externalConsumers.length > 0;

  registerAppLayout = (changeCallback: ChangeCallback<T>) => {
    if (this.#appLayoutUpdateCallback) {
      return;
    }
    this.#appLayoutUpdateCallback = changeCallback;
    this.#notifyBreadcrumbs();
    return () => {
      this.#appLayoutUpdateCallback = null;
      this.#notifyBreadcrumbs();
    };
  };

  registerBreadcrumbs = (
    props: T,
    onRegistered: RegistrationCallback,
    options: RegisterBreadcrumbsOptions = {}
  ): BreadcrumbsGlobalRegistration<T> => {
    const entry: BreadcrumbsEntry<T> = {
      props,
      onRegistered,
      ownedByAppLayoutSlot: options.ownedByAppLayoutSlot ?? false,
    };
    this.#entries.push(entry);
    this.#notifyBreadcrumbs();
    this.#notifyAppLayout();
    this.#notifyExternalConsumers();
    return {
      update: props => {
        entry.props = props;
        this.#notifyAppLayout();
        this.#notifyExternalConsumers();
      },
      cleanup: () => {
        this.#entries.splice(this.#entries.indexOf(entry), 1);
        this.#notifyAppLayout();
        this.#notifyExternalConsumers();
      },
    };
  };

  // Consumer registration. Fires immediately with the current value (last-value replay), then on
  // every change; returns an unsubscribe function. While a consumer is registered App Layout yields.
  onBreadcrumbsChange = (changeCallback: ChangeCallback<T>) => {
    this.#externalConsumers.push(changeCallback);
    changeCallback(this.#latestProps());
    this.#notifyBreadcrumbs();
    this.#notifyAppLayout();
    return () => {
      this.#externalConsumers = this.#externalConsumers.filter(consumer => consumer !== changeCallback);
      this.#notifyBreadcrumbs();
      this.#notifyAppLayout();
    };
  };

  getStateForTesting = () => {
    return {
      appLayoutUpdateCallback: this.#appLayoutUpdateCallback,
      breadcrumbInstances: this.#entries.map(({ props }) => ({ props })),
      breadcrumbRegistrations: this.#entries.map(({ onRegistered }) => onRegistered),
    };
  };

  installInternal(internalApi: Partial<BreadcrumbsApiInternal<T>> = {}): BreadcrumbsApiInternal<T> {
    internalApi.registerBreadcrumbs ??= this.registerBreadcrumbs;
    internalApi.registerAppLayout ??= this.registerAppLayout;
    internalApi.onBreadcrumbsChange ??= this.onBreadcrumbsChange;
    internalApi.hasExternalConsumer ??= this.hasExternalConsumer;
    internalApi.getStateForTesting ??= this.getStateForTesting;

    return internalApi as BreadcrumbsApiInternal<T>;
  }
}
