// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';

import { Box, Checkbox, FileInput, FileUploadProps, FormField, Header } from '~components';
import SpaceBetween from '~components/space-between';

import { PageNotifications, useContractFilesForm } from './page-helpers';
import { i18nStrings } from './shared';
import { validateContractFiles } from './validations';

export default function FileUploadScenarioStandalone() {
  const contractsRef = useRef<FileUploadProps.Ref>(null);
  const [acceptMultiple, setAcceptMultiple] = useState(true);
  const formState = useContractFilesForm();

  // const contractsValidationErrors = validateContractFiles(formState.files);
  // const contractsErrors = contractsValidationErrors ?? formState.fileErrors;

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
        <Header variant="h1">File upload: deconstructed</Header>

        <PageNotifications status={formState.status} />

        <Checkbox checked={acceptMultiple} onChange={event => setAcceptMultiple(event.detail.checked)}>
          Accept multiple files
        </Checkbox>

        <FormField
          label={acceptMultiple ? 'Contracts' : 'Contract'}
          description={acceptMultiple ? 'Upload your contract with all amendments' : 'Upload your contract'}
        >
          <FileInput
            ref={contractsRef}
            multiple={acceptMultiple}
            value={formState.files}
            onChange={handleFilesChange}
            accept="application/pdf, image/png, image/jpeg"
            i18nStrings={i18nStrings}
          />
        </FormField>

        <div>{formState.files.map(file => file.name)}</div>
      </SpaceBetween>
    </Box>
  );
}
