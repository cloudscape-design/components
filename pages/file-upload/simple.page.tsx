// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { FileUpload, FileUploadProps, FormField } from '~components';
import Box from '~components/box';
import SpaceBetween from '~components/space-between';

const KB = 1000;
const MB = 1000 ** 2;

export default function FileUploadScenario() {
  const [profileImageFile, setProfileImageFile] = useState<FileUploadProps.FileType>(null);
  const [profileImageError, setProfileError] = useState<string | null>(null);

  const [contractFiles, setContractFiles] = useState<FileUploadProps.FileType>(null);
  const [contractsError, setContractsError] = useState<string | null>(null);

  return (
    <Box margin="xl">
      <SpaceBetween size="m">
        <h1>File upload demo</h1>
        <SpaceBetween size="m" direction="horizontal">
          <FormField
            errorText={profileImageError}
            label="Profile picture"
            description="Upload a picture of yourself"
            constraintText="File size must not exceed 1 MB"
          >
            <FileUpload
              value={profileImageFile}
              onChange={event => {
                setProfileImageFile(event.detail.value);
                setProfileError(validateFileSize(event.detail.value, 1 * MB));
              }}
              buttonText="Choose file"
              accept="image/png, image/jpeg"
              showFileType={true}
              showFileSize={true}
              showFileLastModified={true}
              dismissAriaLabel="Dismiss"
            />
          </FormField>

          <FormField
            errorText={contractsError}
            label="Contracts"
            description="Upload your contract with all amendments"
            constraintText="File size must not exceed 250 KB. Combined file size must not exceed 500 KB"
          >
            <FileUpload
              multiple={true}
              value={contractFiles}
              onChange={event => {
                setContractFiles(event.detail.value);
                setContractsError(validateFileSize(event.detail.value, 250 * KB, 500 * KB));
              }}
              buttonText="Choose files"
              accept="application/pdf"
              showFileType={true}
              showFileSize={true}
              showFileLastModified={true}
              dismissAriaLabel="Dismiss"
            />
          </FormField>
        </SpaceBetween>
      </SpaceBetween>
    </Box>
  );
}

function validateFileSize(
  input: FileUploadProps.FileType,
  maxFileSize: number,
  maxTotalSize = maxFileSize
): null | string {
  if (!input) {
    return null;
  }

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
