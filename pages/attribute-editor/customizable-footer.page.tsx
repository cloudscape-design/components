// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { Box, Button, Input, SpaceBetween } from '~components';
import AttributeEditor from '~components/attribute-editor';

import ScreenshotArea from '../utils/screenshot-area';

export default function AttributeEditorPage() {
  const [items] = useState([
    { key: 'example', value: 'value' },
    { key: 'example 2', value: 'value 2' },
  ]);

  const definition = [
    {
      label: 'Key',
      control: ({ key = '' }) => <Input value={key} readOnly={true} />,
    },
    {
      label: 'Value',
      control: ({ value = '' }) => <Input value={value} readOnly={true} />,
    },
  ];

  return (
    <Box margin="xl">
      <h1>Attribute Editor - Additional Actions</h1>
      <h1>Attribute Editor permutations</h1>
      <ScreenshotArea>
        <SpaceBetween size="m">
          <AttributeEditor
            addButtonText={'Add Item'}
            hideAddButton={false}
            additionalActions={[
              <Button key="import" variant="normal">
                Import
              </Button>,
              <Button key="export" variant="normal">
                Export
              </Button>,
              <Button key="long-text" variant="normal">
                A very long button text to try out wrapping to a second row
              </Button>,
            ]}
            items={items}
            definition={definition}
            removeButtonText="Remove"
            empty="No items"
          />
          <AttributeEditor
            addButtonText={'Add Item'}
            hideAddButton={true}
            additionalActions={[
              <Button key="import" variant="primary">
                Import
              </Button>,
              <Button key="export" variant="normal">
                Export
              </Button>,
              <Button key="long-text" variant="normal">
                A very long button text to try out wrapping to a second row
              </Button>,
            ]}
            items={items}
            definition={definition}
            removeButtonText="Remove"
            empty="No items"
          />
          <AttributeEditor
            addButtonText={'Add Item'}
            hideAddButton={true}
            items={items}
            definition={definition}
            removeButtonText="Remove"
            empty="No items"
          />
        </SpaceBetween>
      </ScreenshotArea>
    </Box>
  );
}
