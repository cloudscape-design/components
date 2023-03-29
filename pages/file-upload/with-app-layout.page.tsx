// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useEffect, useState } from 'react';
import { AppLayout, Box, Button, FileUpload, Flashbar, Form, FormField, Header, Input, Link, Tabs } from '~components';
import SpaceBetween from '~components/space-between';
import { i18nStrings } from './shared';
import appLayoutLabels from '../app-layout/utils/labels';
import { Navigation, Tools } from '../app-layout/utils/content-blocks';
import {
  ValidationState,
  SIZE,
  useFileUploadState,
  validateDuplicateFileNames,
  validateFileExtensions,
  validateFileNameNotEmpty,
  validateFileSize,
  validateTotalFileSize,
} from './validations';
import { UploadProgress } from './upload-progress';

interface InfoContent {
  header: string;
  content: React.ReactNode;
}

interface FileUploadScenarioProps {
  onInfo: (content: InfoContent) => void;
  onSuccess: () => void;
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

          <Tabs
            tabs={[
              {
                id: '1',
                label: 'Scenario 1',
                content: <StandaloneFileUploadScenario onInfo={onInfo} onSuccess={onSuccess} />,
              },
              {
                id: '2',
                label: 'Scenario 2',
                content: <FileUploadInFormWithUploadOnSubmitScenario onInfo={onInfo} onSuccess={onSuccess} />,
              },
              {
                id: '3',
                label: 'Scenario 3',
                content: <FileUploadInFormWithInstantUploadScenario onInfo={onInfo} onSuccess={onSuccess} />,
              },
              {
                id: '4',
                label: 'Scenario 4',
                content: <FileUploadInFormWithMixedValidationScenario onInfo={onInfo} onSuccess={onSuccess} />,
              },
            ]}
          />
        </SpaceBetween>
      }
    />
  );
}

function StandaloneFileUploadScenario({ onInfo, onSuccess }: FileUploadScenarioProps) {
  const fileState = useFileUploadState();

  useEffect(() => {
    if (fileState.success) {
      onSuccess();
    }
  }, [fileState.success, onSuccess]);

  return (
    <SpaceBetween size="m">
      <Header
        variant="h2"
        description="When used as standalone files are uploaded to the server and validated upon selection"
      >
        Scenario 1: Standalone file upload
      </Header>

      <FileUpload
        multiple={true}
        limit={3}
        value={fileState.files}
        onChange={event => {
          fileState.onChange(event.detail.value, validateContractFiles(event.detail.value));
          fileState.onSubmit();
        }}
        accept="application/pdf, image/png, image/jpeg"
        showFileType={true}
        showFileSize={true}
        showFileLastModified={true}
        showFileThumbnail={true}
        i18nStrings={i18nStrings}
        errorText={fileState.serverError ?? fileState.validationError}
        fileErrors={fileState.fileErrors}
        label="Contracts"
        description="Upload your contract with all amendments"
        info={
          <Link variant="info" onFollow={() => onInfo(contractsToolsContent)}>
            info
          </Link>
        }
        constraintText="File size must not exceed 250 KB. Combined file size must not exceed 750 KB"
        secondaryControl={
          fileState.files.length > 0 ? (
            <UploadProgress
              files={fileState.files}
              progress={fileState.progress}
              error={!!fileState.serverError}
              onRefresh={fileState.onRefresh}
            />
          ) : null
        }
      />
    </SpaceBetween>
  );
}

