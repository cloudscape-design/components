// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';

export interface DrawerProps extends BaseComponentProps {
  /**
   * Header of the drawer.
   *
   * It should contain the only `h2` used in the drawer.
   */
  header?: React.ReactNode;

  /**
   * If set to `true`, the drawer header remains visible when the user scrolls down.
   *
   * Doesn't do anything if `header` is not provided.
   */
  stickyHeader?: boolean;

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
   * Determines whether the drawer content has padding. If `true`, removes the default padding from the content area.
   */
  disableContentPaddings?: boolean;

  /**
   * An object containing all the necessary localized strings required by the component.
   * @i18n
   */
  i18nStrings?: I18nStrings;

  /**
   * Actions for the header. Available only if you specify the `header` property.
   */
  headerActions?: React.ReactNode;

  /**
   * Footer of the drawer.
   */
  footer?: React.ReactNode;

  /**
   * If set to `true`, the drawer footer remains visible when the user scrolls up and down.
   *
   * Doesn't do anything if `footer` is not provided.
   */
  stickyFooter?: boolean;
}

interface I18nStrings {
  /**
    Specifies the text that's displayed when the panel is in a loading state.
   */
  loadingText?: string;
}
