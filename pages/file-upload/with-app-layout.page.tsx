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
  Tabs,
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

interface InfoContent {
  header: string;
  content: React.ReactNode;
}

const defaultToolsContent: InfoContent = {
  header: 'File upload',
  content: <Box>File upload test scenario page</Box>,
};
const profilePictureToolsContent: InfoContent = {
  header: 'Profile picture',
  content: (
    <SpaceBetween size="s">
      <Box>The profile picture must satisfy the below requirements:</Box>
      <ul>
        <li>Maximum size: 1 MB; Density: at least 300 x 300 pixels</li>
        <li>The profile picture must be a photo of you</li>
        <li>Do not use pictures that contain other people</li>
      </ul>
    </SpaceBetween>
  ),
};
const contractsToolsContent: InfoContent = {
  header: 'Contract files',
  content: (
    <SpaceBetween size="s">
      <Box>
        Attach your contract and contract amendments as PDF files. The size of one file must not exceed 250 KB. The size
        of all attachments must not exceed 750 KB.
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
  ),
};

export default function FileUploadScenarios() {
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [toolsContent, setToolsContent] = useState(defaultToolsContent);
  const [showSuccess, setShowSuccess] = useState(false);
  const [imitateServerFailure, setImitateServerFailure] = useState(false);
  const [imitateServerValidation, setImitateServerValidation] = useState(false);

  server.imitateServerError = imitateServerFailure;
  server.imitateServerFileError = imitateServerValidation;

  const onInfo = (content: InfoContent) => {
    setToolsOpen(!toolsOpen || toolsContent !== content);
    setToolsContent(content);
  };

  const onSuccess = useCallback(() => {
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  }, []);

  return (
    <AppLayout
      contentType="form"
      ariaLabels={appLayoutLabels}
      navigationOpen={navigationOpen}
      notifications={
        showSuccess && (
          <Flashbar items={[{ type: 'success', header: 'File(s) uploaded', statusIconAriaLabel: 'success' }]} />
        )
      }
      stickyNotifications={true}
      onNavigationChange={event => setNavigationOpen(event.detail.open)}
      toolsOpen={toolsOpen}
      onToolsChange={event => setToolsOpen(event.detail.open)}
      tools={<Tools header={toolsContent.header}>{toolsContent.content}</Tools>}
      navigation={<Navigation />}
      content={
        <SpaceBetween size="xl">
          <Header variant="h1">File upload scenarios</Header>

          <SpaceBetween size="s" direction="horizontal">
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

          <Tabs
            tabs={[
              {
                id: '1',
                label: 'Scenario 1',
                content: (
                  <Scenario
                    title="Scenario 1: Standalone file upload"
                    description="When used as standalone files are uploaded to the server and validated upon selection"
                  >
                    <StandaloneFileUpload onInfo={onInfo} onSuccess={onSuccess} />
                  </Scenario>
                ),
              },
              {
                id: '2',
                label: 'Scenario 2',
                content: (
                  <Scenario
                    title="Scenario 2: File upload form with on-submit upload and validation"
                    description="When used in a form both server upload and validation can happen on form submit"
                  >
                    <FileUploadForm
                      onInfo={onInfo}
                      onSuccess={onSuccess}
                      uploadOnSelect={false}
                      validateOnSelect={false}
                    />
                  </Scenario>
                ),
              },
              {
                id: '3',
                label: 'Scenario 3',
                content: (
                  <Scenario
                    title="Scenario 3: File upload form with in-place upload and validation"
                    description="When used in a form it is still possible and advised to use in-place upload and validation"
                  >
                    <FileUploadForm
                      onInfo={onInfo}
                      onSuccess={onSuccess}
                      uploadOnSelect={true}
                      validateOnSelect={true}
                    />
                  </Scenario>
                ),
              },
              {
                id: '4',
                label: 'Scenario 4',
                content: (
                  <Scenario
                    title="Scenario 4: File upload form with on-submit upload and mixed validation"
                    description="When used in a form with on-submit upload both in-place and on-submit validation might exist"
                  >
                    <FileUploadForm
                      onInfo={onInfo}
                      onSuccess={onSuccess}
                      uploadOnSelect={false}
                      validateOnSelect={true}
                    />
                  </Scenario>
                ),
              },
            ]}
          />
        </SpaceBetween>
      }
    />
  );
}

