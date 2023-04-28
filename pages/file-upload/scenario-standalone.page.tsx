// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Box, Checkbox, FileUpload, FileUploadProps, FormField, Header } from '~components';
import SpaceBetween from '~components/space-between';
import { PageNotifications, useContractFilesForm } from './page-helpers';
import { i18nStrings } from './shared';
import { validateContractFiles } from './validations';

export default function FileUploadScenarioStandalone() {
  const contractsRef = useRef<FileUploadProps.Ref>(null);
  const [acceptMultiple, setAcceptMultiple] = useState(true);
  const formState = useContractFilesForm();

  const contractsValidationErrors = validateContractFiles(formState.files);
  const contractsErrors = contractsValidationErrors ?? formState.fileErrors;

  const hasError = formState.status === 'error';
  useEffect(() => {
    if (hasError) {
      contractsRef.current?.focus();
    }
  }, [hasError]);

  return (
    <Box margin="xl">
      <SpaceBetween size="xl">
        <Header variant="h1">File upload scenario: Standalone</Header>

        <Alert statusIconAriaLabel="Info" header="Scenario description">
          File upload is used as a standalone component. It supports synchronous client-side validation as per
          constraints. Additionally, the component imitates server-side validation triggered for image files.
        </Alert>

        <PageNotifications status={formState.status} />

        <Checkbox checked={acceptMultiple} onChange={event => setAcceptMultiple(event.detail.checked)}>
          Accept multiple files
        </Checkbox>

        <FormField
          label={acceptMultiple ? 'Contracts' : 'Contract'}
          description={acceptMultiple ? 'Upload your contract with all amendments' : 'Upload your contract'}
        >
          <FileUpload
            ref={contractsRef}
            multiple={acceptMultiple}
            tokenLimit={3}
            value={formState.files}
            onChange={event => {
              formState.onFilesChange(event.detail.value);
              formState.onUploadFiles(!validateContractFiles(event.detail.value) ? event.detail.value : []);
            }}
            accept="application/pdf, image/png, image/jpeg"
            showFileSize={true}
            showFileLastModified={true}
            showFileThumbnail={true}
            i18nStrings={i18nStrings}
            {...contractsErrors}
            constraintText="File size must not exceed 250 KB. Combined file size must not exceed 750 KB"
          />
        </FormField>
      </SpaceBetween>
    </Box>
  );
}
