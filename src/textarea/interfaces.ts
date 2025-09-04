// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import {
  BaseInputProps,
  InputAutoComplete,
  InputAutoCorrect,
  InputKeyEvents,
  InputSpellcheck,
} from '../input/interfaces';
import { BaseComponentProps } from '../internal/base-component';
import { FormFieldValidationControlProps } from '../internal/context/form-field-context';
import { BaseKeyDetail } from '../internal/events';
/**
 * @awsuiSystem core
 */
import { NativeAttributes } from '../internal/utils/with-native-attributes';

export interface TextareaProps
  extends Omit<BaseInputProps, 'nativeInputAttributes'>,
    InputKeyEvents,
    InputAutoCorrect,
    InputAutoComplete,
    InputSpellcheck,
    BaseComponentProps,
    FormFieldValidationControlProps {
  /**
   * Specifies the number of lines of text to set the height to.
   */
  rows?: number;

  /**
   * Specifies whether to disable browser spellcheck feature.
   * If you set this to `true`, it disables native browser capability
   * that checks for spelling/grammar errors.
   * If you don't set it, the behavior follows the default behavior
   * of the user's browser.
   *
   * @deprecated Use the `spellcheck` property instead.
   */
  disableBrowserSpellcheck?: boolean;

  /**
   * Attributes to add to the native `textarea` element.
   * Some attributes will be automatically combined with internal attribute values:
   * - `className` will be appended.
   * - Event handlers will be chained, unless the default is prevented.
   *
   * We do not support using this attribute to apply custom styling.
   *
   * @awsuiSystem core
   */
  nativeTextareaAttributes?: NativeAttributes<React.TextareaHTMLAttributes<HTMLTextAreaElement>>;
}

export namespace TextareaProps {
  export type KeyDetail = BaseKeyDetail;

  export interface ChangeDetail {
    /**
     * The new value of this textarea.
     */
    value: string;
  }
  export interface Ref {
    /**
     * Sets input focus on the textarea control.
     */
    focus(): void;
  }
}
