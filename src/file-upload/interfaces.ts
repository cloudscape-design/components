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
   * File metadata helps the user to validate and compare the files selected.
   * Choose the most relevant file metadata to display, based on your use case.
   */
  fileMetadata?: FileUploadProps.FileMetadata;
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
   * If you want to clear the selection, use null.
   */
  value: FileUploadProps.FileType;
}

export namespace FileUploadProps {
  export type FileType = File | File[] | null;

  export interface ChangeDetail {
    value: FileType;
  }

  export interface DismissDetail {
    index: number;
    file: File;
  }

  export type FileSize = 'BYTES' | 'KB' | 'KIB' | 'MB' | 'MIB' | 'GB' | 'GIB';

  export interface FileMetadata {
    /**
     * Show each file name.
     * Default: true
     */
    name?: boolean;
    /**
     * Show the file MIME type.
     * Default: false
     */
    type?: boolean;
    /**
     * Show file size expressed in bytes, KB, MB, GB, KiB, MiB, or GiB.
     * Default: 'bytes'
     */
    size?: FileSize;
    /**
     * Show the file last modified date.
     * Default: false
     */
    lastModified?: boolean;
    lastModifiedLocale?: string;
    /**
     * Show file thumbnail in multiple files upload case only.
     * Default: false
     */
    thumbnail?: boolean;
  }
}
