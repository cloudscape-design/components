// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import Select, { SelectProps } from '~components/select';

interface ExtendedWindow extends Window {
  __shrinkComponent?: (shrunk: boolean) => void;
}
declare const window: ExtendedWindow;

const options = [
  {
    value:
      'A very very very very very very very very very very very very very long option label that wraps upon resizing',
    tags: ['tag1', 'tag2'],
    filteringTags: ['bla', 'opt'],
    description: 'description1',
  },
  { value: 'Option 1', labelTag: 'This is a label tag' },
  { value: 'Option 2' },
  { value: 'Option', description: 'description2' },
];
export default function () {
  const [selectedOption, setSelectedOption] = useState<SelectProps['selectedOption']>(null);
  const [shrunk, setShrunk] = useState(false);
  window.__shrinkComponent = setShrunk;

  const style = shrunk ? { width: '100px' } : undefined;
  return (
    <div style={{ padding: 10 }}>
      <h1>Virtual select resizing</h1>
      <div style={style}>
        <Select
          selectedOption={selectedOption}
          options={options}
          onChange={event => setSelectedOption(event.detail.selectedOption)}
          ariaLabel={'simple select'}
          filteringType={'auto'}
        />
      </div>
    </div>
  );
}
