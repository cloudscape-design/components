// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useState } from 'react';
import {
  AppLayout,
  Box,
  Button,
  Checkbox,
  FileUpload,
  Flashbar,
  Form,
  FormField,
  Header,
  Input,
  Link,
} from '~components';
import SpaceBetween from '~components/space-between';
import { i18nStrings } from './shared';
import appLayoutLabels from '../app-layout/utils/labels';
import { Navigation, Tools } from '../app-layout/utils/content-blocks';
import { UploadProgress } from './upload-progress';
import { SIZE, ValidationState } from './utils';
import {
  validateDuplicateFileNames,
  validateFileExtensions,
  validateFileNameNotEmpty,
  validateFileSize,
  validateTotalFileSize,
} from './validations';
import { useFileUploadFormField, useFormField } from './form-helpers';
import { DummyServer } from './dummy-server';

const server = new DummyServer();

export default function FileUploadScenarios() {
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Settings
  const [acceptMultiple, setAcceptMultiple] = useState(true);
  const [useForm, setUseForm] = useState(false);
  const [imitateServerFailure, setImitateServerFailure] = useState(false);
  const [imitateServerValidation, setImitateServerValidation] = useState(false);
  const [uploadOnSelect, setUploadOnSelect] = useState(true);
  const [validateOnSelect, setValidateOnSelect] = useState(true);

  server.imitateServerError = imitateServerFailure;
  server.imitateServerFileError = imitateServerValidation;

  const onSuccess = useCallback(() => {
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  }, []);

  const contractsField = useFileUploadFormField({ onUploadReady: !uploadOnSelect || !useForm ? onSuccess : undefined });
  const nameField = useFormField('');

  const fileUpload = (
    <FileUpload
      multiple={acceptMultiple}
      limit={3}
      value={contractsField.value}
      onChange={event => {
        const validation = validateOnSelect ? validateContractFiles(event.detail.value) : undefined;
        contractsField.onChange(event.detail.value, validation);
        if (uploadOnSelect) {
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
      label={acceptMultiple ? 'Contracts' : 'Contract'}
      description={acceptMultiple ? 'Upload your contract with all amendments' : 'Upload your contract'}
      info={
        <Link variant="info" onFollow={() => setToolsOpen(true)}>
          info
        </Link>
      }
      constraintText="File size must not exceed 250 KB. Combined file size must not exceed 750 KB"
      secondaryControl={
        contractsField.progress ? (
          <UploadProgress
            files={contractsField.value}
            progress={contractsField.progress}
            error={!!contractsField.error}
            onRefresh={() => contractsField.onUpload(server)}
          />
        ) : null
      }
    />
  );

  return (
    <AppLayout
      contentType="form"
      ariaLabels={appLayoutLabels}
      navigationOpen={navigationOpen}
      notifications={
        showSuccess && <Flashbar items={[{ type: 'success', header: 'Submitted', statusIconAriaLabel: 'success' }]} />
      }
      stickyNotifications={true}
      onNavigationChange={event => setNavigationOpen(event.detail.open)}
      toolsOpen={toolsOpen}
      onToolsChange={event => setToolsOpen(event.detail.open)}
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
          <Header variant="h1">File upload scenarios</Header>

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

            <FormField label="Form settings">
              <SpaceBetween size="s" direction="horizontal">
                <Checkbox checked={useForm} onChange={event => setUseForm(event.detail.checked)}>
                  Use form
                </Checkbox>
                <Checkbox
                  checked={useForm && uploadOnSelect}
                  disabled={!useForm}
                  onChange={event => setUploadOnSelect(event.detail.checked)}
                >
                  Upload files on select
                </Checkbox>
                <Checkbox
                  checked={useForm && (validateOnSelect || uploadOnSelect)}
                  disabled={!useForm || uploadOnSelect}
                  onChange={event => setValidateOnSelect(event.detail.checked)}
                >
                  Validate files on select
                </Checkbox>
              </SpaceBetween>
            </FormField>
          </SpaceBetween>

          {useForm ? (
            <form
              onSubmit={e => {
                e.preventDefault();

                const profileImageError = validateContractFiles(contractsField.value, true);
                const nameError = nameField.value.trim().length === 0 ? 'Name must not be empty' : '';

                profileImageError.hasError && contractsField.onChange(contractsField.value, profileImageError);
                nameError && nameField.onChange(nameField.value, nameError);

                if (!profileImageError.hasError && !nameError) {
                  if (uploadOnSelect) {
                    contractsField.uploadStatus === 'ready' && onSuccess();
                  } else {
                    contractsField.onUpload(server);
                  }
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
          ) : (
            fileUpload
          )}
        </SpaceBetween>
      }
    />
  );
}

function validateContractFiles(files: File[], required = false): ValidationState {
  const state = new ValidationState(files.length);

  state.addError(required && files.length === 0 ? 'No files selected' : null);
  state.addError(validateTotalFileSize(files, 750 * SIZE.KB));
  state.addError(validateDuplicateFileNames(files));

  state.addFileErrors(files, file => validateFileSize(file, 250 * SIZE.KB));
  state.addFileErrors(files, file => validateFileNameNotEmpty(file));
  state.addFileErrors(files, file => validateFileExtensions(file, ['pdf']));
  state.addFileErrors(files, file => validateContractFilePattern(file));

  return state;
}

function validateContractFilePattern(file: File) {
  if (!file.name.match(/[\w]+_(contract)|(amendment_[\d]+).pdf/)) {
    return `File "${file.name}" does not satisfy naming guidelines. Check "info" for details.`;
  }
  return null;
}
