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
                setProfileError(validateFileSize(event.detail.value, 1 * 1024 ** 2));
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
                setDocumentsError(validateFileSize(event.detail.value, 1 * 1024 ** 2));
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

function validateFileSize(input: FileUploadProps.FileType, maxSize: number): null | string {
  if (input instanceof File) {
    return input.size <= maxSize ? null : 'File is too large';
  }
  if (Array.isArray(input)) {
    const totalSize = input.reduce((sum, file) => sum + file.size, 0);
    return totalSize <= maxSize ? null : 'Files are too large';
  }
  return null;
}
