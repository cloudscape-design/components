// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { AppLayout, Box, FileUpload, FormField, Header, Link } from '~components';
import SpaceBetween from '~components/space-between';
import { i18nStrings } from './shared';
import appLayoutLabels from '../app-layout/utils/labels';
import { Navigation, Tools } from '../app-layout/utils/content-blocks';
import {
  SIZE,
  validateDuplicateFileNames,
  validateFileExtensions,
  validateFileNameNotEmpty,
  validateFileSize,
  validateTotalFileSize,
} from './validations';

const defaultToolsContent = {
  header: 'File upload',
  content: <Box>File upload test scenario page</Box>,
};
const profilePictureToolsContent = {
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
const contractsToolsContent = {
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

interface FileError {
  file: null | File;
  error: string;
}

export default function FileUploadScenario() {
  const [profileImageFile, setProfileImageFile] = useState<File[]>([]);
  const [profileImageErrors, setProfileErrors] = useState<FileError[]>([]);

  const [contractFiles, setContractFiles] = useState<File[]>([]);
  const [contractsErrors, setContractsErrors] = useState<FileError[]>([]);

  const [navigationOpen, setNavigationOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [toolsContent, setToolsContent] = useState(defaultToolsContent);

  function formFieldError(errors: FileError[]) {
    if (errors.length === 0) {
      return null;
    }
    if (errors.length === 1) {
      return errors[0].error;
    }
    if (errors.length === 2) {
      return `${errors[0].error}, and 1 more error`;
    }
    return `${errors[0].error}, and ${errors.length - 1} more errors`;
  }

  return (
    <AppLayout
      contentType="form"
      ariaLabels={appLayoutLabels}
      navigationOpen={navigationOpen}
      onNavigationChange={event => setNavigationOpen(event.detail.open)}
      toolsOpen={toolsOpen}
      onToolsChange={event => setToolsOpen(event.detail.open)}
      tools={<Tools header={toolsContent.header}>{toolsContent.content}</Tools>}
      navigation={<Navigation />}
      content={
        <SpaceBetween size="m">
          <Header variant="h1">File upload demo</Header>
          <SpaceBetween size="m">
            <FormField
              errorText={formFieldError(profileImageErrors)}
              label="Profile picture"
              description="Upload a picture of yourself"
              info={
                <Link
                  variant="info"
                  onFollow={() => {
                    setToolsOpen(!toolsOpen || toolsContent !== profilePictureToolsContent);
                    setToolsContent(profilePictureToolsContent);
                  }}
                >
                  info
                </Link>
              }
              constraintText="File size must not exceed 1 MB"
            >
              <FileUpload
                value={profileImageFile}
                onChange={event => {
                  setProfileImageFile(event.detail.value);
                  setProfileErrors(validateProfilePictureFile(event.detail.value[0]));
                }}
                accept="image/png, image/jpeg"
                showFileType={true}
                showFileSize={true}
                showFileLastModified={true}
                showFileThumbnail={true}
                i18nStrings={i18nStrings}
                fileProps={[{ status: profileImageErrors.length > 0 ? 'error' : 'success' }]}
              />
            </FormField>

            <FormField
              errorText={formFieldError(contractsErrors)}
              label="Contracts"
              description="Upload your contract with all amendments"
              info={
                <Link
                  variant="info"
                  onFollow={() => {
                    setToolsOpen(!toolsOpen || toolsContent !== contractsToolsContent);
                    setToolsContent(contractsToolsContent);
                  }}
                >
                  info
                </Link>
              }
              constraintText="File size must not exceed 250 KB. Combined file size must not exceed 750 KB"
            >
              <FileUpload
                multiple={true}
                limit={3}
                value={contractFiles}
                onChange={event => {
                  setContractFiles(event.detail.value);
                  setContractsErrors(validateContractFiles(event.detail.value));
                }}
                accept="application/pdf, image/png, image/jpeg"
                showFileType={true}
                showFileSize={true}
                showFileLastModified={true}
                showFileThumbnail={true}
                i18nStrings={i18nStrings}
                fileProps={contractFiles.map(file => ({
                  status: contractsErrors.find(error => error.file === file) ? 'error' : 'success',
                }))}
              />
            </FormField>
          </SpaceBetween>
        </SpaceBetween>
      }
    />
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
