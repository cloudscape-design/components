// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Box, Input, Select } from '~components';
import AttributeEditor from '~components/attribute-editor';

import ScreenshotArea from '../utils/screenshot-area';

const longOptions = [
  { label: 'Thisisaverylonglonglonglonglonglonglonglonglonglonglonglonglonglabel', value: '0' },
  {
    label: 'This is a very longlonglonglong longlonglonglonglong longlonglonglonglabel with spaces',
    value: '1',
  },
];

const shortOptions = [
  { label: 'Short', value: '0' },
  {
    label: 'Short value 1',
    value: '1',
  },
];

export default function AttributeEditorSelect() {
  const [items, setItems] = React.useState([
    {
      key: 'some-key-1',
      value: 'some-value-1',
      longSelect: longOptions[0],
      shortSelect: shortOptions[0],
    },
    {
      key: 'some-key-2',
      value: 'some-value-2',
      longSelect: longOptions[1],
      shortSelect: shortOptions[1],
    },
  ]);

  return (
    <Box margin="xl">
      <h1>Attribute Editor - Long select</h1>
      <ScreenshotArea>
        <AttributeEditor
          items={items}
          hideAddButton={true}
          onRemoveButtonClick={({ detail: { itemIndex } }) => {
            const tmpItems = [...items];
            tmpItems.splice(itemIndex, 1);
            setItems(tmpItems);
          }}
          addButtonText="Add new item"
          removeButtonText="Remove"
          definition={[
            {
              label: 'Key',
              control: item => <Input value={item.key} placeholder="Enter key" onChange={() => {}} />,
            },
            {
              label: 'Long select',
              control: item => <Select selectedOption={item.longSelect} options={longOptions} />,
            },
            {
              label: 'Short select',
              control: item => <Select selectedOption={item.shortSelect} options={shortOptions} />,
            },
          ]}
        />
      </ScreenshotArea>
    </Box>
  );
}
