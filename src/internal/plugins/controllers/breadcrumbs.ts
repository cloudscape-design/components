// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import debounce from '../../debounce';

type ChangeCallback<T> = (props: T | null) => void;
type RegistrationCallback = (isRegistered: boolean) => void;

export interface BreadcrumbsGlobalRegistration<T> {
  update(props: T): void;
  cleanup(): void;
}

export interface BreadcrumbsApiInternal<T> {
  registerAppLayout: (changeCallback: ChangeCallback<T>) => (() => void) | void;
  registerBreadcrumbs: (props: T, onRegistered: RegistrationCallback) => BreadcrumbsGlobalRegistration<T>;
  hasExternalConsumer: () => boolean;
  getStateForTesting: () => {
    appLayoutUpdateCallback: ChangeCallback<T> | null;
    breadcrumbInstances: Array<{ props: T }>;
    breadcrumbRegistrations: Array<RegistrationCallback>;
  };
}

// Public, versioned consumer API. A standalone chrome surface (e.g. the console Global
// Navigation header) subscribes to the current breadcrumbs and renders them itself; App
// Layout auto-yields while any external consumer is registered.
export interface BreadcrumbsApiPublic<T> {
  onBreadcrumbsChange: (changeCallback: ChangeCallback<T>) => () => void;
}

export class BreadcrumbsController<T> {
  #appLayoutUpdateCallback: ChangeCallback<T> | null = null;
  #breadcrumbInstances: Array<{ props: T }> = [];
  #breadcrumbRegistrations: Array<RegistrationCallback> = [];
  #externalConsumers: Array<ChangeCallback<T>> = [];

  #latestProps = (): T | null => this.#breadcrumbInstances[this.#breadcrumbInstances.length - 1]?.props ?? null;

  // App Layout is the fallback renderer: it receives the latest breadcrumbs, or null (yield)
  // whenever an external consumer owns rendering.
  #notifyAppLayout = debounce(() => {
    if (!this.#appLayoutUpdateCallback) {
      return;
    }
    this.#appLayoutUpdateCallback(this.hasExternalConsumer() ? null : this.#latestProps());
  }, 0);

  #notifyExternalConsumers = debounce(() => {
    const latestBreadcrumb = this.#latestProps();
    this.#externalConsumers.forEach(consumer => consumer(latestBreadcrumb));
  }, 0);

  // Producers (<BreadcrumbGroup>) yield when any consumer -- App Layout or an external host --
  // is registered.
  #notifyBreadcrumbs = debounce(() => {
    const hasConsumer = !!this.#appLayoutUpdateCallback || this.hasExternalConsumer();
    this.#breadcrumbRegistrations.forEach(listener => listener(hasConsumer));
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

  registerBreadcrumbs = (props: T, onRegistered: RegistrationCallback): BreadcrumbsGlobalRegistration<T> => {
    const instance = { props: props };
    this.#breadcrumbInstances.push(instance);
    this.#breadcrumbRegistrations.push(onRegistered);
    this.#notifyBreadcrumbs();
    this.#notifyAppLayout();
    this.#notifyExternalConsumers();
    return {
      update: props => {
        instance.props = props;
        this.#notifyAppLayout();
        this.#notifyExternalConsumers();
      },
      cleanup: () => {
        this.#breadcrumbInstances.splice(this.#breadcrumbInstances.indexOf(instance), 1);
        this.#breadcrumbRegistrations.splice(this.#breadcrumbRegistrations.indexOf(onRegistered), 1);
        this.#notifyAppLayout();
        this.#notifyExternalConsumers();
      },
    };
  };

  // Public consumer registration. Fires immediately with the current value (last-value replay),
  // then on every change; returns an unsubscribe function. Registering an external consumer makes
  // App Layout yield.
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
      breadcrumbInstances: this.#breadcrumbInstances,
      breadcrumbRegistrations: this.#breadcrumbRegistrations,
    };
  };

  installPublic(api: Partial<BreadcrumbsApiPublic<T>> = {}): BreadcrumbsApiPublic<T> {
    api.onBreadcrumbsChange ??= this.onBreadcrumbsChange;
    return api as BreadcrumbsApiPublic<T>;
  }

  installInternal(internalApi: Partial<BreadcrumbsApiInternal<T>> = {}): BreadcrumbsApiInternal<T> {
    internalApi.registerBreadcrumbs ??= this.registerBreadcrumbs;
    internalApi.registerAppLayout ??= this.registerAppLayout;
    internalApi.hasExternalConsumer ??= this.hasExternalConsumer;
    internalApi.getStateForTesting ??= this.getStateForTesting;

    return internalApi as BreadcrumbsApiInternal<T>;
  }
}
