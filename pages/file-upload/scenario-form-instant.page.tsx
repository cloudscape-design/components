// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { Box, Button, Checkbox, FileUpload, Form, FormField, Header, Input } from '~components';
import SpaceBetween from '~components/space-between';
import { PageBanner, PageNotifications, useContractFilesForm, validateContractFiles } from './page-helpers';
import { i18nStrings } from './shared';

export default function FileUploadScenarioFormInstant() {
  const [acceptMultiple, setAcceptMultiple] = useState(true);
  const formState = useContractFilesForm();

  return (
    <Box margin="xl">
      <SpaceBetween size="xl">
        <Header variant="h1">File upload scenario: In form with instant upload</Header>

        <PageBanner />

        <PageNotifications status={formState.status} />

        <Checkbox checked={acceptMultiple} onChange={event => setAcceptMultiple(event.detail.checked)}>
          Accept multiple files
        </Checkbox>

        <form
          onSubmit={e => {
            e.preventDefault();

            const filesError = validateContractFiles(formState.files, true);
            const nameError = formState.name.trim().length === 0 ? 'Name must not be empty' : '';

            formState.onSubmitForm(filesError, nameError);
          }}
        >
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
                  multiple={acceptMultiple}
                  limit={3}
                  value={formState.files}
                  onChange={event => {
                    const validation = validateContractFiles(event.detail.value);
                    formState.onFilesChange(event.detail.value, validation);
                    formState.onUploadFiles(!validation ? event.detail.value : []);
                  }}
                  accept="application/pdf, image/png, image/jpeg"
                  showFileType={true}
                  showFileSize={true}
                  showFileLastModified={true}
                  showFileThumbnail={true}
                  i18nStrings={i18nStrings}
                  {...formState.fileErrors}
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
