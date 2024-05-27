// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseComponentProps } from '../internal/base-component';
import { BaseKeyDetail, NonCancelableEventHandler } from '../internal/events';
import {
  BaseInputProps,
  InputAutoCorrect,
  InputAutoComplete,
  InputKeyEvents,
  InputSpellcheck,
} from '../input/interfaces';
import { FormFieldValidationControlProps } from '../internal/context/form-field-context';

export interface PromptInputProps
  extends BaseInputProps,
    InputKeyEvents,
    InputAutoCorrect,
    InputAutoComplete,
    InputSpellcheck,
    BaseComponentProps,
    FormFieldValidationControlProps {
  /**
   * Called whenever a user clicks the send button or presses the "Enter" key.
   * The event `detail` contains the current value of the field.
   */
  onSend?: NonCancelableEventHandler<PromptInputProps.ChangeDetail>;

  /**
   * Specifies whether to disable the send button.
   */
  disableSendButton?: boolean;

  onHeightChange?: NonCancelableEventHandler<HeightChangeDetail>;

  /**
   * Specifies the minimum number of lines of text to set the height to.
   */
  minRows?: number;

  /**
   * Specifies the maximum number of lines of text the textarea will expand to.
   */
  maxRows?: number;

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
}

export interface HeightChangeDetail {
  height: number;
  rowHeight: number;
}

export namespace PromptInputProps {
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
