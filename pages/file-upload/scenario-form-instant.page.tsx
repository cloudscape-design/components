// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { Alert, Box, Button, Checkbox, FileUpload, FileUploadProps, Form, FormField, Header, Input } from '~components';
import SpaceBetween from '~components/space-between';
import { PageNotifications, useContractFilesForm } from './page-helpers';
import { i18nStrings } from './shared';
import { validateContractFiles, validateContractFilesInForm } from './validations';

export default function FileUploadScenarioFormInstant() {
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

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();

    const filesError = validateContractFilesInForm(formState.files);
    const nameError = formState.name.trim().length === 0 ? 'Name must not be empty' : '';

    formState.onSubmitForm(filesError, nameError);
  };

  return (
    <Box margin="xl">
      <SpaceBetween size="xl">
        <Header variant="h1">File upload scenario: In form with instant upload</Header>

        <Alert statusIconAriaLabel="Info" header="Scenario description">
          File upload is used in a form as one of two required files. The component supports synchronous client-side
          validation as per constraints. Additionally, the component imitates server-side validation triggered for image
          files. The upload and server-side validation is triggered upon files selection.
        </Alert>

        <PageNotifications status={formState.status} />

        <Checkbox checked={acceptMultiple} onChange={event => setAcceptMultiple(event.detail.checked)}>
          Accept multiple files
        </Checkbox>

        <form onSubmit={onSubmit}>
          <Form
            actions={
              <Button variant="primary" formAction="submit" loading={formState.status === 'uploading'}>
                Upload
              </Button>
            }
          >
            <SpaceBetween size="m">
              <FormField
                label={acceptMultiple ? 'Contracts' : 'Contract'}
                description={acceptMultiple ? 'Upload your contract with all amendments' : 'Upload your contract'}
              >
                <FileUpload
                  ref={contractsRef}
                  ariaRequired={true}
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

              <FormField label="Name" description="Enter your name" errorText={formState.nameError}>
                <Input
                  ariaRequired={true}
                  value={formState.name}
                  onChange={e => formState.onNameChange(e.detail.value)}
                />
              </FormField>
            </SpaceBetween>
          </Form>
        </form>
      </SpaceBetween>
    </Box>
  );
}
