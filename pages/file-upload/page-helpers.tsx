// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { useEffect, useState } from 'react';
import { Flashbar } from '~components';
import { FileUploadErrors, formatFileUploadError } from './error-helpers';

export interface FormFieldState<Value> {
  value: Value;
  error: null | string;
  onChange(newValue: Value, error: null | string): void;
}

export interface FileUploadServer {
  upload(files: File[], onFinished: (state: FileUploadErrors) => void): void;
  cancel(): void;
}

export type FormStatus = 'pending' | 'uploading' | 'uploaded' | 'error' | 'submitted';

export function PageNotifications({ status }: { status: FormStatus }) {
  switch (status) {
    case 'uploading':
      return (
        <Flashbar
          items={[
            {
              type: 'info',
              loading: true,
              header: 'Uploading files',
              statusIconAriaLabel: 'uploading',
              ariaRole: 'status',
            },
          ]}
        />
      );
    case 'uploaded':
      return (
        <Flashbar
          items={[{ type: 'success', header: 'Files uploaded', statusIconAriaLabel: 'uploaded', ariaRole: 'status' }]}
        />
      );
    case 'submitted':
      return (
        <Flashbar
          items={[{ type: 'success', header: 'Form submitted', statusIconAriaLabel: 'submitted', ariaRole: 'status' }]}
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
  const [fileErrors, setFileErrors] = useState<null | FileUploadErrors>(null);
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState<null | string>(null);

  useEffect(() => {
    if (uploadingFiles.length === 0) {
      setFormStatus('pending');
      return;
    }

    setFormStatus('uploading');

    const timeout = setTimeout(() => {
      if (uploadingFiles.some(isImage)) {
        setFileErrors(
          formatFileUploadError(
            [],
            uploadingFiles.map(file => (isImage(file) ? ['File was not accepted by server'] : []))
          )
        );
        setFormStatus('error');
      } else {
        setFormStatus('uploaded');
      }
    }, 2000);

    return () => {
      clearTimeout(timeout);
    };
  }, [uploadingFiles]);

  return {
    status: formSubmitted && formStatus !== 'uploading' && !fileErrors && !nameError ? 'submitted' : formStatus,
    files,
    fileErrors,
    name,
    nameError,
    onFilesChange(files: File[]) {
      setFiles(files);
      setFormSubmitted(false);
      setFileErrors(null);
    },
    onNameChange(name: string) {
      setName(name);
      setFormSubmitted(false);
      setNameError(null);
    },
    onUploadFiles(files: File[]) {
      setUploadingFiles(files);
    },
    onSubmitForm(filesError: null | FileUploadErrors, nameError: null | string) {
      setFileErrors(filesError);
      setNameError(nameError);
      setFormSubmitted(!fileErrors && !nameError);
    },
  };
}

function isImage(file: File) {
  return file.type.startsWith('image/');
}
