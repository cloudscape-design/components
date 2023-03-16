// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { AppLayout, Box, FileUpload, FormField, Header, Link } from '~components';
import SpaceBetween from '~components/space-between';
import { i18nStrings } from './shared';
import appLayoutLabels from '../app-layout/utils/labels';
import { Navigation, Tools } from '../app-layout/utils/content-blocks';

const KB = 1000;
const MB = 1000 ** 2;
const contractFileNamePattern = /[\w]+_(contract)|(amendment_[\d]+).pdf/;

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
        <li>Your face should not be blurry</li>
        <li>Do not wear sunglasses</li>
      </ul>
    </SpaceBetween>
  ),
};
const contractsToolsContent = {
  header: 'Contract files',
  content: (
    <SpaceBetween size="s">
      <Box>
        Attach your contract and all amendments as PDF files. The size of one file must not exceed 250 KB. The size or
        all attachments must not exceed 500 KB.
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

export default function FileUploadScenario() {
  const [profileImageFile, setProfileImageFile] = useState<File[]>([]);
  const [profileImageError, setProfileError] = useState<string | null>(null);

  const [contractFiles, setContractFiles] = useState<File[]>([]);
  const [contractsError, setContractsError] = useState<string | null>(null);

  const [navigationOpen, setNavigationOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [toolsContent, setToolsContent] = useState(defaultToolsContent);

  return (
    <AppLayout
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
          <SpaceBetween size="m" direction="horizontal">
            <FormField
              errorText={profileImageError}
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
                  setProfileError(validateProfilePictureFile(event.detail.value[0]));
                }}
                buttonText="Choose file"
                accept="image/png, image/jpeg"
                showFileType={true}
                showFileSize={true}
                showFileLastModified={true}
                i18nStrings={i18nStrings}
              />
            </FormField>

            <FormField
              errorText={contractsError}
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
              constraintText="File size must not exceed 250 KB. Combined file size must not exceed 500 KB"
            >
              <FileUpload
                multiple={true}
                value={contractFiles}
                onChange={event => {
                  setContractFiles(event.detail.value);
                  setContractsError(validateContractFiles(event.detail.value));
                }}
                buttonText="Choose files"
                accept="application/pdf, image/png, image/jpeg"
                showFileType={true}
                showFileSize={true}
                showFileLastModified={true}
                showFileThumbnail={true}
                i18nStrings={i18nStrings}
              />
            </FormField>
          </SpaceBetween>
        </SpaceBetween>
      }
    />
  );
}

function validateProfilePictureFile(file: File | undefined): null | string {
  if (!file) {
    return null;
  }
  const fileSizeError = validateFileSize(file, 1 * MB);
  const fileNameNotEmptyError = validateFileNameNotEmpty(file);
  const fileExtensionError = validateFileExtensions(file, ['png', 'jpg', 'jpeg']);
  return fileSizeError ?? fileNameNotEmptyError ?? fileExtensionError ?? null;
}

function validateContractFiles(files: File[]): null | string {
  const fileSizeError = validateFileSize(files, 250 * KB, 500 * KB);
  const fileNameNotEmptyError = validateFiles(files, validateFileNameNotEmpty);
  const fileExtensionError = validateFiles(files, file => validateFileExtensions(file, ['pdf']));
  const fileNamePatternError = validateFiles(files, validateContractFilePattern);
  return fileSizeError ?? fileNameNotEmptyError ?? fileExtensionError ?? fileNamePatternError ?? null;
}

function validateFiles(files: File[], validate: (file: File) => null | string): null | string {
  for (const file of files) {
    const result = validate(file);
    if (result !== null) {
      return result;
    }
  }
  return null;
}

function validateFileSize(input: File | File[], maxFileSize: number, maxTotalSize = maxFileSize): null | string {
  const formatFileSize = (bytes: number): string => {
    return bytes < MB ? `${(bytes / KB).toFixed(2)} KB` : `${(bytes / MB).toFixed(2)} MB`;
  };

  const files = input instanceof File ? [input] : input;

  const largeFile = files.find(file => file.size > maxFileSize);
  const totalSize = files.reduce((sum, file) => sum + file.size, 0);

  if (largeFile && input instanceof File) {
    return `File size is above the allowed maximum (${formatFileSize(maxFileSize)})`;
  } else if (largeFile) {
    return `The size of file "${largeFile.name}" is above the allowed maximum (${formatFileSize(maxFileSize)})`;
  }
  if (totalSize > maxTotalSize) {
    return `Files combined size (${formatFileSize(totalSize)}) is above the allowed maximum (${formatFileSize(
      maxTotalSize
    )})`;
  }

  return null;
}

function validateFileNameNotEmpty(file: File): null | string {
  if (file.name.length === 0) {
    return 'Empty file name is not allowed.';
  }
  return null;
}

function validateFileExtensions(file: File, extensions: string[]): null | string {
  const fileNameParts = file.name.split('.');
  const fileExtension = fileNameParts[fileNameParts.length - 1];
  if (!extensions.includes(fileExtension.toLowerCase())) {
    return `File "${file.name}" is not supported. Allowed extensions are ${extensions.map(e => `"${e}"`).join(', ')}.`;
  }
  return null;
}

function validateContractFilePattern(file: File) {
  if (!file.name.match(contractFileNamePattern)) {
    return `File "${file.name}" does not satisfy naming guidelines. Check "info" for details.`;
  }
  return null;
}
