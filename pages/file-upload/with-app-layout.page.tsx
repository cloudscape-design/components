// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useEffect, useState } from 'react';
import { AppLayout, Box, Button, FileUpload, Flashbar, Form, FormField, Header, Input, Link } from '~components';
import SpaceBetween from '~components/space-between';
import { i18nStrings } from './shared';
import appLayoutLabels from '../app-layout/utils/labels';
import { Navigation, Tools } from '../app-layout/utils/content-blocks';
import {
  FileError,
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
        <SpaceBetween size="l">
          <Header variant="h1">File upload scenarios</Header>

          <StandaloneFileUploadScenario onInfo={onInfo} onSuccess={onSuccess} />
          <FileUploadInFormWithUploadOnSubmitScenario onInfo={onInfo} onSuccess={onSuccess} />
          <FileUploadInFormWithInstantUploadScenario onInfo={onInfo} onSuccess={onSuccess} />
          <FileUploadInFormWithMixedValidationScenario onInfo={onInfo} onSuccess={onSuccess} />
        </SpaceBetween>
      }
    />
  );
}

function StandaloneFileUploadScenario({ onInfo, onSuccess }: FileUploadScenarioProps) {
  const fileState = useFileUploadState({ onSuccess });

  return (
    <SpaceBetween size="m">
      <Header
        variant="h2"
        description="When used as standalone files are uploaded to the server and validated upon selection"
      >
        Scenario 1: Standalone file upload
      </Header>

      <FormField
        errorText={fileState.serverError ?? fileState.validationError}
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
      >
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
        />
      </FormField>
    </SpaceBetween>
  );
}

function FileUploadInFormWithUploadOnSubmitScenario({ onInfo, onSuccess }: FileUploadScenarioProps) {
  const fileState = useFileUploadState({ onSuccess });
  const [alias, setAlias] = useState('');
  const [aliasError, setAliasError] = useState('');

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
            fileState.onSubmit();
          } else {
            setAliasError('Alias must not be empty');
          }
        }}
      >
        <Form
          actions={
            <Button variant="primary" formAction="submit">
              Upload
            </Button>
          }
        >
          <SpaceBetween size="m">
            <FormField
              errorText={fileState.serverError ?? fileState.validationError}
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
                  />
                )
              }
            >
              <FileUpload
                value={fileState.files}
                onChange={event => {
                  fileState.onChange(event.detail.value, []);
                }}
                accept="image/png, image/jpeg"
                showFileType={true}
                showFileSize={true}
                showFileLastModified={true}
                showFileThumbnail={true}
                i18nStrings={i18nStrings}
              />
            </FormField>

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

function FileUploadInFormWithInstantUploadScenario({ onInfo }: FileUploadScenarioProps) {
  return (
    <SpaceBetween size="m">
      <Header
        variant="h2"
        description="When used in a form it is still possible and advised to use in-place upload and validation"
      >
        Scenario 3: File upload form with in-place upload and validation
      </Header>
    </SpaceBetween>
  );
}

function FileUploadInFormWithMixedValidationScenario({ onInfo }: FileUploadScenarioProps) {
  return (
    <SpaceBetween size="m">
      <Header
        variant="h2"
        description="When used in a form with on-submit upload both in-place and on-submit validation might exist"
      >
        Scenario 4: File upload form with on-submit upload and mixed validation
      </Header>
    </SpaceBetween>
  );
}

function validateProfilePictureFile(file: File | undefined): FileError[] {
  if (!file) {
    return [];
  }

  const errors: FileError[] = [];
  const addError = (file: null | File, error: null | string) => error && errors.push({ file, error });

  addError(file, validateFileSize(file, 1 * SIZE.MB));
  addError(file, validateFileNameNotEmpty(file));
  addError(file, validateFileExtensions(file, ['png', 'jpg', 'jpeg']));

  return errors;
}

function validateContractFiles(files: File[]): FileError[] {
  const errors: FileError[] = [];
  const addError = (file: null | File, error: null | string) => error && errors.push({ file, error });
  const addErrors = (files: File[], validate: (file: File) => null | string) => {
    for (const file of files) {
      addError(file, validate(file));
    }
  };

  addErrors(files, file => validateFileSize(file, 250 * SIZE.KB));
  addError(null, validateTotalFileSize(files, 750 * SIZE.KB));
  addErrors(files, validateFileNameNotEmpty);
  addError(null, validateDuplicateFileNames(files));
  addErrors(files, file => validateFileExtensions(file, ['pdf']));
  addErrors(files, validateContractFilePattern);

  return errors;
}

function validateContractFilePattern(file: File) {
  if (!file.name.match(/[\w]+_(contract)|(amendment_[\d]+).pdf/)) {
    return `File "${file.name}" does not satisfy naming guidelines. Check "info" for details.`;
  }
  return null;
}
