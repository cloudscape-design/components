// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { Box, Checkbox, FileUpload, FormField, Header } from '~components';
import SpaceBetween from '~components/space-between';
import { i18nStrings, Notifications, NotificationType, validateContractFiles } from './shared';
import { useFileUploadFormField } from './form-helpers';
import { DummyServer } from './dummy-server';

const server = new DummyServer();

export default function FileUploadScenarioStandalone() {
  const [notificationType, setNotificationType] = useState<NotificationType>(null);

  // Settings
  const [acceptMultiple, setAcceptMultiple] = useState(true);
  const [imitateServerFailure, setImitateServerFailure] = useState(false);
  const [imitateServerValidation, setImitateServerValidation] = useState(false);

  server.imitateServerError = imitateServerFailure;
  server.imitateServerFileError = imitateServerValidation;

  const contractsField = useFileUploadFormField({ onUploadReady: () => setNotificationType('uploaded') });

  return (
    <Box margin="xl">
      <SpaceBetween size="xl">
        <Header variant="h1">File upload scenario: Standalone</Header>

        <Notifications type={notificationType} />

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

              if (!validation?.error) {
                contractsField.onUpload(server);
                setNotificationType('uploading');
              } else {
                setNotificationType(null);
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
      </SpaceBetween>
    </Box>
  );
}
