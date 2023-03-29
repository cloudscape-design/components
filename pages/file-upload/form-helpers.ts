// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useEffect, useRef, useState } from 'react';
import { DummyServer } from './dummy-server';
import { FilesUploadState, formatFieldError, formatFileErrors, ValidationState } from './utils';

export interface FormFieldState<Value> {
  value: Value;
  error: null | string;
  onChange(newValue: Value, error: null | string): void;
}

export function useFormField<Value>(initialValue: Value): FormFieldState<Value> {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<null | string>(null);

  return {
    value,
    error,
    onChange(value, error) {
      setValue(value);
      setError(error);
    },
  };
}

export interface FileUploadServer {
  upload(
    files: File[],
    onProgress: (state: FilesUploadState) => void,
    onFinished: (state: FilesUploadState) => void
  ): void;
  cancel(): void;
}

export type UploadStatus = 'pending' | 'loading' | 'error' | 'ready';

interface FileUploadFormFieldProps {
  onUploadReady?(): void;
}

export interface FileUploadFormFieldState {
  value: File[];
  error: null | string;
  fileErrors: (null | string)[];
  uploadStatus: UploadStatus;
  progress: null | number[];
  onChange(newValue: File[], validation?: ValidationState, upload?: FileUploadServer): void;
  onUpload(server?: FileUploadServer): void;
  onCancelUpload(): void;
}

export function useFileUploadFormField({ onUploadReady }: FileUploadFormFieldProps = {}): FileUploadFormFieldState {
  const [value, setValue] = useState<File[]>([]);
  const [validationState, setValidationState] = useState(new ValidationState(0));
  const [serverState, setServerState] = useState(new FilesUploadState(0));
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('pending');
  const serverRef = useRef<null | FileUploadServer>(null);

  useEffect(() => {
    const server = serverRef.current;

    if (uploadStatus === 'loading' && server) {
      if (value.length > 0 && !validationState.hasError) {
        server.upload(value, setServerState, state => setUploadStatus(state.hasError ? 'error' : 'ready'));
      } else {
        setUploadStatus('pending');
      }
      return () => server.cancel();
    }
  }, [uploadStatus, value, validationState]);

  useEffect(
    () => {
      if (uploadStatus === 'ready') {
        onUploadReady?.();
      }
    },
    // eslint-disable-next-line
    [uploadStatus]
  );

  const onChange = useCallback((value: File[], validation?: ValidationState) => {
    serverRef.current?.cancel();
    setValue(value);
    setValidationState(validation ?? new ValidationState(value.length));
    setServerState(new FilesUploadState(value.length));
    setUploadStatus('pending');
  }, []);

  const onUpload = useCallback((server: FileUploadServer = new DummyServer()) => {
    serverRef.current?.cancel();
    serverRef.current = server;
    setUploadStatus('loading');
  }, []);

  const onCancelUpload = useCallback(() => {
    serverRef.current?.cancel();
    setServerState(new FilesUploadState(0));
    setUploadStatus('pending');
  }, []);

  return {
    value,
    error: formatFieldError(validationState) ?? formatFieldError(serverState),
    fileErrors: formatFileErrors(validationState.hasError ? validationState.fileErrors : serverState.fileErrors),
    uploadStatus,
    progress: value.length > 0 && !validationState.hasError ? serverState.progress : null,
    onChange,
    onUpload,
    onCancelUpload,
  };
}
