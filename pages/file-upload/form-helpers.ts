// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useEffect, useRef, useState } from 'react';
import { DummyServer } from './dummy-server';
import { FileUploadError } from './error-helpers';

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
  upload(files: File[], onFinished: (state: FileUploadError) => void): void;
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
  onChange(newValue: File[], validation?: FileUploadError, upload?: FileUploadServer): void;
  onUpload(server?: FileUploadServer): void;
}

export function useFileUploadFormField({ onUploadReady }: FileUploadFormFieldProps = {}): FileUploadFormFieldState {
  const [value, setValue] = useState<File[]>([]);
  const [validationState, setValidationState] = useState<FileUploadError>({ error: null, fileErrors: [] });
  const [serverState, setServerState] = useState<FileUploadError>({ error: null, fileErrors: [] });
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('pending');
  const serverRef = useRef<null | FileUploadServer>(null);

  useEffect(() => {
    const server = serverRef.current;

    if (uploadStatus === 'loading' && server) {
      if (value.length > 0 && !validationState.error) {
        server.upload(value, state => {
          setServerState(state);
          setUploadStatus(state.error ? 'error' : 'ready');
        });
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

  const onChange = useCallback((value: File[], validation?: FileUploadError) => {
    serverRef.current?.cancel();
    setValue(value);
    setValidationState(validation ?? { error: null, fileErrors: [] });
    setServerState({ error: null, fileErrors: [] });
    setUploadStatus('pending');
  }, []);

  const onUpload = useCallback((server: FileUploadServer = new DummyServer()) => {
    serverRef.current?.cancel();
    serverRef.current = server;
    setUploadStatus('loading');
  }, []);

  return {
    value,
    error: validationState.error ?? serverState.error,
    fileErrors: validationState.fileErrors.some(Boolean) ? validationState.fileErrors : serverState.fileErrors,
    uploadStatus,
    onChange,
    onUpload,
  };
}
