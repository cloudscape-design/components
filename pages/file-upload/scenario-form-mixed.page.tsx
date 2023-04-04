// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useState } from 'react';
import { AppLayout, Button, Checkbox, FileUpload, Flashbar, Form, FormField, Header, Input } from '~components';
import SpaceBetween from '~components/space-between';
import { i18nStrings, validateContractFiles } from './shared';
import appLayoutLabels from '../app-layout/utils/labels';
import { Navigation } from '../app-layout/utils/content-blocks';
import { useFileUploadFormField, useFormField } from './form-helpers';
import { DummyServer } from './dummy-server';

const server = new DummyServer();

export default function FileUploadScenarioFormMixed() {
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Settings
  const [acceptMultiple, setAcceptMultiple] = useState(true);
  const [imitateServerFailure, setImitateServerFailure] = useState(false);
  const [imitateServerValidation, setImitateServerValidation] = useState(false);

  server.imitateServerError = imitateServerFailure;
  server.imitateServerFileError = imitateServerValidation;

  const onSuccess = useCallback(() => {
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  }, []);

  const contractsField = useFileUploadFormField({ onUploadReady: onSuccess });
  const nameField = useFormField('');

  const fileUpload = (
    <FormField
      label={acceptMultiple ? 'Contracts' : 'Contract'}
      description={acceptMultiple ? 'Upload your contract with all amendments' : 'Upload your contract'}
    >
      <FileUpload
        multiple={acceptMultiple}
        limit={3}
        value={contractsField.value}
        onChange={event => {
          const validation = validateContractFiles(event.detail.value);
          contractsField.onChange(event.detail.value, validation);
        }}
        accept="application/pdf, image/png, image/jpeg"
        showFileType={true}
        showFileSize={true}
        showFileLastModified={true}
        showFileThumbnail={true}
        i18nStrings={i18nStrings}
        errorText={contractsField.error}
        fileErrors={contractsField.fileErrors}
        constraintText="File size must not exceed 250 KB. Combined file size must not exceed 750 KB"
      />
    </FormField>
  );

  return (
    <AppLayout
      contentType="form"
      ariaLabels={appLayoutLabels}
      navigationOpen={navigationOpen}
      notifications={
        contractsField.uploadStatus === 'loading' ? (
          <Flashbar
            items={[{ type: 'info', loading: true, header: 'Uploading files', statusIconAriaLabel: 'loading' }]}
          />
        ) : (
          showSuccess && <Flashbar items={[{ type: 'success', header: 'Submitted', statusIconAriaLabel: 'success' }]} />
        )
      }
      stickyNotifications={true}
      onNavigationChange={event => setNavigationOpen(event.detail.open)}
      navigation={<Navigation />}
      content={
        <SpaceBetween size="xl">
          <Header variant="h1">File upload scenario: In form with mixed validation</Header>

          <SpaceBetween size="m" direction="horizontal">
            <Checkbox checked={acceptMultiple} onChange={event => setAcceptMultiple(event.detail.checked)}>
              Accept multiple files
            </Checkbox>
            <Checkbox checked={imitateServerFailure} onChange={event => setImitateServerFailure(event.detail.checked)}>
              Imitate server failure
            </Checkbox>
            <Checkbox
              checked={imitateServerValidation}
              onChange={event => setImitateServerValidation(event.detail.checked)}
            >
              Imitate server validation
            </Checkbox>
          </SpaceBetween>

          <form
            onSubmit={e => {
              e.preventDefault();

              const profileImageError = validateContractFiles(contractsField.value, true);
              const nameError = nameField.value.trim().length === 0 ? 'Name must not be empty' : '';

              profileImageError.error && contractsField.onChange(contractsField.value, profileImageError);
              nameError && nameField.onChange(nameField.value, nameError);

              if (!profileImageError.error && !nameError) {
                contractsField.onUpload(server);
              }
            }}
          >
            <Form
              actions={
                <Button variant="primary" formAction="submit" loading={contractsField.uploadStatus === 'loading'}>
                  Upload
                </Button>
              }
            >
              <SpaceBetween size="m">
                {fileUpload}

                <FormField label="Name" description="Enter your name" errorText={nameField.error}>
                  <Input
                    ariaRequired={true}
                    value={nameField.value}
                    onChange={e => nameField.onChange(e.detail.value, '')}
                  />
                </FormField>
              </SpaceBetween>
            </Form>
          </form>
        </SpaceBetween>
      }
    />
  );
}
