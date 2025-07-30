// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Input from '~components/input';
import Select from '~components/select';
import SpaceBetween from '~components/space-between';

import ScreenshotArea from '../utils/screenshot-area';

function Inputs() {
  return (
    <SpaceBetween size="xs">
      <div>
        <Input ariaLabel="input" placeholder="Enter something" value="" />
        <Select placeholder="Enter something" selectedOption={null} />
      </div>

      <div>
        <Input ariaLabel="input" value="Something" />
        <Select selectedOption={{ label: 'Label', value: 'value' }} />
      </div>

      <div>
        <Input ariaLabel="input" value="Something" readOnly={true} />
        <Select selectedOption={{ label: 'Label', value: 'value' }} readOnly={true} />
      </div>

      <div>
        <Input ariaLabel="input" value="Something" disabled={true} />
        <Select selectedOption={{ label: 'Label', value: 'value' }} disabled={true} />
      </div>

      <div>
        <Input ariaLabel="input" value="Something" readOnly={true} disabled={true} />
        <Select selectedOption={{ label: 'Label', value: 'value' }} readOnly={true} disabled={true} />
      </div>
    </SpaceBetween>
  );
}

export default function InputsPage() {
  return (
    <div style={{ padding: 10 }}>
      <h1>Inputs VS Selects demo</h1>
      <ScreenshotArea>
        <Inputs />
      </ScreenshotArea>
    </div>
  );
}
