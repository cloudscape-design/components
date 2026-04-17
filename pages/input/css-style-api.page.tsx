// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { Input, SpaceBetween } from '~components';

import { SimplePage } from '../app/templates';
import './css-style-api.css';

export default function Page() {
  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState('Hello world');
  const [value3, setValue3] = useState('');
  const [value4, setValue4] = useState('');
  const [value5, setValue5] = useState('');
  const [value6, setValue6] = useState('Invalid value');

  return (
    <SimplePage title="Input CSS Style API">
      <SpaceBetween size="l">
        <div>
          <h2>Default input (no custom styling)</h2>
          <Input value={value1} onChange={e => setValue1(e.detail.value)} placeholder="Default placeholder" />
        </div>

        <div>
          <h2>Custom border and background</h2>
          <Input
            className="my-indigo"
            value={value2}
            onChange={e => setValue2(e.detail.value)}
            placeholder="Type something..."
          />
        </div>

        <div>
          <h2>Custom placeholder color and style</h2>
          <Input
            className="my-placeholder"
            value={value3}
            onChange={e => setValue3(e.detail.value)}
            placeholder="Custom placeholder text"
          />
        </div>

        <div>
          <h2>Disabled state</h2>
          <Input
            className="my-indigo"
            value="Disabled value"
            onChange={() => {}}
            disabled={true}
            placeholder="Disabled"
          />
        </div>

        <div>
          <h2>Read-only state</h2>
          <Input
            className="my-indigo"
            value="Read-only value"
            onChange={() => {}}
            readOnly={true}
          />
        </div>

        <div>
          <h2>Search type with icon</h2>
          <Input
            className="my-search"
            type="search"
            value={value4}
            onChange={e => setValue4(e.detail.value)}
            placeholder="Search..."
          />
        </div>

        <div>
          <h2>Custom focus ring (tab to see)</h2>
          <Input
            className="my-focus"
            value={value5}
            onChange={e => setValue5(e.detail.value)}
            placeholder="Focus me..."
          />
        </div>

        <div>
          <h2>Invalid state (hover to see custom hover styling)</h2>
          <Input
            className="my-invalid"
            value={value6}
            onChange={e => setValue6(e.detail.value)}
            invalid={true}
            placeholder="Invalid input..."
          />
        </div>
      </SpaceBetween>
    </SimplePage>
  );
}
