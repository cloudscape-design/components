// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { ReactNode } from 'react';

import generatedIcons from '../icon/generated/icons';
import { BaseComponentProps } from '../internal/base-component';

export interface IconProviderProps extends BaseComponentProps {
  children: ReactNode;

  /**
   * Specifies icon overrides using existing icon names, e.g. `{'add-plus': <svg>...</svg>}`.
   *
   * These icon overrides will automatically be applied to any component that is a descendant of this provider, including nested providers.
   *
   * Set to `null` to reset the icons to the default set.
   *
   * For example, override `AppLayout` icons but not icons in the content slot by wrapping content with an `IconProvider` with this property set to `null`.
   *
   * `<Icon ... />` component can be used as an override (e.g. `{'close': <Icon name='arrow-left' />}`).
   * However, if the icon name is the same as the key, e.g. `{'close': <Icon name='close' />}` an infinite loop will be created.
   * The same applies to switching icons in the same configuration (e.g. `{'close': <Icon name='arrow-left' />, 'arrow-left': <Icon name='close' />}`).
   */
  icons: IconProviderProps.Icons | null;
}

export namespace IconProviderProps {
  export type Icons = {
    // Generates an object shape using the current set of available icons.
    // For example: {'add-plus': JSX.Element, 'anchor-link': ...}
    [name in keyof typeof generatedIcons]?: ReactNode | null;
  };
}
