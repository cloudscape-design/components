// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';

import { Box, Checkbox, FileInput, FileTokenGroup, FileUploadProps, FormField, Header, PromptInput } from '~components';
import SpaceBetween from '~components/space-between';

import { useContractFilesForm } from './page-helpers';
import { i18nStrings } from './shared';
import { useDropzoneVisible } from './use-dropzone-visible';
import { validateContractFiles } from './validations';

export default function FileUploadScenarioStandalone() {
  const contractsRef = useRef<FileUploadProps.Ref>(null);
  const [textareaValue, setTextareaValue] = useState('');

  const [acceptMultiple, setAcceptMultiple] = useState(true);
  const [verticalAlign, setVerticalAlign] = useState(false);
  const formState = useContractFilesForm();

  const isDropzoneVisible = useDropzoneVisible(acceptMultiple);

  // const contractsValidationErrors = validateContractFiles(formState.files);
  // const contractsErrors = contractsValidationErrors ?? formState.fileErrors;

  const hasError = formState.status === 'error';
  useEffect(() => {
    if (hasError) {
      contractsRef.current?.focus();
    }
  }, [hasError]);

  const handleFilesChange = (newFiles: File[]) => {
    const newValue = acceptMultiple ? [...formState.files, ...newFiles] : newFiles[0] ? newFiles : [...formState.files];
    formState.onFilesChange(newValue);
    formState.onUploadFiles(!validateContractFiles(newValue) ? newValue : []);
  };

  const onDismiss = (event: { detail: { fileIndex: number } }) => {
    const newItems = [...formState.files];
    newItems.splice(event.detail.fileIndex, 1);
    formState.onFilesChange(newItems);
  };

  return (
    <Box margin="xl">
      {isDropzoneVisible ? (
        'dropping files'
      ) : (
        <SpaceBetween size="xl">
          <Header variant="h1">File upload: deconstructed</Header>

          <Checkbox checked={acceptMultiple} onChange={event => setAcceptMultiple(event.detail.checked)}>
            Accept multiple files
          </Checkbox>
          <Checkbox checked={verticalAlign} onChange={event => setVerticalAlign(event.detail.checked)}>
            Vertical alignment
          </Checkbox>

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
                    ref={contractsRef}
                    multiple={acceptMultiple}
                    value={formState.files}
                    onChange={handleFilesChange}
                    i18nStrings={i18nStrings}
                  />
                </Box>
              }
              secondaryContent={
                formState.files.length > 0 ? (
                  <FileTokenGroup
                    alignment={verticalAlign ? 'vertical' : 'horizontal'}
                    items={formState.files.map(file => ({
                      file,
                      loading: formState.status === 'uploading',
                      errorText: file.size > 5000000 ? 'File size cannot exceed 5MB' : undefined,
                    }))}
                    showFileLastModified={true}
                    showFileSize={true}
                    showFileThumbnail={true}
                    i18nStrings={i18nStrings}
                    onDismiss={onDismiss}
                  />
                ) : undefined
              }
            />
          </FormField>

          <FormField
            label={acceptMultiple ? 'Contracts' : 'Contract'}
            description={acceptMultiple ? 'Upload your contract with all amendments' : 'Upload your contract'}
          >
            <FileInput
              variant="icon"
              ref={contractsRef}
              multiple={acceptMultiple}
              value={formState.files}
              onChange={handleFilesChange}
              //   accept="application/pdf, image/*"
              i18nStrings={i18nStrings}
            />
          </FormField>

          <FileTokenGroup
            alignment={verticalAlign ? 'vertical' : 'horizontal'}
            items={formState.files.map(file => ({
              file,
              loading: formState.status === 'uploading',
              errorText: file.size > 5000000 ? 'File size cannot exceed 5MB' : undefined,
            }))}
            showFileLastModified={true}
            showFileSize={true}
            showFileThumbnail={true}
            i18nStrings={i18nStrings}
            onDismiss={onDismiss}
          />
        </SpaceBetween>
      )}
    </Box>
  );
}
