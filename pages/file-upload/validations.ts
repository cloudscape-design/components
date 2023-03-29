// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from 'react';

export const SIZE = {
  KB: 1000,
  MB: 1000 ** 2,
};

export interface ValidationState {
  hasError: boolean;
  errors: string[];
  fileErrors: string[][];
}

export interface ServerUploadState {
  progress: number[];
  errors: string[];
  fileErrors: string[][];
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

export function validateDuplicateFileNames(files: File[]): null | string {
  const fileNames = files
    .map(file => file.name)
    .sort()
    .reduce((map, fileName) => map.set(fileName, (map.get(fileName) ?? 0) + 1), new Map<string, number>());
  const duplicateName = files.find(file => fileNames.get(file.name)! > 1)?.name;
  if (duplicateName !== undefined) {
    return `Files with duplicate names ("${duplicateName}") are not allowed`;
  }
  return null;
}

export function validateFileNameNotEmpty(file: File): null | string {
  if (file.name.split('.')[0].length === 0) {
    return 'Empty file name is not allowed.';
  }
  return null;
}

export function validateFileExtensions(file: File, extensions: string[]): null | string {
  const fileNameParts = file.name.split('.');
  const fileExtension = fileNameParts[fileNameParts.length - 1];
  if (!extensions.includes(fileExtension.toLowerCase())) {
    return `File is not supported. Allowed extensions are ${extensions.map(e => `"${e}"`).join(', ')}.`;
  }
  return null;
}

export function validateFileNamePattern(patten: RegExp, file: File) {
  if (!file.name.match(patten)) {
    return `File does not satisfy naming guidelines. Check "info" for details.`;
  }
  return null;
}

class DummyServer {
  private files: File[] = [];
  private progress: number[] = [];
  private errors: string[] = [];
  private fileErrors: string[][] = [];
  private timeout: null | ReturnType<typeof setTimeout> = null;

  upload(files: File[], onProgress: (progress: number[], errors: string[], fileErrors: string[][]) => void) {
    this.files = files;
    this.progress = files.map(() => 0);
    this.errors = [];
    this.fileErrors = files.map(() => []);

    let tick = 0;
    const totalSizeInBytes = files.reduce((sum, file) => sum + file.size, 0);
    const speedInBytes = totalSizeInBytes / 100;

    const upload = () => {
      tick += 1;

      setTimeout(() => {
        const progressIndex = this.progress.findIndex(p => p !== 100);
        if (progressIndex === -1) {
          return;
        }
        const fileToUpload = this.files[progressIndex];

        // Emulate errors.
        if (tick === 50) {
          if (Math.random() < 0.33) {
            this.errors = ['502: Cannot connect to the sever'];
            onProgress([...this.progress], [...this.errors], [...this.fileErrors]);
            return;
          }
          if (Math.random() < 0.5) {
            this.progress[progressIndex] = 100;
            this.fileErrors[progressIndex] = [
              ...this.fileErrors[progressIndex],
              `File "${fileToUpload.name}" is not accepted by server`,
            ];
            onProgress([...this.progress], [...this.errors], [...this.fileErrors]);
            upload();
            return;
          }
        }

        const nextFileProgressInBytes = (fileToUpload.size * this.progress[progressIndex]) / 100 + speedInBytes;
        const nextFileProgress = Math.min(100, 100 * (nextFileProgressInBytes / fileToUpload.size));
        this.progress[progressIndex] = nextFileProgress;
        onProgress([...this.progress], [...this.errors], [...this.fileErrors]);
        upload();
      }, 25);
    };

    upload();
  }

  cancel() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }
}

export function useFileUploadState() {
  const [files, setFiles] = useState<File[]>([]);
  const [validationState, setValidationState] = useState<ValidationState>({
    hasError: false,
    errors: [],
    fileErrors: [],
  });
  const [serverState, setServerState] = useState<ServerUploadState>({ progress: [], errors: [], fileErrors: [] });
  const [submitted, setSubmitted] = useState(false);

  const hasValidationErrors =
    !!validationState.errors.some(e => e.length) || validationState.fileErrors.some(e => e.length);

  useEffect(() => {
    if (submitted && files.length > 0 && !hasValidationErrors) {
      const server = new DummyServer();
      server.upload(files, (progress, errors, fileErrors) => setServerState({ progress, errors, fileErrors }));
      return () => server.cancel();
    }
  }, [submitted, files, hasValidationErrors]);

  const serverError = formatFieldError(serverState);
  const validationError = formatFieldError(validationState);
  const fileErrors = formatFileErrors(
    files.map((_file, index) => [...serverState.fileErrors[index], ...validationState.fileErrors[index]])
  );

  const success =
    submitted && serverState.progress.length !== 0 && serverState.progress.every(p => p === 100) && !serverError;

  return {
    files,
    progress: serverState.progress,
    serverError,
    validationError,
    fileErrors,
    submitted,
    success,
    onChange: (files: File[], validationState?: ValidationState) => {
      setFiles(files);
      setValidationState(validationState ?? { hasError: false, errors: [], fileErrors: files.map(() => []) });
      setServerState({ progress: files.map(() => 0), errors: [], fileErrors: files.map(() => []) });
      setSubmitted(false);
    },
    onSubmit: () => {
      setSubmitted(true);
    },
    onRefresh: () => {
      setFiles([...files]);
    },
  };
}

function formatFileSize(bytes: number): string {
  return bytes < SIZE.MB ? `${(bytes / SIZE.KB).toFixed(2)} KB` : `${(bytes / SIZE.MB).toFixed(2)} MB`;
}

function formatFieldError({ errors, fileErrors }: ValidationState | ServerUploadState) {
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

function formatFileErrors(fileErrors: string[][]) {
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
