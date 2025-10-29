// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';

import { SpaceBetween } from '~components';
import Select, { SelectProps } from '~components/select';

import ScreenshotArea from '../utils/screenshot-area';

const options: SelectProps.Options = [
  { value: 'first', label: 'Simple' },
  { value: 'second', label: 'With small icon', iconAriaLabel: 'folder icon alt label', iconName: 'folder' },
  {
    value: 'third',
    label: 'With big icon icon',
    description: 'Very big option',
    iconAriaLabel: 'very big option icon alt label',
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
const options2: SelectProps.Options = [
  {
    label: 'Option group',
    options: [{ value: 'forth', label: 'Nested option' }],
  },
];

const options3: SelectProps.Options = [
  {
    label: 'Option 1',
    value: '1',
    iconName: 'settings',
  },
  {
    label: 'Option 2',
    value: '2',
    iconName: 'unlocked',
  },
  {
    label: 'Option 3',
    value: '3',
    iconName: 'share',
  },
];

export default function () {
  const [selected, setSelected] = useState<SelectProps['selectedOption']>(null);
  const [virtualScroll, setVirtualScroll] = useState<boolean>(false);
  return (
    <>
      <h1>Select for screenshot</h1>

      <button id="toggle-virtual" onClick={() => setVirtualScroll(vs => !vs)}>
        Toggle virtual scroll
      </button>

      <ScreenshotArea
        style={{
          // extra space to include dropdown in the screenshot area
          paddingBlockEnd: 300,
        }}
      >
        <SpaceBetween size="s">
          <Select
            placeholder="Demo with manual filtering"
            selectedOption={selected}
            options={options}
            filteringType="manual"
            finishedText="End of all results"
            onChange={event => setSelected(event.detail.selectedOption)}
            virtualScroll={virtualScroll}
            ariaLabel="select demo"
            data-testid="select-demo"
          />

          <Select
            placeholder="Demo with no filtering"
            selectedOption={selected}
            options={options}
            finishedText="End of all results"
            onChange={event => setSelected(event.detail.selectedOption)}
            virtualScroll={virtualScroll}
            ariaLabel="select demo no filtering"
            data-testid="select-demo-no-filtering"
          />

          <Select
            placeholder="Demo with a single option inside group"
            selectedOption={selected}
            options={options2}
            finishedText="End of all results"
            onChange={event => setSelected(event.detail.selectedOption)}
            virtualScroll={virtualScroll}
            ariaLabel="select demo single option inside group"
            data-testid="select-demo-single-option-inside-group"
          />

          <div style={{ width: '100px' }}>
            <Select
              placeholder="Demo with no filtering and limited width"
              selectedOption={selected}
              options={options3}
              onChange={event => setSelected(event.detail.selectedOption)}
              virtualScroll={virtualScroll}
              ariaLabel="select demo with no filtering and limited width"
              data-testid="select-demo-with-no-filtering-and-limited-width"
            />
          </div>
        </SpaceBetween>
      </ScreenshotArea>
    </>
  );
}
