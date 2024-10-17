// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';

import {
  Box,
  Checkbox,
  Container,
  FileDropzone,
  FileInput,
  FileUploadProps,
  Header,
  SpaceBetween,
  Table,
} from '~components';

import { useContractFilesForm } from '../file-upload/page-helpers';
import { validateContractFiles } from '../file-upload/validations';

export default function FileUploadScenarioStandalone() {
  const contractsRef = useRef<FileUploadProps.Ref>(null);

  const [acceptMultiple, setAcceptMultiple] = useState(true);
  const formState = useContractFilesForm();

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

  return (
    <Box margin="xl">
      <SpaceBetween size="xl">
        <Header variant="h1">File dropzone: in container</Header>

        <Checkbox checked={acceptMultiple} onChange={(event: any) => setAcceptMultiple(event.detail.checked)}>
          Accept multiple files
        </Checkbox>
        <Container header={<Header>Attachments</Header>}>
          <SpaceBetween size="l">
            <FileDropzone onChange={(event: any) => handleFilesChange(event.detail.value)}>
              <FileInput
                onChange={(event: any) => handleFilesChange(event.detail.value)}
                value={formState.files}
                i18nStrings={{ uploadButtonText: (multiple: boolean) => (multiple ? 'Choose files' : 'Choose file') }}
                multiple={acceptMultiple}
              />
              <Box padding={{ top: 'xxs' }} fontWeight="bold" color="text-body-secondary">
                {acceptMultiple ? 'or drop files here' : 'or drop file here'}
              </Box>
            </FileDropzone>
            <Table
              variant="embedded"
              empty={'No files uploaded'}
              columnDefinitions={[
                {
                  id: 'file-name',
                  header: 'File name',
                  cell: item => item.name || '-',
                  sortingField: 'name',
                  isRowHeader: true,
                },
                {
                  id: 'file-type',
                  header: 'File type',
                  cell: item => item.type || '-',
                  sortingField: 'alt',
                },
                {
                  id: 'file-size',
                  header: 'File size',
                  cell: item => item.size || '-',
                },
              ]}
              enableKeyboardNavigation={true}
              items={formState.files.map(file => ({
                name: file.name,
                type: file.type,
                size: file.size,
              }))}
              loadingText="Loading resources"
              sortingDisabled={true}
            />
          </SpaceBetween>
        </Container>
      </SpaceBetween>
    </Box>
  );
}
