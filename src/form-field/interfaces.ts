// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseComponentProps } from '../internal/base-component';
import React from 'react';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';

export interface FormFieldProps extends BaseComponentProps {
  /**
   * The ID of the primary form control. You can use this to set the
   * `for` attribute of a label for accessibility.
   *
   * If you don't set this property, the control group automatically sets
   * the label to the ID of an inner form control (for example, an [input](/components/input) component).
   * This only works well if you're using a single control in the form field.
   */
  controlId?: string;

  /**
   * Determines whether the primary control should expand to 12 columns.
   *
   * By default (or when this property is set to `false`), the primary control
   * occupies 9 columns. The secondary control uses the remaining 3 columns.
   * On smaller viewports, both components occupy 12 columns and stack on top of each other.
   *
   * If this property is set to `true`, the primary control uses the full
   * 12 columns. The secondary control (if present) also uses 12 columns, and the two
   * controls stack on top of each other.
   */
  stretch?: boolean;

  /**
   * The main label for the form field.
   */
  label?: React.ReactNode;

  /**
   * An object containing all the necessary localized strings required by the component.
   * @i18n
   */
  i18nStrings?: FormFieldProps.I18nStrings;

  /**
   * Use to display an 'Info' link next to the label.
   */
  info?: React.ReactNode;

  /**
   * The primary form control (for example, input, textarea, etc.).
   * @displayname control
   */
  children?: React.ReactNode;

  /**
   * A secondary control. You can use this for custom actions and content.
   */
  secondaryControl?: React.ReactNode;

  /**
   * Detailed information about the form field that's displayed below the label.
   */
  description?: React.ReactNode;

  /**
   * Constraint text that's displayed below the control. Use this to provide
   * additional information about valid formats, etc.
   */
  constraintText?: React.ReactNode;

  /**
   * Text that displays as a validation message. If this is set to a
   * non-empty string, it will render the form field as invalid.
   */
  errorText?: React.ReactNode;
}

export namespace FormFieldProps {
  export interface I18nStrings {
    /**
     * Provides a text alternative for the error icon in the error message.
     */
    errorIconAriaLabel?: string;
  }
}

export interface InternalFormFieldProps extends FormFieldProps, InternalBaseComponentProps {
  /**
   * Visually hide the label.
   */
  __hideLabel?: boolean;

  /**
   * Disable the gutter applied by default.
   */
  __disableGutters?: boolean;
}
