// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import {
  Box,
  FileDropzone,
  FileInput,
  FileTokenGroup,
  FormField,
  Header,
  Icon,
  PromptInput,
  SpaceBetween,
} from '~components';

import { i18nStrings } from '../file-upload/shared';
import { useDropzoneVisible } from '../file-upload/use-dropzone-visible';

export default function PromptInputWithFileUpload() {
  const [textareaValue, setTextareaValue] = useState('');
  const [files, setFiles] = useState<File[]>([]);

  const isFileBeingDragged = useDropzoneVisible(true);

  const handleFilesChange = (newFiles: File[]) => {
    const newValue = [...files, ...newFiles];
    setFiles(newValue);
  };

  const onDismiss = (event: { detail: { fileIndex: number } }) => {
    const newItems = [...files];
    newItems.splice(event.detail.fileIndex, 1);
    setFiles(newItems);
  };

  return (
    <Box margin="xl">
      <SpaceBetween size="xl">
        <Header variant="h1">Prompt input with file upload</Header>
        <FormField>
          <PromptInput
            ariaLabel="Chat input"
            actionButtonIconName="send"
            actionButtonAriaLabel="Submit prompt"
            value={textareaValue}
            onChange={(event: any) => setTextareaValue(event.detail.value)}
            onAction={(event: any) => window.alert(`Submitted the following: ${event.detail.value}`)}
            placeholder="Ask a question"
            maxRows={4}
            disableSecondaryActionsPaddings={true}
            secondaryActions={
              <Box padding={{ left: 'xxs', top: 'xs' }}>
                <FileInput
                  variant="icon"
                  multiple={true}
                  value={files}
                  onChange={(event: any) => handleFilesChange(event.detail.value)}
                  i18nStrings={i18nStrings}
                />
              </Box>
            }
            secondaryContent={
              isFileBeingDragged ? (
                <FileDropzone onChange={(event: any) => handleFilesChange(event.detail.value)}>
                  <SpaceBetween size="xs" alignItems="center">
                    <Icon name="upload" />
                    Drop files here
                  </SpaceBetween>
                </FileDropzone>
              ) : files.length > 0 ? (
                <>
                  <FileTokenGroup
                    alignment="horizontal"
                    items={files.map(file => ({
                      file,
                      errorText: file.size > 5000000 ? 'File size cannot exceed 5MB' : undefined,
                    }))}
                    showFileLastModified={true}
                    showFileSize={true}
                    showFileThumbnail={true}
                    i18nStrings={i18nStrings}
                    onDismiss={onDismiss}
                  />
                </>
              ) : undefined
            }
          />
        </FormField>
      </SpaceBetween>
    </Box>
  );
}
