// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';

import Select, { SelectProps } from '~components/select';

import { SimplePage } from '../app/templates';

const options: SelectProps.Options = Array.from({ length: 1000 }, (_, i) => ({
  value: `${i}`,
  label: `Option ${i + 1}`,
}));

export default function () {
  const [selected, setSelected] = useState<SelectProps['selectedOption']>(null);

  return (
    <SimplePage title="Select Virtual Scroll" i18n={{}} screenshotArea={{}}>
      <div
        style={{
          height: 500,
          padding: 10,
          // Prevents dropdown from expanding outside of the screenshot area
          overflow: 'auto',
        }}
      >
        <Select
          placeholder="Select with virtual scroll"
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
      </div>
    </SimplePage>
  );
}
