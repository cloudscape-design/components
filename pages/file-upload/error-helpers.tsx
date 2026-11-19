// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export interface FileUploadErrors {
  errorText: null | string;
  fileErrors: undefined | (null | string)[];
}

export function formatFileUploadError(errors: string[], fileErrors: string[][]): null | FileUploadErrors {
  const formattedError = formatFieldError(errors, fileErrors);
  const formattedFileErrors = formatFileErrors(fileErrors);
  return formattedError ? { errorText: formattedError, fileErrors: formattedFileErrors } : null;
}

function formatFieldError(errors: string[], fileErrors: string[][]): null | string {
  const filesWithErrors = fileErrors.filter(errors => errors.length > 0).length;

  const commonErrorText = errors.join(', ');
  const fileErrorsText =
    filesWithErrors === 0 ? '' : filesWithErrors === 1 ? '1 file has error(s)' : `${filesWithErrors} files have errors`;

  if (commonErrorText && fileErrorsText) {
    return `${commonErrorText}, and ${fileErrorsText}`;
  }
  if (commonErrorText) {
    return commonErrorText;
  }
  if (fileErrorsText) {
    return fileErrorsText;
  }
  return null;
}

function formatFileErrors(fileErrors: string[][]): undefined | (null | string)[] {
  const joined = fileErrors.map(errors => errors.join(', ') ?? null);
  return joined.filter(Boolean).length > 0 ? joined : undefined;
}
