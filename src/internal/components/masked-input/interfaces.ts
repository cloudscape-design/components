// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseChangeDetail } from '../../../input/interfaces.js';
import { InternalInputProps } from '../../../input/internal.js';
import { BaseComponentProps } from '../../base-component';
import { FormFieldValidationControlProps } from '../../context/form-field-context.js';
import { MaskArgs } from './utils/mask-format.js';

export interface MaskedInputProps extends InternalInputProps, FormFieldValidationControlProps, BaseComponentProps {
  /**
   * Mask config definition to describe segments and separators
   */
  mask: MaskArgs;

  /**
   * Autofixes values provided to the Mask based on the minValue/maxValue specified in the mask.
   */
  autofix?: boolean;

  /**
   * Disable value autocompletion when input is blurred
   */
  disableAutocompleteOnBlur?: boolean;

  /**
   * When true, the provided value is shown as is, ignoring masking.
   * This is useful when rendering an alternative value when the input is not focused or disabled.
   */
  showUnmaskedValue?: boolean;
}

export namespace MaskedInputProps {
  export type ChangeDetail = BaseChangeDetail;
  export interface Ref {
    /**
     * Sets input focus onto the UI control.
     */
    focus(): void;
  }
}
