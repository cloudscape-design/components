// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { FileUploadProps } from '~components';

export function formatFileUploadError(
  errors: string[],
  fileErrors: [File, string][]
): FileUploadProps.ValidationResult {
  const formattedError = formatFieldError(errors, fileErrors);
  const formattedFileErrors = formatFileErrors(fileErrors);
  return formattedError
    ? { valid: false, errorText: formattedError, fileErrors: formattedFileErrors }
    : { valid: true };
}

function formatFieldError(errors: string[], fileErrors: [File, string][]): null | string {
  const filesWithErrors = new Set(fileErrors.map(([file]) => file)).size;

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

function formatFileErrors(fileErrors: [File, string][]): [File, string][] | null {
  if (fileErrors.length === 0) {
    return null;
  }

  const byFile = fileErrors.reduce(
    (map, [file, error]) => map.set(file, [...(map.get(file) ?? []), error]),
    new Map<File, string[]>()
  );

  const formatted: [File, string][] = [...byFile.entries()].map(([file, errors]) => {
    if (errors.length === 1) {
      return [file, errors[0]];
    }
    if (errors.length === 2) {
      return [file, `${errors[0]}, and 1 more error`];
    }
    return [file, `${errors[0]}, and ${errors.length - 1} more errors`];
  });

  return formatted;
}
