// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { FlowType } from '../internal/analytics/interfaces';
import { BaseComponentProps } from '../internal/base-component';

export namespace FormProps {
  export interface AnalyticsMetadata {
    instanceIdentifier?: string;
    flowType?: FlowType;
    resourceType?: string;
  }
}

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
   * * `full-page` - Use this variant when the form contains the entire content of the page.
   * * `embedded` - Use this variant when the form doesn't occupy the full page.
   * @deprecated You can safely remove this property as there is no longer any visual difference between `full-page` and `embedded` variants.
   */
  variant?: 'full-page' | 'embedded';

  /**
   * Specifies additional analytics-related metadata.
   * * `instanceIdentifier` - A unique string that identifies this component instance in your application.
   * * `flowType` - Identifies the type of flow represented by the component.
   * * `resourceType` - Identifies the type of resource represented by the flow. **Note:** This API is currently experimental.
   * @analytics
   */
  analyticsMetadata?: FormProps.AnalyticsMetadata;
}
