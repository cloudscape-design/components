// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useState } from 'react';
import { AppLayout, Box, Checkbox, FileUpload, Flashbar, FormField, Header } from '~components';
import SpaceBetween from '~components/space-between';
import { i18nStrings } from './shared';
import appLayoutLabels from '../app-layout/utils/labels';
import { Navigation, Tools } from '../app-layout/utils/content-blocks';
import { useFileUploadFormField } from './form-helpers';
import { DummyServer } from './dummy-server';
import { validateContractFiles } from './validations';

const server = new DummyServer();

export default function FileUploadScenarioStandalone() {
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
          if (!validation?.hasError) {
            contractsField.onUpload(server);
          }
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
      tools={
        <Tools header="Contract files">
          <SpaceBetween size="s">
            <Box>
              Attach your contract and contract amendments as PDF files. The size of one file must not exceed 250 KB.
              The size of all attachments must not exceed 750 KB.
            </Box>
            <Box>The file name must follow the pattern (one of):</Box>
            <ul>
              <li>
                <Box variant="span" fontWeight="bold">
                  [your_id]_contract.pdf
                </Box>
              </li>
              <li>
                <Box variant="span" fontWeight="bold">
                  [your_id]_amendment_[#].pdf
                </Box>
              </li>
            </ul>
          </SpaceBetween>
        </Tools>
      }
      navigation={<Navigation />}
      content={
        <SpaceBetween size="xl">
          <Header variant="h1">File upload scenario: Standalone</Header>

          <SpaceBetween size="m" direction="vertical">
            <FormField label="File upload settings">
              <SpaceBetween size="s" direction="horizontal">
                <Checkbox checked={acceptMultiple} onChange={event => setAcceptMultiple(event.detail.checked)}>
                  Accept multiple files
                </Checkbox>
              </SpaceBetween>
            </FormField>

            <FormField label="Dummy server settings">
              <SpaceBetween size="s" direction="horizontal">
                <Checkbox
                  checked={imitateServerFailure}
                  onChange={event => setImitateServerFailure(event.detail.checked)}
                >
                  Imitate server failure
                </Checkbox>
                <Checkbox
                  checked={imitateServerValidation}
                  onChange={event => setImitateServerValidation(event.detail.checked)}
                >
                  Imitate server validation
                </Checkbox>
              </SpaceBetween>
            </FormField>
          </SpaceBetween>

          {fileUpload}
        </SpaceBetween>
      }
    />
  );
}
