// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { Box, Button, Container, FileDropzone, Header, SpaceBetween, Table } from '~components';

export default function FileDropzoneContainer() {
  const [files, setFiles] = useState<File[]>([]);

  const [selectedItems, setSelectedItems] = useState<any>([]);

  const handleFilesChange = (newFiles: File[]) => {
    const newValue = [...files, ...newFiles];
    setFiles(newValue);
  };

  const removeFiles = () => {
    const newValue = files.filter(file => !selectedItems.map((item: any) => item.name).includes(file.name));
    setFiles(newValue);

    setSelectedItems([]);
  };

  return (
    <Box margin="xl">
      <SpaceBetween size="xl">
        <Header variant="h1">File dropzone: in container</Header>
        <Container
          header={
            <Header
              actions={
                <Button disabled={selectedItems.length === 0} onClick={removeFiles}>
                  {selectedItems.length > 1 ? 'Remove files' : 'Remove file'}
                </Button>
              }
            >
              Attachments
            </Header>
          }
        >
          <SpaceBetween size="l">
            <FileDropzone onChange={(event: any) => handleFilesChange(event.detail.value)}>
              <Box fontWeight="bold" color="text-body-secondary">
                Drop files here
              </Box>
            </FileDropzone>
            <Table
              variant="embedded"
              empty={'No files uploaded'}
              selectionType={'multi'}
              onSelectionChange={({ detail }) => setSelectedItems(detail.selectedItems)}
              selectedItems={selectedItems}
              trackBy="name"
              columnDefinitions={[
                {
                  id: 'file-name',
                  header: 'File name',
                  cell: item => item.name || '-',
                  sortingField: 'name',
                  isRowHeader: true,
                },
                {
                  id: 'file-type',
                  header: 'File type',
                  cell: item => item.type || '-',
                  sortingField: 'alt',
                },
                {
                  id: 'file-size',
                  header: 'File size',
                  cell: item => item.size || '-',
                },
              ]}
              enableKeyboardNavigation={true}
              items={files.map(file => ({
                name: file.name,
                type: file.type,
                size: file.size,
              }))}
              loadingText="Loading resources"
              sortingDisabled={true}
            />
          </SpaceBetween>
        </Container>
      </SpaceBetween>
    </Box>
  );
}
