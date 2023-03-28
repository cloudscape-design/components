// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from 'react';

export const SIZE = {
  KB: 1000,
  MB: 1000 ** 2,
};

export interface FileError {
  file: null | File;
  error: string;
}

export function validateFileSize(file: File, maxFileSize: number): null | string {
  if (file.size > maxFileSize) {
    return `File "${file.name}" size is above the allowed maximum (${formatFileSize(maxFileSize)})`;
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
    return `File "${file.name}" is not supported. Allowed extensions are ${extensions.map(e => `"${e}"`).join(', ')}.`;
  }
  return null;
}

export function validateFileNamePattern(patten: RegExp, file: File) {
  if (!file.name.match(patten)) {
    return `File "${file.name}" does not satisfy naming guidelines. Check "info" for details.`;
  }
  return null;
}

class DummyServer {
  private files: File[] = [];
  private progress: number[] = [];
  private globalError: null | string = null;
  private fileErrors: (null | string)[] = [];
  private timeout: null | ReturnType<typeof setTimeout> = null;

  upload(
    files: File[],
    onProgress: (progress: number[], globalError: null | string, fileErrors: (null | string)[]) => void
  ) {
    this.files = files;
    this.progress = files.map(() => 0);
    this.globalError = null;
    this.fileErrors = files.map(() => null);

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
            this.globalError = '502: Cannot connect to the sever';
            onProgress([...this.progress], this.globalError, [...this.fileErrors]);
            return;
          }
          if (Math.random() < 0.5) {
            this.progress[progressIndex] = 100;
            this.fileErrors[progressIndex] = `File "${fileToUpload.name}" is not accepted by server`;
            onProgress([...this.progress], this.globalError, [...this.fileErrors]);
            upload();
            return;
          }
        }

        const nextFileProgressInBytes = (fileToUpload.size * this.progress[progressIndex]) / 100 + speedInBytes;
        const nextFileProgress = Math.min(100, 100 * (nextFileProgressInBytes / fileToUpload.size));
        this.progress[progressIndex] = nextFileProgress;
        onProgress([...this.progress], this.globalError, [...this.fileErrors]);
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

export function useFileUploadState({ onSuccess }: { onSuccess: () => void }) {
  const [files, setFiles] = useState<File[]>([]);
  const [validationErrors, setValidationErrors] = useState<FileError[]>([]);
  const [serverState, setServerState] = useState<{
    progress: number[];
    globalError: null | string;
    fileErrors: (null | string)[];
  }>({
    progress: [],
    globalError: null,
    fileErrors: [],
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (submitted && files.length > 0 && validationErrors.length === 0) {
      const server = new DummyServer();
      server.upload(files, (progress, globalError, fileErrors) =>
        setServerState({ progress, globalError, fileErrors })
      );
      return () => server.cancel();
    }
  }, [submitted, files, validationErrors]);

  const emptySubmissionError = submitted && files.length === 0 ? 'No file(s) submitted' : null;

  const showSuccess =
    submitted &&
    serverState.progress.length !== 0 &&
    serverState.progress.every(p => p === 100) &&
    !serverState.globalError &&
    serverState.fileErrors.filter(Boolean).length === 0;

  useEffect(() => {
    if (showSuccess) {
      onSuccess();
    }
  }, [showSuccess, onSuccess]);

  return {
    files,
    progress: serverState.progress,
    serverError: serverState.globalError ?? serverState.fileErrors.find(e => e),
    validationError: emptySubmissionError ?? formatValidationFileErrors(validationErrors),
    submitted,
    onChange: (files: File[], validationErrors: FileError[]) => {
      setFiles(files);
      setValidationErrors(validationErrors);
      setServerState({ progress: files.map(() => 0), globalError: null, fileErrors: files.map(() => null) });
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

function formatValidationFileErrors(errors: FileError[]) {
  if (errors.length === 0) {
    return null;
  }
  if (errors.length === 1) {
    return errors[0].error;
  }
  if (errors.length === 2) {
    return `${errors[0].error}, and 1 more error`;
  }
  return `${errors[0].error}, and ${errors.length - 1} more errors`;
}
