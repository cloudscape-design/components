// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { BaseComponentProps } from '../internal/base-component';
import { FormFieldValidationControlProps } from '../internal/context/form-field-context';
import { NonCancelableEventHandler } from '../internal/events';

export interface FileUploadProps extends BaseComponentProps, Omit<FormFieldValidationControlProps, 'warning'> {
  /**
   * Specifies the native file input `accept` attribute to describe the allow-list of file types.
   */
  accept?: string;
  /**
   * Specifies whether to add aria-required to the file upload control.
   */
  ariaRequired?: boolean;
  /**
   * Show file size in the token. Use `i18nStrings.formatFileSize` to customize it.
   */
  showFileSize?: boolean;
  /**
   * Show file last modified timestamp in the token. Use `i18nStrings.formatFileLastModified` to customize it.
   */
  showFileLastModified?: boolean;
  /**
   * Show file thumbnail in the token. Only supported for images.
   */
  showFileThumbnail?: boolean;
  /**
   * Specifies the native file input `multiple` attribute to allow users entering more than one file.
   */
  multiple?: boolean;
  /**
   * Called when the user selects new file(s), or removes a file.
   * The event `detail` contains the current value of the component.
   */
  onChange?: NonCancelableEventHandler<FileUploadProps.ChangeDetail>;
  /**
   * Specifies the currently selected file(s).
   * If you want to clear the selection, use empty array.
   */
  value: ReadonlyArray<File>;
  /**
   * Specifies the maximum number of displayed file tokens. If the property isn't set, all of the tokens are displayed.
   */
  tokenLimit?: number;
  /**
   * Constraint text that is displayed below the control. Use this to provide additional information about file size limit, etc.
   */
  constraintText?: React.ReactNode;
  /**
   * Text that displays as a validation message.
   */
  errorText?: React.ReactNode;
  /**
   * Text that displays as a non-blocking validation message.
   */
  warningText?: React.ReactNode;
  /**
   * An array of file errors corresponding to the files in the `value`.
   */
  fileErrors?: ReadonlyArray<null | string>;
  /**
   * An array of file warnings corresponding to the files in the `value`.
   */
  fileWarnings?: ReadonlyArray<null | string>;
  /**
   * An object containing all the localized strings required by the component:
   * * `uploadButtonText` (function): A function to render the text of the file upload button. It takes `multiple` attribute to define plurality.
   * * `dropzoneText` (function): A function to render the text shown in the dropzone. It takes `multiple` attribute to define plurality.
   * * `removeFileAriaLabel` (function): A function to render the ARIA label for file token remove button.
   * * `limitShowFewer` (string): The text of the show more tokens button.
   * * `limitShowMore` (string): The text of the show fewer tokens button.
   * * `errorIconAriaLabel` (string): The ARIA label to be shown on the error file icon.
   * * `warningIconAriaLabel` (string): The ARIA label to be shown on the warning file icon.
   * * `formatFileSize` (function): (Optional) A function that takes file size in bytes, and produces a formatted string.
   * * `formatFileLastModified` (function): (Optional) A function that takes the files last modified date, and produces a formatted string.
   */
  i18nStrings: FileUploadProps.I18nStrings;
}

export namespace FileUploadProps {
  export interface ChangeDetail {
    value: File[];
  }

  export interface DismissDetail {
    index: number;
    file: File;
  }

  export interface I18nStrings {
    uploadButtonText: (multiple: boolean) => string;
    dropzoneText: (multiple: boolean) => string;
    removeFileAriaLabel: (fileIndex: number) => string;
    limitShowFewer: string;
    limitShowMore: string;
    errorIconAriaLabel?: string;
    warningIconAriaLabel?: string;
    formatFileSize?: (sizeInBytes: number) => string;
    formatFileLastModified?: (date: Date) => string;
  }

  export interface Ref {
    /**
     * Sets focus on the file upload button.
     */
    focus(): void;
  }
}

export interface FileMetadata {
  showFileSize?: boolean;
  showFileLastModified?: boolean;
  showFileThumbnail?: boolean;
}
