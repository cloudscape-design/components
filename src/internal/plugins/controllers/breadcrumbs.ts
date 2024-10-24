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
  getStateForTesting: () => {
    appLayoutUpdateCallback: ChangeCallback<T> | null;
    breadcrumbInstances: Array<{ props: T }>;
    breadcrumbRegistrations: Array<RegistrationCallback>;
  };
}

export class BreadcrumbsController<T> {
  #appLayoutUpdateCallback: ChangeCallback<T> | null = null;
  #breadcrumbInstances: Array<{ props: T }> = [];
  #breadcrumbRegistrations: Array<RegistrationCallback> = [];

  #notifyAppLayout = debounce(() => {
    if (!this.#appLayoutUpdateCallback) {
      return;
    }
    const latestBreadcrumb = this.#breadcrumbInstances[this.#breadcrumbInstances.length - 1];
    this.#appLayoutUpdateCallback(latestBreadcrumb?.props ?? null);
  }, 0);

  #notifyBreadcrumbs = debounce(() => {
    this.#breadcrumbRegistrations.forEach(listener => listener(!!this.#appLayoutUpdateCallback));
  }, 0);

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
    return {
      update: props => {
        instance.props = props;
        this.#notifyAppLayout();
      },
      cleanup: () => {
        this.#breadcrumbInstances.splice(this.#breadcrumbInstances.indexOf(instance), 1);
        this.#breadcrumbRegistrations.splice(this.#breadcrumbRegistrations.indexOf(onRegistered), 1);
        this.#notifyAppLayout();
      },
    };
  };

  getStateForTesting = () => {
    return {
      appLayoutUpdateCallback: this.#appLayoutUpdateCallback,
      breadcrumbInstances: this.#breadcrumbInstances,
      breadcrumbRegistrations: this.#breadcrumbRegistrations,
    };
  };

  installInternal(internalApi: Partial<BreadcrumbsApiInternal<T>> = {}): BreadcrumbsApiInternal<T> {
    internalApi.registerBreadcrumbs ??= this.registerBreadcrumbs;
    internalApi.registerAppLayout ??= this.registerAppLayout;
    internalApi.getStateForTesting ??= this.getStateForTesting;

    return internalApi as BreadcrumbsApiInternal<T>;
  }
}
