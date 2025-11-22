// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';

import { SpaceBetween } from '~components';
import Select, { SelectProps } from '~components/select';

import ScreenshotArea from '../utils/screenshot-area';

const options: SelectProps.Options = Array.from({ length: 1000 }, (_, i) => ({
  value: `${i}`,
  label: `Option ${i + 1}`,
}));

export default function () {
  const [selected, setSelected] = useState<SelectProps['selectedOption']>(null);

  return (
    <>
      <h1>Virtual Scroll</h1>

      <ScreenshotArea
        style={{
          height: 500,
          // Prevents dropdown from expanding outside of the screenshot area
          overflow: 'auto',
        }}
      >
        <SpaceBetween size="s">
          <Select
            placeholder="Demo with manual filtering"
            selectedOption={selected}
            options={options}
            filteringType="auto"
            finishedText="End of all results"
            onChange={event => setSelected(event.detail.selectedOption)}
            virtualScroll={true}
            expandToViewport={false}
            ariaLabel="select demo"
            data-testid="select-demo"
          />
        </SpaceBetween>
      </ScreenshotArea>
    </>
  );
}
