// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseChangeDetail, BaseInputProps } from '../input/interfaces';
import { BaseComponentProps } from '../internal/base-component';
import { FormFieldValidationControlProps } from '../internal/context/form-field-context';

export interface TimeInputProps extends BaseInputProps, FormFieldValidationControlProps, BaseComponentProps {
  /**
   * Specifies the format of the time input.
   *
   * Use it to restrict the granularity of time that the user can enter.
   */
  format?: TimeInputProps.Format;

  /**
   * Specifies whether the component should use 12-hour or 24-hour format.
   * When using 12-hour format, there is no option for picking AM or PM.
   */
  use24Hour?: boolean;

  /**
   * Specifies whether to enable a browser's autocomplete functionality for this input.
   * In some cases it might be appropriate to disable autocomplete (for
   * example, for security-sensitive fields). To use it correctly, set the `name` property.
   */
  autoComplete?: boolean;
}

export namespace TimeInputProps {
  export type Format = 'hh' | 'hh:mm' | 'hh:mm:ss';
  export type ChangeDetail = BaseChangeDetail;

  export interface Ref {
    /**
     * Sets input focus on the input control.
     */
    focus(): void;
  }
}
