// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import {
  BaseInputProps,
  InputAutoComplete,
  InputAutoCorrect,
  InputKeyEvents,
  InputSpellcheck,
} from '../input/interfaces';
import { BaseComponentProps } from '../types/base-component';
import { BaseKeyDetail } from '../types/events';
import { FormFieldValidationControlProps } from '../types/form-field';
/**
 * @awsuiSystem core
 */
import { NativeAttributes } from '../types/native-attributes';

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
   * Specifies the directions in which the user can resize the textarea:
   *
   * * `both` (default) - The user can change both the width and the height.
   * * `vertical` - The user can only change the height. Use this when the textarea
   *   is next to other content that a width change would disrupt.
   * * `horizontal` - The user can only change the width.
   * * `none` - The user can't resize the textarea. Longer content scrolls instead.
   *   Consider using the `rows` property to make the initial height fit the expected content.
   */
  resize?: TextareaProps.Resize;

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

  /**
   * An object containing CSS properties to customize the textarea's visual appearance.
   * Refer to the [style](/components/textarea/?tabId=style) tab for more details.
   * @awsuiSystem core
   */
  style?: TextareaProps.Style;
}

export namespace TextareaProps {
  export type KeyDetail = BaseKeyDetail;

  export type Resize = 'both' | 'horizontal' | 'vertical' | 'none';

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

  export interface Style {
    root?: {
      backgroundColor?: {
        default?: string;
        disabled?: string;
        focus?: string;
        hover?: string;
        readonly?: string;
      };
      borderColor?: {
        default?: string;
        disabled?: string;
        focus?: string;
        hover?: string;
        readonly?: string;
      };
      borderRadius?: string;
      borderWidth?: string;
      boxShadow?: {
        default?: string;
        disabled?: string;
        focus?: string;
        hover?: string;
        readonly?: string;
      };
      color?: {
        default?: string;
        disabled?: string;
        focus?: string;
        hover?: string;
        readonly?: string;
      };
      fontSize?: string;
      fontWeight?: string;
      paddingBlock?: string;
      paddingInline?: string;
    };
    placeholder?: {
      color?: string;
      fontSize?: string;
      fontStyle?: string;
      fontWeight?: string;
    };
  }
}
