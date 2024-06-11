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
  BaseChangeDetail,
} from '../input/interfaces';
import { FormFieldValidationControlProps } from '../internal/context/form-field-context';
import { IconProps } from '../icon/interfaces';

export interface PromptInputProps
  extends BaseInputProps,
    InputKeyEvents,
    InputAutoCorrect,
    InputAutoComplete,
    InputSpellcheck,
    BaseComponentProps,
    FormFieldValidationControlProps {
  /**
   * Called whenever a user clicks the action button or presses the "Enter" key.
   * The event `detail` contains the current value of the field.
   */
  onAction?: NonCancelableEventHandler<PromptInputProps.ActionDetail>;

  actionButtonIconName?: IconProps.Name;

  /**
   * Adds an aria-label to the action button.
   * @i18n
   */
  actionButtonAriaLabel?: string;

  /**
   * Specifies whether to disable the action button.
   */
  disableActionButton?: boolean;

  /**
   * Specifies the minimum number of lines of text to set the height to.
   */
  minRows?: number;

  /**
   * Specifies the maximum number of lines of text the textarea will expand to.
   */
  maxRows?: number;
}

export namespace PromptInputProps {
  export type KeyDetail = BaseKeyDetail;
  export type ActionDetail = BaseChangeDetail;

  export interface Ref {
    /**
     * Sets input focus on the textarea control.
     */
    focus(): void;
  }
}
