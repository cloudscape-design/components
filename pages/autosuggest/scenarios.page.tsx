// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useState } from 'react';
import Autosuggest, { AutosuggestProps } from '~components/autosuggest';
import ScreenshotArea from '../utils/screenshot-area';

const options = [
  {
    label: 'group1',
    options: [
      {
        value: 'value1',
        label: 'label1',
      },
      {
        value: 'value1repeated',
        label: 'label1repeated',
      },
    ],
  },
  {
    label: 'group2',
    disabled: true,
    options: [
      {
        value: 'value2',
        label: 'label2',
      },
    ],
  },
  {
    label: 'group3',
    options: [
      {
        value: 'value3',
        label: 'label3',
      },
    ],
  },
  {
    label: 'group4',
    options: [
      {
        value: 'value4',
        label: 'label4',
        disabled: true,
      },
      {
        value: 'value5',
        label: 'label5',
        disabled: true,
      },
    ],
  },
  {
    label: 'group5',
    options: [
      {
        value: 'value6',
        label: 'label6',
      },
      {
        value: 'value7',
        label: 'label7',
      },
    ],
  },
];
const enteredTextLabel = (value: string) => `Use: ${value}`;

export default function AutosuggestScenario() {
  const [value, setValue] = useState('');
  const handleChange = useCallback<NonNullable<AutosuggestProps['onChange']>>(
    e => {
      setValue(e.detail.value);
    },
    [setValue]
  );
  return (
    <>
      <h1>Autosuggest scenarios</h1>
      <ScreenshotArea disableAnimations={true} style={{ blockSize: '500px' }}>
        <Autosuggest
          value={value}
          onChange={handleChange}
          enteredTextLabel={enteredTextLabel}
          options={options}
          ariaLabel="some label"
          selectedAriaLabel="selected"
        />
      </ScreenshotArea>
    </>
  );
}
