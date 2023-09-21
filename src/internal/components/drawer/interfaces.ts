// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseComponentProps } from '../../base-component';
import React from 'react';

export interface DrawerProps extends BaseComponentProps {
  /**
   * Header of the drawer.
   *
   * It should contain the only `h2` used in the drawer.
   */
  header?: React.ReactNode;

  /**
   * Main content of the drawer.
   *
   */
  children?: React.ReactNode;

  /**
   * Renders the drawer in a loading state. We recommend that you also set a `loadingText`.
   */
  loading?: boolean;

  /**
   * An object containing all the necessary localized strings required by the component.
   * @i18n
   */
  i18nStrings?: I18nStrings;
}

export interface I18nStrings {
  /**
    Specifies the text that's displayed when the panel is in a loading state.
   */
  loadingText?: string;
}
