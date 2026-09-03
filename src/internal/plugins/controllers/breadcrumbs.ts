// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { getGlobalFlag } from '@cloudscape-design/component-toolkit/internal';

import debounce from '../../debounce';
import { reportRuntimeApiWarning } from '../helpers/metrics';

/**
 * Set by the console shell before either bundle evaluates, to declare that a surface outside App
 * Layout owns breadcrumbs rendering:
 *
 *   window[Symbol.for('awsui-global-flags')].breadcrumbsOwnedExternally = true;
 *
 * It is the only ownership signal readable during the first render, so it is what prevents the trail
 * painting in the toolbar and being removed once the owning surface loads. The shell must clear it if
 * that surface fails to load, or no breadcrumbs render at all.
 *
 * TODO: add to GlobalFlags in @cloudscape-design/component-toolkit and drop the cast.
 */
export const isBreadcrumbsOwnedExternally = () =>
  !!getGlobalFlag('breadcrumbsOwnedExternally' as Parameters<typeof getGlobalFlag>[0]);

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
  // Rendering the trail is exclusive, so there is at most one consumer. The token lets a superseded
  // consumer's unsubscribe be ignored instead of clearing the live one.
  #externalConsumer: { changeCallback: ChangeCallback<T>; token: object } | null = null;

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

  #isOwnedExternally = () => isBreadcrumbsOwnedExternally() || this.#externalConsumer !== null;

  // App Layout is the fallback renderer: it receives the latest discoverable breadcrumbs, or null
  // (yield) whenever rendering is owned externally.
  #notifyAppLayout = debounce(() => {
    if (!this.#appLayoutUpdateCallback) {
      return;
    }
    this.#appLayoutUpdateCallback(this.#isOwnedExternally() ? null : this.#latestDiscoverableProps());
  }, 0);

  #notifyExternalConsumer = debounce(() => {
    this.#externalConsumer?.changeCallback(this.#latestProps());
  }, 0);

  // Producers hide themselves once something else draws their trail. A slot-owned instance is
  // already in the right place, so it only yields to an external owner.
  #notifyBreadcrumbs = debounce(() => {
    const hasAppLayout = !!this.#appLayoutUpdateCallback;
    const isOwnedExternally = this.#isOwnedExternally();
    this.#entries.forEach(entry => {
      entry.onRegistered(entry.ownedByAppLayoutSlot ? isOwnedExternally : hasAppLayout || isOwnedExternally);
    });
  }, 0);

  hasExternalConsumer = () => this.#externalConsumer !== null;

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
    this.#notifyExternalConsumer();
    return {
      update: props => {
        entry.props = props;
        this.#notifyAppLayout();
        this.#notifyExternalConsumer();
      },
      cleanup: () => {
        this.#entries.splice(this.#entries.indexOf(entry), 1);
        this.#notifyAppLayout();
        this.#notifyExternalConsumer();
      },
    };
  };

  // Single consumer: registering while another is active replaces it and tells it to stop drawing, so
  // a mount-before-unmount handover never leaves the trail nowhere. Replays the current value on
  // subscribe. The returned unsubscribe is inert once superseded.
  onBreadcrumbsChange = (changeCallback: ChangeCallback<T>) => {
    const token = {};
    const previous = this.#externalConsumer;
    if (previous) {
      reportRuntimeApiWarning(
        'breadcrumbs',
        'A breadcrumbs consumer is already registered. The previous consumer will be replaced.'
      );
    }
    this.#externalConsumer = { changeCallback, token };
    previous?.changeCallback(null);
    changeCallback(this.#latestProps());
    this.#notifyBreadcrumbs();
    this.#notifyAppLayout();
    return () => {
      if (this.#externalConsumer?.token !== token) {
        return;
      }
      this.#externalConsumer = null;
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
