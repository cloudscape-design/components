// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { FormFieldProps } from '../form-field/interfaces';
import { BaseComponentProps } from '../internal/base-component';
import { NonCancelableEventHandler } from '../internal/events';

export interface FileUploadProps extends BaseComponentProps, Omit<FormFieldProps, 'i18nStrings'> {
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
  value: ReadonlyArray<File>;
  /**
   * An array of file properties corresponding the `value` files.
   * Supported properties:
   * * `status` (string) - An enum of "success", "error" to represent the file status.
   */
  fileProps?: ReadonlyArray<FileUploadProps.FileProps>;
  /**
   * Specifies the maximum number of displayed file tokens. If the property isn't set, all of the tokens are displayed.
   */
  limit?: number;
  /**
   * // TODO: refine
   * An object containing all the localized strings required by the component:
   * * `uploadButtonText` (function): A function to render the text of the file upload button. It takes `multiple` attribute to define plurality.
   * * `removeFileAriaLabel` (function): A function to render the ARIA label for file token remove button.
   * * `limitShowFewer` (string): The text of the show more tokens button.
   * * `limitShowMore` (string): The text of the show fewer tokens button.
   * * `formatFileSize` (function): (Optional) A function that takes file size in bytes and produces a formatted string.
   * * `formatFileLastModified` (function): (Optional) A function that takes file last modified date object and produces a formatted string.
   */
  i18nStrings: FileUploadProps.I18nStrings;
}

export namespace FileUploadProps {
  export interface FileProps {
    status: 'success' | 'error';
  }

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
    removeFileAriaLabel: (file: File, fileIndex: number) => string;
    limitShowFewer: string;
    limitShowMore: string;
    // TODO: refine
    invalidStateIconAlt: string;
    errorIconAriaLabel?: string;
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
