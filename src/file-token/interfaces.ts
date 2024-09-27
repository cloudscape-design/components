// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseComponentProps } from '../internal/base-component';
import { NonCancelableEventHandler } from '../internal/events';

export interface FileTokenProps extends BaseComponentProps {
  /**
   * Specifies the current file.
   */
  file: File;

  /**
   *  Called when the user clicks on the dismiss button. The token won't be automatically removed.
   *  Make sure that you add a listener to this event to update your application state.
   */
  onDismiss: NonCancelableEventHandler<FileTokenProps.DismissDetail>;

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
   * Text that displays as a validation error message.
   */
  errorText?: React.ReactNode;

  /**
   * Text that displays as a validation warning message.
   */
  warningText?: React.ReactNode;

  /**
   * Displayed if the file is loading.
   */
  loading?: boolean;

  /**
   * An object containing all the localized strings required by the component:
   * * `removeFileAriaLabel` (function): A function to render the ARIA label for file token remove button.
   * * `errorIconAriaLabel` (string): The ARIA label to be shown on the error file icon.
   * * `warningIconAriaLabel` (string): The ARIA label to be shown on the warning file icon.
   * * `formatFileSize` (function): (Optional) A function that takes file size in bytes, and produces a formatted string.
   * * `formatFileLastModified` (function): (Optional) A function that takes the files last modified date, and produces a formatted string.
   */
  i18nStrings: FileTokenProps.I18nStrings;
}

export namespace FileTokenProps {
  export interface DismissDetail {
    file: File;
  }

  export interface I18nStrings {
    removeFileAriaLabel: (fileIndex: number) => string;
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
