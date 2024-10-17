// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';

import {
  Box,
  Checkbox,
  FileDropzone,
  FileInput,
  FileTokenGroup,
  FileUploadProps,
  FormField,
  Header,
  Icon,
} from '~components';
import SpaceBetween from '~components/space-between';

import { useContractFilesForm } from './page-helpers';
import { i18nStrings } from './shared';
import { useDropzoneVisible } from './use-dropzone-visible';
import { validateContractFiles } from './validations';

export default function FileUploadScenarioStandalone() {
  const contractsRef = useRef<FileUploadProps.Ref>(null);

  const [acceptMultiple, setAcceptMultiple] = useState(true);
  const [verticalAlign, setVerticalAlign] = useState(false);
  const formState = useContractFilesForm();

  const isFileBeingDragged = useDropzoneVisible(acceptMultiple);

  const contractsValidationErrors = validateContractFiles(formState.files);
  const contractsErrors = contractsValidationErrors ?? formState.fileErrors;

  const hasError = formState.status === 'error';
  useEffect(() => {
    if (hasError) {
      contractsRef.current?.focus();
    }
  }, [hasError]);

  const handleFilesChange = (newFiles: File[]) => {
    const newValue = acceptMultiple ? [...formState.files, ...newFiles] : newFiles[0] ? newFiles : [...formState.files];
    formState.onFilesChange(newValue);
    formState.onUploadFiles(!validateContractFiles(newValue) ? newValue : []);
  };

  const onDismiss = (event: { detail: { fileIndex: number } }) => {
    const newItems = [...formState.files];
    newItems.splice(event.detail.fileIndex, 1);
    formState.onFilesChange(newItems);
  };

  return (
    <Box margin="xl">
      <SpaceBetween size="xl">
        <Header
          variant="h1"
          description="This is the same as the file upload - standalone test page, but made with the deconstructed file upload components."
        >
          File upload: deconstructed
        </Header>

        <Checkbox checked={acceptMultiple} onChange={(event: any) => setAcceptMultiple(event.detail.checked)}>
          Accept multiple files
        </Checkbox>
        <Checkbox checked={verticalAlign} onChange={(event: any) => setVerticalAlign(event.detail.checked)}>
          Vertical alignment
        </Checkbox>

        <FormField
          label={acceptMultiple ? 'Contracts' : 'Contract'}
          description={acceptMultiple ? 'Upload your contract with all amendments' : 'Upload your contract'}
          constraintText="File size must not exceed 250 KB. Combined file size must not exceed 750 KB"
          errorText={contractsErrors?.errorText}
        >
          {isFileBeingDragged ? (
            <FileDropzone onChange={(event: any) => handleFilesChange(event.detail.value)}>
              <SpaceBetween size="xs" alignItems="center">
                <Icon name="upload" />
                Drop files here
              </SpaceBetween>
            </FileDropzone>
          ) : (
            <FileInput
              ref={contractsRef}
              multiple={acceptMultiple}
              value={formState.files}
              onChange={(event: any) => handleFilesChange(event.detail.value)}
              //   accept="application/pdf, image/*"
              i18nStrings={i18nStrings}
            />
          )}
        </FormField>

        <FileTokenGroup
          alignment={verticalAlign ? 'vertical' : 'horizontal'}
          items={formState.files.map((file, index) => ({
            file,
            loading: formState.status === 'uploading',
            errorText: contractsErrors?.fileErrors?.[index] === null ? undefined : contractsErrors?.fileErrors?.[index],
          }))}
          showFileLastModified={true}
          showFileSize={true}
          showFileThumbnail={true}
          i18nStrings={i18nStrings}
          onDismiss={onDismiss}
        />
      </SpaceBetween>
    </Box>
  );
}
