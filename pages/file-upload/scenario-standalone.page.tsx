// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';
import { Box, Checkbox, FileUpload, FileUploadProps, FormField, Header } from '~components';
import SpaceBetween from '~components/space-between';
import { PageBanner, PageNotifications, useContractFilesForm } from './page-helpers';
import { i18nStrings } from './shared';
import { validateContractFiles } from './validations';

export default function FileUploadScenarioStandalone() {
  const ref = useRef<FileUploadProps.Ref>(null);
  const [acceptMultiple, setAcceptMultiple] = useState(true);
  const formState = useContractFilesForm();

  const validationErrors = validateContractFiles(formState.files);
  const componentErrors = !validationErrors.valid ? validationErrors : formState.fileErrors;

  const hasError = formState.status === 'error';
  useEffect(() => {
    ref.current?.focus();
  }, [hasError]);

  return (
    <Box margin="xl">
      <SpaceBetween size="xl">
        <Header variant="h1">File upload scenario: Standalone</Header>

        <PageBanner />

        <PageNotifications status={formState.status} />

        <Checkbox checked={acceptMultiple} onChange={event => setAcceptMultiple(event.detail.checked)}>
          Accept multiple files
        </Checkbox>

        <FormField
          label={acceptMultiple ? 'Contracts' : 'Contract'}
          description={acceptMultiple ? 'Upload your contract with all amendments' : 'Upload your contract'}
        >
          <FileUpload
            ref={ref}
            multiple={acceptMultiple}
            limit={3}
            value={formState.files}
            onChange={event => {
              formState.onFilesChange(event.detail.value);
              formState.onUploadFiles(validateContractFiles(event.detail.value).valid ? event.detail.value : []);
            }}
            isValueValid={validateContractFiles}
            accept="application/pdf, image/png, image/jpeg"
            showFileType={true}
            showFileSize={true}
            showFileLastModified={true}
            showFileThumbnail={true}
            i18nStrings={i18nStrings}
            {...componentErrors}
            constraintText="File size must not exceed 250 KB. Combined file size must not exceed 750 KB"
          />
        </FormField>
      </SpaceBetween>
    </Box>
  );
}
