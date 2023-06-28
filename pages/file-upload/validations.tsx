// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { FileUploadErrors, formatFileUploadError } from './error-helpers';

const SIZE = {
  KB: 1000,
  MB: 1000 ** 2,
};

export function validateContractFiles(files: readonly File[]): null | FileUploadErrors {
  const errors: string[] = [];
  const fileErrors: string[][] = [];

  const addError = (error: null | string) => {
    if (error) {
      errors.push(error);
    }
  };

  const addFileErrors = (validate: (file: File) => null | string) => {
    for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
      const error = validate(files[fileIndex]);
      if (error) {
        fileErrors[fileIndex] = [...(fileErrors[fileIndex] ?? []), error];
      }
    }
  };

  addError(validateTotalFileSize(files, 1 * SIZE.MB));

  addFileErrors(file => validateFileSize(file, 500 * SIZE.KB));

  return formatFileUploadError(errors, fileErrors);
}

export function validateContractFilesInForm(files: File[]): null | FileUploadErrors {
  return files.length === 0 ? { errorText: 'No files selected', fileErrors: undefined } : validateContractFiles(files);
}

function formatFileSize(bytes: number): string {
  return bytes < SIZE.MB ? `${(bytes / SIZE.KB).toFixed(2)} KB` : `${(bytes / SIZE.MB).toFixed(2)} MB`;
}

function validateFileSize(file: File, maxFileSize: number): null | string {
  if (file.size > maxFileSize) {
    return `File size is above the allowed maximum (${formatFileSize(maxFileSize)})`;
  }
  return null;
}

function validateTotalFileSize(files: readonly File[], maxTotalSize: number): null | string {
  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  if (totalSize > maxTotalSize) {
    return `Files combined size (${formatFileSize(totalSize)}) is above the allowed maximum (${formatFileSize(
      maxTotalSize
    )})`;
  }
  return null;
}
