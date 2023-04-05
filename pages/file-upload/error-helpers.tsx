// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export interface FileUploadError {
  error: null | string;
  fileErrors?: (null | string)[];
}

export function formatFileUploadError(errors: string[], fileErrors: string[][]): null | FileUploadError {
  const formattedError = formatFieldError(errors, fileErrors);
  const formattedFileErrors = formatFileErrors(fileErrors);
  return formattedError ? { error: formattedError, fileErrors: formattedFileErrors } : null;
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

function formatFileErrors(fileErrors: string[][]): (null | string)[] | undefined {
  const formatted = fileErrors.map(errors => {
    if (errors.length === 0) {
      return null;
    }
    if (errors.length === 1) {
      return errors[0];
    }
    if (errors.length === 2) {
      return `${errors[0]}, and 1 more error`;
    }
    return `${errors[0]}, and ${errors.length - 1} more errors`;
  });

  return formatted.some(Boolean) ? formatted : undefined;
}
