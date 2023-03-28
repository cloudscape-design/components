// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

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

export function formatFileSize(bytes: number): string {
  return bytes < SIZE.MB ? `${(bytes / SIZE.KB).toFixed(2)} KB` : `${(bytes / SIZE.MB).toFixed(2)} MB`;
}
