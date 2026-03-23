// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';

import Autosuggest, { AutosuggestProps } from '~components/autosuggest';

import { SimplePage } from '../app/templates';

const autosuggestOptions: AutosuggestProps.Options = Array.from({ length: 1000 }, (_, i) => ({
  value: `Option ${i + 1}`,
  description: `Description for option ${i + 1}`,
}));

export default function () {
  const [autosuggestValue, setAutosuggestValue] = useState('');

  return (
    <SimplePage title="Autosuggest Virtual Scroll" i18n={{}} screenshotArea={{}}>
      <div
        style={{
          height: 500,
          padding: 10,
          // Prevents dropdown from expanding outside of the screenshot area
          overflow: 'auto',
        }}
      >
        <Autosuggest
          value={autosuggestValue}
          options={autosuggestOptions}
          onChange={event => setAutosuggestValue(event.detail.value)}
          enteredTextLabel={value => `Use: "${value}"`}
          placeholder="Autosuggest with virtual scroll"
          ariaLabel="autosuggest demo"
          virtualScroll={true}
          expandToViewport={false}
          data-testid="autosuggest-demo"
        />
      </div>
    </SimplePage>
  );
}
