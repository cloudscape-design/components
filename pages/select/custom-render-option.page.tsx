// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { useState } from 'react';

import { Button } from '~components';
import Select, { SelectProps } from '~components/select';

import { SimplePage } from '../app/templates';

const lotsOfOptions = [...Array(50).keys()].map(n => {
  const numberToDisplay = (n + 5).toString();
  return {
    value: numberToDisplay,
    label: `Option ${n + 5}`,
  };
});

const options: SelectProps.Options = [
  { value: 'first', label: 'Simple' },
  { value: 'second', label: 'With small icon', iconName: 'folder' },
  {
    value: 'third',
    label: 'With big icon icon',
    description: 'Very big option',
    iconName: 'heart',
    disabled: true,
    disabledReason: 'disabled reason',
    tags: ['Cool', 'Intelligent', 'Cat'],
  },
  {
    label: 'Option group',
    options: [{ value: 'forth', label: 'Nested option' }],
    disabledReason: 'disabled reason',
  },
  ...lotsOfOptions,
  { label: 'Last option', disabled: true, disabledReason: 'disabled reason' },
];

export default function SelectPage() {
  const [virtualScroll, setVirtualScroll] = React.useState(false);
  const [selectedOption, setSelectedOption] = useState<SelectProps.Option | null>(null);
  const renderOption: SelectProps.SelectOptionItemRenderer = ({ item }) => {
    if (item.type === 'trigger') {
      return <div>Trigger: {item.option.label}</div>;
    } else if (item.type === 'group') {
      return <div>Group: {item.option.label}</div>;
    } else if (item.type === 'item') {
      return <div>Item: {item.option.label}</div>;
    }
    return null;
  };

  return (
    <SimplePage
      title="Select with custom item renderer"
      settings={
        <Button
          data-testid="toggle-virtual-scroll"
          onClick={() => {
            setVirtualScroll(prevValue => !prevValue);
          }}
        >
          {virtualScroll ? 'Disable' : 'Enable'} Virtual Scroll
        </Button>
      }
      screenshotArea={{
        style: {
          padding: 10,
        },
      }}
    >
      <div style={{ maxInlineSize: '400px', blockSize: '650px' }}>
        <Select
          virtualScroll={virtualScroll}
          filteringType="auto"
          renderOption={renderOption}
          placeholder={'Choose option ' + (virtualScroll ? '(virtual)' : '')}
          selectedOption={selectedOption}
          onChange={({ detail }) => setSelectedOption(detail.selectedOption)}
          options={options}
          triggerVariant="option"
        />
      </div>
    </SimplePage>
  );
}
