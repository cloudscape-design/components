// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { BaseComponentProps } from '../internal/base-component';
import { FormFieldValidationControlProps } from '../internal/context/form-field-context';
import { NonCancelableEventHandler } from '../internal/events';

export interface FileUploadProps extends BaseComponentProps, FormFieldValidationControlProps {
  /**
   * Specifies the native file input `accept` attribute to describe the allow-list of file types.
   */
  accept?: string;
  /**
   * Specifies whether to add aria-required to the file upload control.
   */
  ariaRequired?: boolean;
  /**
   * Show file's MIME type in the token.
   * Default: `false`.
   */
  showFileType?: boolean;
  /**
   * Show file's size in the token. Use `i18nStrings.formatFileSize` to customize it.
   * Default: `false`.
   */
  showFileSize?: boolean;
  /**
   * Show file's last modified timestamp in the token. Use `i18nStrings.formatFileLastModified` to customize it.
   * Default: `false`.
   */
  showFileLastModified?: boolean;
  /**
   * Show file's thumbnail in the token. Use for multiple files upload case only. Only supported for images.
   * Default: `false`.
   */
  showFileThumbnail?: boolean;
  /**
   * Specifies the native file input `multiple` attribute to allow users entering more than one file.
   * When `multiple=false` but `value` contains more than one file only the first one will be displayed.
   * Default: `false`.
   */
  multiple?: boolean;
  /**
   * Called when the user selects new file(s) or removes a file.
   * The event `detail` contains the current value of the component.
   */
  onChange?: NonCancelableEventHandler<FileUploadProps.ChangeDetail>;
  /**
   * Specifies the currently selected file(s).
   * If you want to clear the selection, use empty array.
   */
  value: File[];
  /**
   * Specifies the maximum number of displayed file tokens. If the property isn't set, all of the tokens are displayed.
   */
  limit?: number;
  /**
   * An object containing all the localized strings required by the component:
   * * `uploadButtonText` (function): A function to render the text of the file upload button. It takes `multiple` attribute to define plurality.
   * * `removeFileAriaLabel` (string): The ARIA label for file token remove button.
   * * `activateFileNameEditAriaLabel` (string): The ARIA label for file token activate name edit button.
   * * `submitFileNameEditAriaLabel` (string): The ARIA label for file token submit name edit button.
   * * `cancelFileNameEditAriaLabel` (string): The ARIA label for file token cancel name edit button.
   * * `editFileNameInputAriaLabel` (string): The ARIA label for file token name edit input.
   * * `limitShowFewer` (string): The text of the show more tokens button.
   * * `limitShowMore` (string): The text of the show fewer tokens button.
   * * `formatFileSize` (function): (Optional) A function that takes file size in bytes and produces a formatted string.
   * * `formatFileLastModified` (function): (Optional) A function that takes file last modified date object and produces a formatted string.
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
    removeFileAriaLabel: string;
    activateFileNameEditAriaLabel: string;
    submitFileNameEditAriaLabel: string;
    cancelFileNameEditAriaLabel: string;
    editFileNameInputAriaLabel: string;
    limitShowFewer: string;
    limitShowMore: string;
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
  showFileType: boolean;
  showFileSize: boolean;
  showFileLastModified: boolean;
  showFileThumbnail: boolean;
}
