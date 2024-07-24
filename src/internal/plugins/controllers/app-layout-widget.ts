// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import debounce from '../../debounce';

interface PrimaryRegistration<Props> {
  type: 'primary';
  discoveredProps: Array<Props>;
}

interface SecondaryRegistration<Props> {
  type: 'secondary';
  update: (props: Props) => void;
}

export type RegistrationState<Props> = PrimaryRegistration<Props> | SecondaryRegistration<Props>;
export type RegistrationType = RegistrationState<unknown>['type'];

type RegistrationChangeHandler<Props> = (
  registration: PrimaryRegistration<Props> | SecondaryRegistration<Props>
) => void;

interface RegistrationInternal<Props> {
  forceType: RegistrationType | undefined;
  props: Props;
  secondaryInstance: SecondaryRegistration<Props>;
  onChange: (registration: PrimaryRegistration<Props> | SecondaryRegistration<Props>) => void;
}

export interface AppLayoutWidgetApiInternal<Props = unknown> {
  register(
    forceDeduplicationType: RegistrationType | undefined,
    onPropsChange: RegistrationChangeHandler<Props>
  ): () => void;
  getStateForTesting(): { registrations: Array<RegistrationInternal<Props>> };
}

export class AppLayoutWidgetController<Props = unknown> {
  #registrations: Array<RegistrationInternal<Props>> = [];

  #findPrimary = () => {
    const forcedPrimary = this.#registrations.find(registration => registration.forceType === 'primary');
    if (forcedPrimary) {
      return forcedPrimary;
    }
    for (const registration of this.#registrations.slice().reverse()) {
      if (registration.forceType !== 'secondary') {
        return registration;
      }
    }
    return undefined;
  };

  #update = () => {
    const primary = this.#findPrimary();
    const discoveredProps = this.#registrations
      .filter(registration => registration !== primary)
      .map(registration => registration.props);
    for (const registration of this.#registrations) {
      if (registration === primary) {
        registration.onChange({
          type: 'primary',
          discoveredProps,
        });
      } else {
        registration.onChange(registration.secondaryInstance);
      }
    }
  };

  #scheduleUpdate = debounce(() => this.#update(), 0);

  register = (
    forceType: RegistrationType | undefined,
    onRegistrationChange: RegistrationChangeHandler<Props>
  ): (() => void) => {
    const hasForcedPrimary = this.#registrations.some(instance => instance.forceType === 'primary');
    if (forceType === 'primary' && hasForcedPrimary) {
      throw new Error('Double primary registration attempt');
    }

    const registration: RegistrationInternal<Props> = {
      forceType,
      onChange: onRegistrationChange,
      props: {} as Props,
      secondaryInstance: {
        type: 'secondary',
        update: props => {
          registration.props = props;
          this.#scheduleUpdate();
        },
      },
    };
    this.#registrations.push(registration);

    this.#update();

    return () => {
      this.#registrations.splice(this.#registrations.indexOf(registration), 1);
      this.#scheduleUpdate();
    };
  };

  getStateForTesting = () => {
    return {
      registrations: this.#registrations,
    };
  };

  installInternal = (
    internalApi: Partial<AppLayoutWidgetApiInternal<Props>> = {}
  ): AppLayoutWidgetApiInternal<Props> => {
    internalApi.register ??= this.register;
    internalApi.getStateForTesting ??= this.getStateForTesting;
    return internalApi as AppLayoutWidgetApiInternal<Props>;
  };
}
