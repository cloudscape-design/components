// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';

import { Box, Button, Checkbox, Container, FileInput, Header, SpaceBetween, Table } from '~components';
import FileDropzone, { useFilesDragging } from '~components/file-dropzone';

import AppContext, { AppContextType } from '../app/app-context';
import ScreenshotArea from '../utils/screenshot-area';

type DemoContext = React.Context<
  AppContextType<{
    onlyVisibleOnDrag: boolean;
  }>
>;

export default function FileDropzoneContainer() {
  const [files, setFiles] = useState<File[]>([]);

  const [selectedItems, setSelectedItems] = useState<any>([]);
  const { urlParams, setUrlParams } = useContext(AppContext as DemoContext);
  const { onlyVisibleOnDrag } = urlParams;

  const handleFilesChange = (newFiles: File[]) => {
    const newValue = [...files, ...newFiles];
    setFiles(newValue);
  };

  const removeFiles = () => {
    const newValue = files.filter(file => !selectedItems.includes(file));
    setFiles(newValue);

    setSelectedItems([]);
  };

  const { areFilesDragging } = useFilesDragging();

  return (
    <ScreenshotArea>
      <SpaceBetween size="xl">
        <Header variant="h1">File dropzone: in container</Header>
        <Checkbox checked={onlyVisibleOnDrag} onChange={() => setUrlParams({ onlyVisibleOnDrag: !onlyVisibleOnDrag })}>
          Only visible on file drag
        </Checkbox>
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
            {!onlyVisibleOnDrag && (
              <FileDropzone onChange={(event: any) => handleFilesChange(event.detail.value)}>
                <Box color="inherit">Drop files here or select from below</Box>
                <FileInput
                  multiple={true}
                  value={files}
                  onChange={(event: any) => handleFilesChange(event.detail.value)}
                >
                  Choose files
                </FileInput>
              </FileDropzone>
            )}
            {areFilesDragging && onlyVisibleOnDrag ? (
              <FileDropzone onChange={(event: any) => handleFilesChange(event.detail.value)}>
                <Box color="inherit">Drop files here or select from below</Box>
                <FileInput
                  multiple={true}
                  value={files}
                  onChange={(event: any) => handleFilesChange(event.detail.value)}
                >
                  Choose files
                </FileInput>
              </FileDropzone>
            ) : (
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
                ariaLabels={{
                  selectionGroupLabel: 'group label',
                  allItemsSelectionLabel: ({ selectedItems }) => `${selectedItems.length} item selected`,
                  itemSelectionLabel: ({ selectedItems }, item) =>
                    `${item.name} is ${selectedItems.indexOf(item) < 0 ? 'not ' : ''}selected`,
                }}
                items={files}
                loadingText="Loading resources"
                sortingDisabled={true}
              />
            )}
          </SpaceBetween>
        </Container>
      </SpaceBetween>
    </ScreenshotArea>
  );
}
