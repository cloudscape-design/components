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
   * Context is shared with child instances of IconProvider.
   *
   * Set to `null` to reset the icons to the default set.
   *
   * e.g. Override `AppLayout` icons but not content icons by wrapping content with an `IconProvider` with this property set to `null`.
   */
  icons: IconProviderProps.Icons | null;
}

export namespace IconProviderProps {
  export type Icons = Partial<{
    [name in keyof typeof generatedIcons]: JSX.Element;
  }>;
}
