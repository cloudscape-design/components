// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Select, { SelectProps } from '~components/select';

import './scroll-padding.css';

const options: SelectProps.Options = [
  { value: 'first', label: 'Simple' },
  { value: 'second', label: 'With small icon', iconName: 'folder' },
  {
    value: 'third',
    label: 'With big icon icon',
    description: 'Very big option',
    iconSvg: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" focusable="false">
        <circle cx="8" cy="8" r="7" />
        <circle cx="8" cy="8" r="3" />
      </svg>
    ),
  },
  {
    label: 'Option group',
    options: [{ value: 'forth', label: 'Nested option' }],
  },
];

export default function () {
  const [selected, setSelected] = useState<SelectProps['selectedOption']>(null);

  return (
    <>
      <h1>Select with scroll padding</h1>

      <div
        style={{
          paddingBottom: 300,
        }}
      >
        <Select
          placeholder="Select an option"
          selectedOption={selected}
          options={options}
          onChange={event => setSelected(event.detail.selectedOption)}
          ariaLabel="select demo"
        />
      </div>
    </>
  );
}
