// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseComponentProps } from '../internal/base-component';
import { FormFieldCommonValidationControlProps } from '../internal/context/form-field-context';
import { NonCancelableEventHandler } from '../internal/events';

export interface FileInputProps extends BaseComponentProps, FormFieldCommonValidationControlProps {
  /**
   * Variant of the file input. Defaults to "button".
   */
  variant?: 'button' | 'icon';

  /**
   * The label for the input.
   */
  ariaLabel?: string;

  /**
   * Specifies the native file input `accept` attribute to describe the allow-list of file types.
   */
  accept?: string;
  /**
   * Specifies whether to add aria-required to the file upload control.
   */
  ariaRequired?: boolean;
  /**
   * Specifies the native file input `multiple` attribute to allow users entering more than one file.
   */
  multiple?: boolean;
  /**
   * Called when the user selects new file(s), or removes a file.
   * The event `detail` contains the current value of the component.
   */
  onChange: NonCancelableEventHandler<FileInputProps.ChangeDetail>;
  //onChange: (files: File[]) => void;
  /**
   * Specifies the currently selected file(s).
   * If you want to clear the selection, use empty array.
   */
  value: ReadonlyArray<File>;
  /**
   * An object containing all the localized strings required by the component:
   * * `uploadButtonText` (function): A function to render the text of the file input button. It takes `multiple` attribute to define plurality.
   */
  i18nStrings: FileInputProps.I18nStrings;
}

export namespace FileInputProps {
  export interface ChangeDetail {
    value: File[];
  }

  export interface I18nStrings {
    uploadButtonText: (multiple: boolean) => string;
  }

  export interface Ref {
    /**
     * Sets focus on the file upload button.
     */
    focus(): void;
  }
}
