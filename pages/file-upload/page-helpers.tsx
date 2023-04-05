// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Box, Flashbar } from '~components';
import { FileUploadError, formatFileUploadError } from './error-helpers';

export interface FormFieldState<Value> {
  value: Value;
  error: null | string;
  onChange(newValue: Value, error: null | string): void;
}

export interface FileUploadServer {
  upload(files: File[], onFinished: (state: FileUploadError) => void): void;
  cancel(): void;
}

export type FormStatus = 'pending' | 'uploading' | 'uploaded' | 'error' | 'submitted';

export function PageBanner() {
  return <Box fontSize="body-s">Upload image files to imitate server validation.</Box>;
}

export function PageNotifications({ status }: { status: FormStatus }) {
  switch (status) {
    case 'uploading':
      return (
        <Flashbar
          items={[{ type: 'info', loading: true, header: 'Uploading files', statusIconAriaLabel: 'uploading' }]}
        />
      );
    case 'uploaded':
      return <Flashbar items={[{ type: 'success', header: 'Files uploaded', statusIconAriaLabel: 'uploaded' }]} />;
    case 'submitted':
      return (
        <Flashbar
          items={[
            { type: 'success', header: 'Files uploaded', statusIconAriaLabel: 'uploaded' },
            { type: 'success', header: 'Form submitted', statusIconAriaLabel: 'submitted' },
          ]}
        />
      );
    default:
      return null;
  }
}

export function useContractFilesForm() {
  const [formStatus, setFormStatus] = useState<FormStatus>('pending');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState<File[]>([]);
  const [fileErrors, setFileErrors] = useState<null | FileUploadError>(null);
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState<null | string>(null);
  const uploadTimeoutRef = useRef<null | ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    if (uploadingFiles.length === 0) {
      return;
    }

    let tick = 0;

    const upload = () => {
      uploadTimeoutRef.current = setTimeout(() => {
        tick++;

        if (tick === 100 && uploadingFiles.some(isImage)) {
          setFileErrors(
            formatFileUploadError(
              [],
              uploadingFiles.map(file => (isImage(file) ? ['File is not accepted by server'] : []))
            )
          );
          setFormStatus('error');
        } else if (tick === 100) {
          setFormStatus('uploaded');
        } else {
          upload();
        }
      }, 20);
    };

    upload();

    const timeoutRef = uploadTimeoutRef.current;
    return () => {
      timeoutRef && clearTimeout(timeoutRef);
    };
  }, [uploadingFiles]);

  return {
    status: formSubmitted && !fileErrors && !nameError ? 'submitted' : formStatus,
    files,
    fileErrors,
    name,
    nameError,
    onFilesChange(files: File[], validation: null | FileUploadError = null) {
      setFiles(files);
      setFormSubmitted(false);
      setFileErrors(validation);
    },
    onNameChange(name: string, validation: null | string = null) {
      setName(name);
      setNameError(validation);
      setFormSubmitted(false);
    },
    onUploadFiles(files: File[]) {
      setUploadingFiles(files);
    },
    onSubmitForm(filesError: null | FileUploadError, nameError: null | string) {
      setFileErrors(filesError);
      setNameError(nameError);
      setFormSubmitted(!fileErrors && !nameError);
    },
  };
}

function isImage(file: File) {
  return !!file.type && file.type.split('/')[0] === 'image';
}

const SIZE = {
  KB: 1000,
  MB: 1000 ** 2,
};

function formatFileSize(bytes: number): string {
  return bytes < SIZE.MB ? `${(bytes / SIZE.KB).toFixed(2)} KB` : `${(bytes / SIZE.MB).toFixed(2)} MB`;
}

function validateFileSize(file: File, maxFileSize: number): null | string {
  if (file.size > maxFileSize) {
    return `File size is above the allowed maximum (${formatFileSize(maxFileSize)})`;
  }
  return null;
}

function validateTotalFileSize(files: File[], maxTotalSize: number): null | string {
  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  if (totalSize > maxTotalSize) {
    return `Files combined size (${formatFileSize(totalSize)}) is above the allowed maximum (${formatFileSize(
      maxTotalSize
    )})`;
  }
  return null;
}

export function validateContractFiles(files: File[], required = false): null | FileUploadError {
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
        fileErrors[fileIndex] = [...fileErrors[fileIndex], error];
      }
    }
  };

  addError(required && files.length === 0 ? 'No files selected' : null);
  addError(validateTotalFileSize(files, 750 * SIZE.KB));

  addFileErrors(file => validateFileSize(file, 250 * SIZE.KB));

  return formatFileUploadError(errors, fileErrors);
}
