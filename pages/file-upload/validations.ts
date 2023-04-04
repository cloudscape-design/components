// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { formatFileSize, SIZE, ValidationState } from './utils';

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

export function validateContractFiles(files: File[], required = false): ValidationState {
  const state = new ValidationState(files.length);

  state.addError(required && files.length === 0 ? 'No files selected' : null);
  state.addError(validateTotalFileSize(files, 750 * SIZE.KB));

  state.addFileErrors(files, file => validateFileSize(file, 250 * SIZE.KB));

  return state;
}
