// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import { range } from 'lodash';

import { Autosuggest, Multiselect, Select } from '~components';

import { SimplePage } from './app/templates';

const options = range(0, 100).map(index => ({ value: (index + 1).toString() }));

export default function Page() {
  const [showError, setShowError] = useState(true);
  const [autosuggestValue, setAutosuggestValue] = useState('');

  const statusType = showError ? ('error' as const) : ('finished' as const);
  const errorText = showError ? 'Error' : undefined;
  const onLoadItems = ({ detail }: { detail: { samePage: boolean } }) => {
    if (detail.samePage) {
      setShowError(false);
    }
  };
  const asyncProps = { statusType, errorText, onLoadItems };

  return (
    <SimplePage
      title="Dropdown list placement test page"
      subtitle="Imitate async loading of dropdown list options that should cause dropdown position to change"
      i18n={{}}
    >
      <div style={{ position: 'absolute', insetBlockEnd: 150, insetInlineStart: 16, insetInlineEnd: 16 }}>
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ flex: 1 }}>
            <Autosuggest
              value={autosuggestValue}
              options={showError ? [] : options}
              onChange={event => setAutosuggestValue(event.detail.value)}
              ariaLabel="autosuggest"
              placeholder="autosuggest"
              {...asyncProps}
            />
          </div>

          <div style={{ flex: 1 }}>
            <Select
              options={showError ? [] : options}
              selectedOption={null}
              filteringType="auto"
              ariaLabel="select"
              placeholder="select"
              {...asyncProps}
            />
          </div>

          <div style={{ flex: 1 }}>
            <Multiselect
              options={showError ? [] : options}
              selectedOptions={[]}
              filteringType="auto"
              ariaLabel="multiselect"
              placeholder="multiselect"
              {...asyncProps}
            />
          </div>
        </div>
      </div>
    </SimplePage>
  );
}