function Scenario({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <SpaceBetween size="m">
      <Header variant="h2" description={description}>
        {title}
      </Header>

      <Box>{children}</Box>
    </SpaceBetween>
  );
}

function StandaloneFileUpload({
  onInfo,
  onSuccess,
}: {
  onInfo: (content: InfoContent) => void;
  onSuccess: () => void;
}) {
  const contractsField = useFileUploadFormField({ onUploadReady: onSuccess });
  return (
    <FileUpload
      multiple={true}
      limit={3}
      value={contractsField.value}
      onChange={event => {
        contractsField.onChange(event.detail.value, validateContractFiles(event.detail.value));
        contractsField.onUpload(server);
      }}
      accept="application/pdf, image/png, image/jpeg"
      showFileType={true}
      showFileSize={true}
      showFileLastModified={true}
      showFileThumbnail={true}
      i18nStrings={i18nStrings}
      errorText={contractsField.error}
      fileErrors={contractsField.fileErrors}
      label="Contracts"
      description="Upload your contract with all amendments"
      info={
        <Link variant="info" onFollow={() => onInfo(contractsToolsContent)}>
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
}

function FileUploadForm({
  onInfo,
  onSuccess,
  validateOnSelect,
  uploadOnSelect,
}: {
  onInfo: (content: InfoContent) => void;
  onSuccess: () => void;
  validateOnSelect: boolean;
  uploadOnSelect: boolean;
}) {
  const profileImageField = useFileUploadFormField({ onUploadReady: uploadOnSelect ? undefined : onSuccess });
  const aliasField = useFormField('');

  const uploadProgress = profileImageField.progress && (
    <UploadProgress
      files={profileImageField.value}
      progress={profileImageField.progress}
      error={!!profileImageField.error}
      onRefresh={uploadOnSelect ? () => profileImageField.onUpload(server) : undefined}
    />
  );

  return (
    <form
      onSubmit={e => {
        e.preventDefault();

        const profileImageError = validateProfilePictureFile(profileImageField.value, true);
        const aliasError = aliasField.value.trim().length === 0 ? 'Alias must not be empty' : '';

        profileImageError.hasError && profileImageField.onChange(profileImageField.value, profileImageError);
        aliasError && aliasField.onChange(aliasField.value, aliasError);

        if (!profileImageError.hasError && !aliasError) {
          if (uploadOnSelect) {
            profileImageField.uploadStatus === 'ready' && onSuccess();
          } else {
            profileImageField.onUpload(server);
          }
        }
      }}
    >
      <Form
        actions={
          <Button variant="primary" formAction="submit" loading={profileImageField.uploadStatus === 'loading'}>
            Upload
          </Button>
        }
        secondaryActions={!uploadOnSelect && uploadProgress}
      >
        <SpaceBetween size="m">
          <FileUpload
            ariaRequired={true}
            value={profileImageField.value}
            onChange={event => {
              const validation = validateOnSelect ? validateProfilePictureFile(event.detail.value) : undefined;
              profileImageField.onChange(event.detail.value, validation);
              if (uploadOnSelect) {
                profileImageField.onUpload(server);
              }
            }}
            accept="image/png, image/jpeg"
            showFileType={true}
            showFileSize={true}
            showFileLastModified={true}
            showFileThumbnail={true}
            i18nStrings={i18nStrings}
            errorText={profileImageField.error}
            fileErrors={profileImageField.fileErrors}
            label="Profile picture"
            description="Upload a picture of yourself"
            info={
              <Link variant="info" onFollow={() => onInfo(profilePictureToolsContent)}>
                info
              </Link>
            }
            constraintText="File size must not exceed 1 MB"
            secondaryControl={uploadOnSelect && uploadProgress}
          />

          <FormField label="Alias" description="Specify your alias" errorText={aliasField.error}>
            <Input
              ariaRequired={true}
              value={aliasField.value}
              onChange={e => aliasField.onChange(e.detail.value, '')}
            />
          </FormField>
        </SpaceBetween>
      </Form>
    </form>
  );
}

function validateProfilePictureFile(files: File[], required = false): ValidationState {
  const state = new ValidationState(files.length);

  state.addError(required && files.length === 0 ? 'No file selected' : null);

  state.addFileErrors(files, file => validateFileSize(file, 1 * SIZE.MB));
  state.addFileErrors(files, file => validateFileNameNotEmpty(file));
  state.addFileErrors(files, file => validateFileExtensions(file, ['png', 'jpg', 'jpeg']));

  return state;
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
