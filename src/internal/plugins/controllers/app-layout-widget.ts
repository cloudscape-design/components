// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import debounce from '../../debounce';

type PropsChangeHandler<Props> = (instances: Array<Props>) => void;

interface PrimaryRegistration {
  type: 'primary';
  cleanup: () => void;
}

interface SecondaryRegistration<Props> {
  type: 'secondary';
  update: (props: Props) => void;
  cleanup: () => void;
}

export interface AppLayoutWidgetApiInternal<Props = unknown> {
  register(onPropsChange: PropsChangeHandler<Props>): PrimaryRegistration | SecondaryRegistration<Props>;
}

export class AppLayoutWidgetController<Props = unknown> {
  #primaryRegistration: PropsChangeHandler<Props> | null = null;
  #secondaryInstances: Array<{ props: Props }> = [];

  #scheduleUpdate = debounce(() => {
    if (!this.#primaryRegistration) {
      return null;
    }
    this.#primaryRegistration(
      this.#secondaryInstances.filter(instance => instance.props).map(instance => instance.props)
    );
  }, 0);

  register = (onPropsChange: PropsChangeHandler<Props>): PrimaryRegistration | SecondaryRegistration<Props> => {
    if (!this.#primaryRegistration) {
      this.#primaryRegistration = onPropsChange;
      return {
        type: 'primary',
        cleanup: () => {
          this.#primaryRegistration = null;
        },
      };
    }
    const instance = { props: {} as Props };
    this.#secondaryInstances.push(instance);

    return {
      type: 'secondary',
      update: props => {
        instance.props = props;
        this.#scheduleUpdate();
      },
      cleanup: () => {
        this.#secondaryInstances.splice(this.#secondaryInstances.indexOf(instance), 1);
        this.#scheduleUpdate();
      },
    };
  };

  installInternal = (
    internalApi: Partial<AppLayoutWidgetApiInternal<Props>> = {}
  ): AppLayoutWidgetApiInternal<Props> => {
    internalApi.register ??= this.register;
    return internalApi as AppLayoutWidgetApiInternal<Props>;
  };
}
