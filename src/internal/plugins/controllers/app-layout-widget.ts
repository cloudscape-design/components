// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import debounce from '../../debounce';
import { AppLayoutProps } from '../../../app-layout/interfaces';

type PropsChangeHandler = (props: AppLayoutProps) => void;

export interface SecondaryRegistration {
  setProps: (props: AppLayoutProps) => void;
  cleanup: () => void;
}

export interface PrimaryRegistration {
  onPropsChange: (handler: PropsChangeHandler) => void;
  cleanup: () => void;
}

export interface AppLayoutWidgetApiInternal {
  registerPrimary: () => PrimaryRegistration | null;
  registerSecondary: () => SecondaryRegistration;
}

export class AppLayoutWidgetController {
  #onPropsChange: PropsChangeHandler | null = null;
  #primaryRegistered = false;
  #secondaryInstances: Array<{ props: AppLayoutProps }> = [];

  #scheduleUpdate = debounce(() => {
    if (!this.#primaryRegistered || !this.#onPropsChange) {
      return null;
    }
    const consolidatedProps = this.#secondaryInstances.reduce((props, current) => {
      return Object.assign(props, current.props);
    }, {});
    this.#onPropsChange(consolidatedProps);
  }, 0);

  registerPrimary = (): ReturnType<AppLayoutWidgetApiInternal['registerPrimary']> => {
    if (this.#primaryRegistered) {
      return null;
    }
    this.#primaryRegistered = true;
    return {
      onPropsChange: callback => {
        this.#onPropsChange = callback;
        this.#scheduleUpdate();
      },
      cleanup: () => {
        this.#primaryRegistered = false;
        this.#scheduleUpdate();
      },
    };
  };

  registerSecondary = (): ReturnType<AppLayoutWidgetApiInternal['registerSecondary']> => {
    if (!this.#primaryRegistered) {
      throw new Error('Unexpected secondary registration');
    }
    const instance = { props: {} };
    this.#secondaryInstances.push(instance);

    return {
      setProps: newProps => {
        instance.props = newProps;
        this.#scheduleUpdate();
      },
      cleanup: () => {
        this.#secondaryInstances.splice(this.#secondaryInstances.indexOf(instance), 1);
        this.#scheduleUpdate();
      },
    };
  };

  installInternal = (internalApi: Partial<AppLayoutWidgetApiInternal> = {}): AppLayoutWidgetApiInternal => {
    internalApi.registerPrimary ??= this.registerPrimary;
    internalApi.registerSecondary ??= this.registerSecondary;
    return internalApi as AppLayoutWidgetApiInternal;
  };
}