function FileUploadInFormWithUploadOnSubmitScenario({ onInfo, onSuccess }: FileUploadScenarioProps) {
  const fileState = useFileUploadState();
  const [alias, setAlias] = useState('');
  const [aliasError, setAliasError] = useState('');

  useEffect(() => {
    if (fileState.success) {
      onSuccess();
    }
  }, [fileState.success, onSuccess]);

  return (
    <SpaceBetween size="m">
      <Header
        variant="h2"
        description="When used in a form both server upload and validation can happen on form submit"
      >
        Scenario 2: File upload form with on-submit upload and validation
      </Header>

      <form
        onSubmit={e => {
          e.preventDefault();
          fileState.onChange(fileState.files, validateProfilePictureFile(fileState.files[0]));
          if (alias.trim().length > 0) {
            fileState.onRefresh();
            fileState.onSubmit();
          } else {
            setAliasError('Alias must not be empty');
          }
        }}
      >
        <Form
          actions={
            <Button
              variant="primary"
              formAction="submit"
              loading={fileState.submitted && !fileState.serverError && !fileState.success}
            >
              Upload
            </Button>
          }
          secondaryActions={
            fileState.submitted &&
            fileState.files.length > 0 && (
              <UploadProgress files={fileState.files} progress={fileState.progress} error={!!fileState.serverError} />
            )
          }
        >
          <SpaceBetween size="m">
            <FileUpload
              value={fileState.files}
              onChange={event => {
                fileState.onChange(event.detail.value);
              }}
              accept="image/png, image/jpeg"
              showFileType={true}
              showFileSize={true}
              showFileLastModified={true}
              showFileThumbnail={true}
              i18nStrings={i18nStrings}
              errorText={fileState.serverError ?? fileState.validationError ?? fileState.submissionError}
              fileErrors={fileState.fileErrors}
              label="Profile picture"
              description="Upload a picture of yourself"
              info={
                <Link variant="info" onFollow={() => onInfo(profilePictureToolsContent)}>
                  info
                </Link>
              }
              constraintText="File size must not exceed 1 MB"
            />

            <FormField label="Alias" description="Specify your alias" errorText={aliasError}>
              <Input
                value={alias}
                onChange={e => {
                  setAlias(e.detail.value);
                  setAliasError('');
                }}
              />
            </FormField>
          </SpaceBetween>
        </Form>
      </form>
    </SpaceBetween>
  );
}

function FileUploadInFormWithInstantUploadScenario({ onInfo, onSuccess }: FileUploadScenarioProps) {
  const fileState = useFileUploadState();
  const [alias, setAlias] = useState('');
  const [aliasError, setAliasError] = useState('');

  return (
    <SpaceBetween size="m">
      <Header
        variant="h2"
        description="When used in a form it is still possible and advised to use in-place upload and validation"
      >
        Scenario 3: File upload form with in-place upload and validation
      </Header>

      <form
        onSubmit={e => {
          e.preventDefault();
          if (alias.trim().length > 0) {
            fileState.success && onSuccess();
          } else {
            setAliasError('Alias must not be empty');
          }
        }}
      >
        <Form
          actions={
            <Button
              variant="primary"
              formAction="submit"
              loading={fileState.submitted && !fileState.serverError && !fileState.success}
            >
              Upload
            </Button>
          }
        >
          <SpaceBetween size="m">
            <FileUpload
              value={fileState.files}
              onChange={event => {
                fileState.onChange(event.detail.value, validateProfilePictureFile(event.detail.value[0]));
                fileState.onSubmit();
              }}
              accept="image/png, image/jpeg"
              showFileType={true}
              showFileSize={true}
              showFileLastModified={true}
              showFileThumbnail={true}
              i18nStrings={i18nStrings}
              errorText={fileState.serverError ?? fileState.validationError ?? fileState.submissionError}
              fileErrors={fileState.fileErrors}
              label="Profile picture"
              description="Upload a picture of yourself"
              info={
                <Link variant="info" onFollow={() => onInfo(profilePictureToolsContent)}>
                  info
                </Link>
              }
              constraintText="File size must not exceed 1 MB"
              secondaryControl={
                fileState.submitted &&
                fileState.files.length > 0 && (
                  <UploadProgress
                    files={fileState.files}
                    progress={fileState.progress}
                    error={!!fileState.serverError}
                    onRefresh={fileState.onRefresh}
                  />
                )
              }
            />

            <FormField label="Alias" description="Specify your alias" errorText={aliasError}>
              <Input
                value={alias}
                onChange={e => {
                  setAlias(e.detail.value);
                  setAliasError('');
                }}
              />
            </FormField>
          </SpaceBetween>
        </Form>
      </form>
    </SpaceBetween>
  );
}

