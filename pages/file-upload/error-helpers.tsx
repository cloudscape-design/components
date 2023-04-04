// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export interface FileUploadError {
  error: null | string;
  fileErrors: (null | string)[];
}

export class FileUploadErrorState {
  errors: string[] = [];
  fileErrors: string[][] = [];

  constructor(filesCount: number) {
    this.fileErrors = [...Array(filesCount)].map(() => []);
  }

  addError(error: null | string) {
    if (error) {
      this.errors.push(error);
    }
  }

  addFileError(fileIndex: number, error: null | string) {
    if (error) {
      this.fileErrors[fileIndex] = [...this.fileErrors[fileIndex], error];
    }
  }

  addFileErrors(files: File[], validate: (file: File) => null | string) {
    for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
      this.addFileError(fileIndex, validate(files[fileIndex]));
    }
  }

  format(): FileUploadError {
    return { error: formatFieldError(this), fileErrors: formatFileErrors(this.fileErrors) };
  }
}

function formatFieldError({ errors, fileErrors }: FileUploadErrorState): null | string {
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

function formatFileErrors(fileErrors: string[][]): (null | string)[] {
  return fileErrors.map(errors => {
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
}
