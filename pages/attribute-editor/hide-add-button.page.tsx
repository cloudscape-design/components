// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { Box, Input } from '~components';
import AttributeEditor from '~components/attribute-editor';

export default function AttributeEditorPage() {
  const [items] = useState([
    { key: 'example', value: 'value' },
    { key: 'example 2', value: 'value 2' },
  ]);

  const definition = [
    {
      label: 'Key',
      control: ({ key = '' }) => <Input value={key} />,
    },
    {
      label: 'Value',
      control: ({ value = '' }) => <Input value={value} />,
    },
  ];

  return (
    <Box margin="xl">
      <h1>Attribute Editor - Hide Add Button</h1>
      <AttributeEditor
        addButtonText={''}
        hideAddButton={true}
        items={items}
        definition={definition}
        removeButtonText="Remove"
        empty="No items"
      />
    </Box>
  );
}