function FileUploadInFormWithMixedValidationScenario({ onInfo, onSuccess }: FileUploadScenarioProps) {
  const fileState = useFileUploadState();
  const [alias, setAlias] = useState('');
  const [aliasError, setAliasError] = useState('');

  useEffect(() => {
    if (fileState.success) {
      onSuccess();
    }
  }, [fileState.success, onSuccess]);

  return (
    <SpaceBetween size="m">
      <Header
        variant="h2"
        description="When used in a form with on-submit upload both in-place and on-submit validation might exist"
      >
        Scenario 4: File upload form with on-submit upload and mixed validation
      </Header>

      <form
        onSubmit={e => {
          e.preventDefault();
          if (alias.trim().length > 0) {
            fileState.onRefresh();
            fileState.onSubmit();
          } else {
            setAliasError('Alias must not be empty');
          }
        }}
      >
        <Form
          actions={
            <Button
              variant="primary"
              formAction="submit"
              loading={fileState.submitted && !fileState.serverError && !fileState.success}
            >
              Upload
            </Button>
          }
          secondaryActions={
            fileState.submitted &&
            fileState.files.length > 0 && (
              <UploadProgress files={fileState.files} progress={fileState.progress} error={!!fileState.serverError} />
            )
          }
        >
          <SpaceBetween size="m">
            <FileUpload
              value={fileState.files}
              onChange={event => {
                fileState.onChange(event.detail.value, validateProfilePictureFile(event.detail.value[0]));
              }}
              accept="image/png, image/jpeg"
              showFileType={true}
              showFileSize={true}
              showFileLastModified={true}
              showFileThumbnail={true}
              i18nStrings={i18nStrings}
              errorText={fileState.serverError ?? fileState.validationError ?? fileState.submissionError}
              fileErrors={fileState.fileErrors}
              label="Profile picture"
              description="Upload a picture of yourself"
              info={
                <Link variant="info" onFollow={() => onInfo(profilePictureToolsContent)}>
                  info
                </Link>
              }
              constraintText="File size must not exceed 1 MB"
            />

            <FormField label="Alias" description="Specify your alias" errorText={aliasError}>
              <Input
                value={alias}
                onChange={e => {
                  setAlias(e.detail.value);
                  setAliasError('');
                }}
              />
            </FormField>
          </SpaceBetween>
        </Form>
      </form>
    </SpaceBetween>
  );
}

function validateProfilePictureFile(file: File | undefined): ValidationState {
  if (!file) {
    return { errors: [], fileErrors: [] };
  }

  const fileErrors: string[][] = [[]];
  const addError = (error: null | string) => error && fileErrors[0].push(error);

  addError(validateFileSize(file, 1 * SIZE.MB));
  addError(validateFileNameNotEmpty(file));
  addError(validateFileExtensions(file, ['png', 'jpg', 'jpeg']));

  return { errors: [], fileErrors };
}

function validateContractFiles(files: File[]): ValidationState {
  const errors: string[] = [];
  const fileErrors: string[][] = files.map(() => []);

  const addError = (error: null | string) => error && errors.push(error);
  const addFileErrors = (files: File[], validate: (file: File) => null | string) => {
    for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
      const fileError = validate(files[fileIndex]);
      if (fileError) {
        fileErrors[fileIndex].push(fileError);
      }
    }
  };

  addError(validateTotalFileSize(files, 750 * SIZE.KB));
  addError(validateDuplicateFileNames(files));

  addFileErrors(files, file => validateFileSize(file, 250 * SIZE.KB));
  addFileErrors(files, validateFileNameNotEmpty);
  addFileErrors(files, file => validateFileExtensions(file, ['pdf']));
  addFileErrors(files, validateContractFilePattern);

  return { errors, fileErrors };
}

function validateContractFilePattern(file: File) {
  if (!file.name.match(/[\w]+_(contract)|(amendment_[\d]+).pdf/)) {
    return `File "${file.name}" does not satisfy naming guidelines. Check "info" for details.`;
  }
  return null;
}
