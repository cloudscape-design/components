// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { FileUploadProps, Flashbar } from '~components';
import { FileUploadError, FileUploadErrorState } from './error-helpers';

export type NotificationType = null | 'uploading' | 'uploaded' | 'submitted' | 'upload-error';

export const SIZE = {
  KB: 1000,
  MB: 1000 ** 2,
};

export function formatFileSize(bytes: number): string {
  return bytes < SIZE.MB ? `${(bytes / SIZE.KB).toFixed(2)} KB` : `${(bytes / SIZE.MB).toFixed(2)} MB`;
}

export function validateFileSize(file: File, maxFileSize: number): null | string {
  if (file.size > maxFileSize) {
    return `File size is above the allowed maximum (${formatFileSize(maxFileSize)})`;
  }
  return null;
}

export function validateTotalFileSize(files: File[], maxTotalSize: number): null | string {
  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  if (totalSize > maxTotalSize) {
    return `Files combined size (${formatFileSize(totalSize)}) is above the allowed maximum (${formatFileSize(
      maxTotalSize
    )})`;
  }
  return null;
}

export function validateContractFiles(files: File[], required = false): FileUploadError {
  const state = new FileUploadErrorState(files.length);

  state.addError(required && files.length === 0 ? 'No files selected' : null);
  state.addError(validateTotalFileSize(files, 750 * SIZE.KB));

  state.addFileErrors(files, file => validateFileSize(file, 250 * SIZE.KB));

  return state.format();
}

export const i18nStrings: FileUploadProps.I18nStrings = {
  uploadButtonText: multiple => (multiple ? 'Choose files' : 'Choose file'),
  dropzoneText: multiple => (multiple ? 'Drop files to upload' : 'Drop file to upload'),
  removeFileAriaLabel: (_file, fileIndex) => `Remove file ${fileIndex + 1}`,
  limitShowFewer: 'Show fewer files',
  limitShowMore: 'Show more files',
  errorIconAriaLabel: 'Error',
};

export function Notifications({ type }: { type: NotificationType }) {
  switch (type) {
    case 'uploading':
      return (
        <Flashbar
          items={[{ type: 'info', loading: true, header: 'Uploading files', statusIconAriaLabel: 'uploading' }]}
        />
      );
    case 'uploaded':
      return <Flashbar items={[{ type: 'success', header: 'Files uploaded', statusIconAriaLabel: 'uploaded' }]} />;
    case 'submitted':
      return (
        <Flashbar
          items={[
            { type: 'success', header: 'Files uploaded', statusIconAriaLabel: 'uploaded' },
            { type: 'success', header: 'Form submitted', statusIconAriaLabel: 'submitted' },
          ]}
        />
      );
    case 'upload-error':
      return (
        <Flashbar
          items={[{ type: 'error', header: '502: Cannot connect to the sever', statusIconAriaLabel: 'error' }]}
        />
      );
    default:
      return null;
  }
}
