// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { BaseComponentProps } from '../internal/base-component';
import { FormFieldValidationControlProps } from '../internal/context/form-field-context';
import { NonCancelableEventHandler } from '../internal/events';

export interface FileUploadProps extends BaseComponentProps, FormFieldValidationControlProps {
  /**
   * A string that defines the file types the file input should accept.
   * This string is a comma-separated list of unique file type specifiers.
   * Because a given file type may be identified in more than one manner,
   * it's useful to provide a thorough set of type specifiers when you need
   * files of a given format.
   */
  accept?: string;
  /**
   * Adds an aria-label to the native control.
   * Use this if you don't have a visible label for this control.
   */
  ariaLabel?: string;
  /**
   * Specifies whether to add aria-required to the native control.
   */
  ariaRequired?: boolean;
  /**
   * Text displayed in the button element.
   */
  buttonText: string;
  /**
   * Specifies if the control is disabled, which prevents the user from
   * modifying the value and prevents the value from being included in a
   * form submission. A disabled control can't receive focus.
   */
  disabled?: boolean;
  /**
   * Show file's MIME type in the token.
   * Default: `false`.
   */
  showFileType?: boolean;
  /**
   * Show file's size in the token.
   * Default: `false`.
   */
  showFileSize?: boolean;
  /**
   * Show file's last modified timestamp in the token.
   * Default: `false`.
   */
  showFileLastModified?: boolean;
  /**
   * Show file's thumbnail in the token. Use for multiple files upload case only. Only supported for images.
   * Default: `false`.
   */
  showFileThumbnail?: boolean;
  /**
   * Use to allow the selection of multiple files for upload from the
   * user's local drive. It uses tokens to display multiple files.
   * Files can be removed individually.
   */
  multiple?: boolean;
  /**
   * Called when the user selects a file.
   * The event detail contains the current value.
   * Not cancellable.
   */
  onChange?: NonCancelableEventHandler<FileUploadProps.ChangeDetail>;
  /**
   * Specifies the currently selected file(s).
   * If you want to clear the selection, use empty array.
   */
  value: File[];
  /**
   * An object containing all the localized strings required by the component.
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
    formatFileSize?: (sizeInBytes: number) => string;
    formatFileTimestamp?: (date: Date) => string;
    removeFileAriaLabel: string;
    activateFileNameEditAriaLabel: string;
    submitFileNameEditAriaLabel: string;
    cancelFileNameEditAriaLabel: string;
    editFileNameInputAriaLabel: string;
  }

  export interface Ref {
    /**
     * Sets focus on the upload button.
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
