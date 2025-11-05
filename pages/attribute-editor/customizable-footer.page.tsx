// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { Box, Button, Checkbox, Input, SpaceBetween } from '~components';
import AttributeEditor from '~components/attribute-editor';

export default function AttributeEditorPage() {
  const [showAdditionalActions, setShowAdditionalActions] = useState(true);
  const [hideAddButton, setHideAddButton] = useState(false);
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
      <h1>Attribute Editor - Additional Actions</h1>
      <SpaceBetween size="m">
        <SpaceBetween size="xs" direction="horizontal">
          <Checkbox onChange={({ detail }) => setShowAdditionalActions(detail.checked)} checked={showAdditionalActions}>
            Show additional Actions
          </Checkbox>
          <Checkbox onChange={({ detail }) => setHideAddButton(detail.checked)} checked={hideAddButton}>
            Hide Add Button
          </Checkbox>
        </SpaceBetween>
        <AttributeEditor
          addButtonText={'Add Item'}
          hideAddButton={hideAddButton}
          additionalActions={showAdditionalActions ? <Button variant="link">Hello World</Button> : undefined}
          items={items}
          definition={definition}
          removeButtonText="Remove"
          empty="No items"
        />
      </SpaceBetween>
    </Box>
  );
}
