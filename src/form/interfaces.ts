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
   * Determines whether the form displays a dark header and overlap with content.
   * * A full-page form displays the dark header and overlap, similar to what the [ContentLayout](/components/content-layout/) component provides by default.
   *   Use this variant if the form is the first and primary element on the page.
   * * An embedded form is one which is not used in a typical [create](/patterns/resource-management/create/single-page-create/) or
   *   [edit](/patterns/resource-management/edit/page-edit/) page, and is instead used in another context which doesn't occupy the full page.
   *   This variant does not use a dark header.
   * @visualrefresh
   */
  variant?: 'full-page' | 'embedded';
}
