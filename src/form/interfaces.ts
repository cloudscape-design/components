// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { BaseComponentProps } from '../internal/base-component';

export interface FormProps extends BaseComponentProps {
  /**
   * Specifies the main form content.
   */
  children?: React.ReactNode;

  /**
   * Specifies the form title and optional description. Use the [header component](/components/header/).
   */
  header?: React.ReactNode;

  /**
   * Specifies a form-level validation message.
   */
  errorText?: React.ReactNode;

  /**
   * Provides a text alternative for the error icon in the error alert.
   * @i18n
   */
  errorIconAriaLabel?: string;

  /**
   * Specifies actions for the form. You should wrap action buttons in a [space between component](/components/space-between) with `direction="horizontal"` and `size="xs"`.
   */
  actions?: React.ReactNode;

  /**
   * Specifies left-aligned secondary actions for the form. Use a button dropdown if multiple actions are required.
   */
  secondaryActions?: React.ReactNode;

  /**
   * Specify a form variant with one of the following:
   * * `full-page` - Use this variant when the form contains the entire content of the page. Full page variants implement the high contrast header and content behavior automatically.
   * * `embedded` - Use this variant when the form doesn't occupy the full page. This variant doesn't use a high contrast header.
   * @visualrefresh
   */
  variant?: 'full-page' | 'embedded';
}

export interface FormLayoutProps {
  children?: React.ReactNode;
  header?: React.ReactNode;
  variant: FormProps['variant'];
}
