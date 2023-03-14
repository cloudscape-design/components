// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { FileUpload, FileUploadProps, FormField } from '~components';
import Box from '~components/box';
import SpaceBetween from '~components/space-between';

export default function FileUploadScenario() {
  const [profileImageFile, setProfileImageFile] = useState<FileUploadProps.FileType>(null);
  const [profileImageError, setProfileError] = useState<string | null>(null);

  const [documentFiles, setDocumentFiles] = useState<FileUploadProps.FileType>(null);
  const [documentsError, setDocumentsError] = useState<string | null>(null);

  return (
    <Box margin="xl">
      <SpaceBetween size="m">
        <h1>File upload demo</h1>
        <SpaceBetween size="m" direction="horizontal">
          <FormField
            errorText={profileImageError}
            label="Profile picture"
            description="Upload a picture of yourself"
            constraintText="File size must not exceed 1MB"
          >
            <FileUpload
              value={profileImageFile}
              onChange={event => {
                setProfileImageFile(event.detail.value);
                setProfileError(validateFileSize('MB', event.detail.value, 1 * 1024 ** 2));
              }}
              buttonText="Choose file"
              accept="image"
              fileMetadata={{ size: 'KB' }}
            />
          </FormField>

          <FormField
            errorText={documentsError}
            label="Documents"
            description="Upload your contract with all amendments"
            constraintText="Combined file size must not exceed 1MB"
          >
            <FileUpload
              multiple={true}
              value={documentFiles}
              onChange={event => {
                setDocumentFiles(event.detail.value);
                setDocumentsError(validateFileSize('KB', event.detail.value, (1 * 1024 ** 2) / 3, (1 * 1024 ** 2) / 2));
              }}
              buttonText="Choose files"
              accept="application/pdf"
              fileMetadata={{ size: 'KB' }}
            />
          </FormField>
        </SpaceBetween>
      </SpaceBetween>
    </Box>
  );
}

function validateFileSize(
  unit: FileUploadProps.FileSize,
  input: FileUploadProps.FileType,
  maxFileSize: number,
  maxTotalSize = maxFileSize
): null | string {
  if (!input) {
    return null;
  }

  const formatFileSize = (bytes: number): string => {
    switch (unit) {
      case 'KB': {
        return (bytes / 1000).toFixed(1) + 'KB';
      }
      case 'MB': {
        return (bytes / 1000 ** 2).toFixed(1) + 'MB';
      }
      default: {
        return bytes.toString();
      }
    }
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
