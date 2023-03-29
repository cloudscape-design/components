// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export const SIZE = {
  KB: 1000,
  MB: 1000 ** 2,
};

export class ValidationState {
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

  get hasError() {
    return this.errors.length > 0 || this.fileErrors.flatMap(e => e).length > 0;
  }
}

export class FilesUploadState extends ValidationState {
  progress: number[] = [];

  constructor(filesCount: number) {
    super(filesCount);
    this.progress = [...Array(filesCount)].map(() => 0);
  }

  setProgress(fileIndex: number, progress: number) {
    this.progress[fileIndex] = progress;
  }

  clone(): FilesUploadState {
    const clone = new FilesUploadState(this.progress.length);
    clone.progress = [...this.progress];
    clone.errors = [...this.errors];
    clone.fileErrors = [...this.fileErrors];
    return clone;
  }
}

export function formatFileSize(bytes: number): string {
  return bytes < SIZE.MB ? `${(bytes / SIZE.KB).toFixed(2)} KB` : `${(bytes / SIZE.MB).toFixed(2)} MB`;
}

export function formatFieldError({ errors, fileErrors }: ValidationState | FilesUploadState) {
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

export function formatFileErrors(fileErrors: string[][]) {
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
