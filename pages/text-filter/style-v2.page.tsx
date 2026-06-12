// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';

import { Checkbox, TextFilter } from '~components';

import { SimplePage } from '../app/templates';

import styles from './style-v2.scss';

export default function StyleV2TextFilterPage() {
  const [filterText, setFilterText] = useState('instance');
  const [disabled, setDisabled] = useState(false);

  const matchCount = ['instance-1', 'instance-2', 'instance-3', 'my-server', 'database-primary'].filter(item =>
    item.includes(filterText.toLowerCase())
  ).length;

  return (
    <SimplePage
      title="TextFilter with Style API v2"
      screenshotArea={{}}
      settings={
        <Checkbox checked={disabled} onChange={({ detail }) => setDisabled(detail.checked)}>
          disabled
        </Checkbox>
      }
    >
      <TextFilter
        filteringText={filterText}
        onChange={({ detail }) => setFilterText(detail.filteringText)}
        filteringPlaceholder="Filter resources..."
        countText={`${matchCount} match${matchCount !== 1 ? 'es' : ''}`}
        disabled={disabled}
        classNames={{ root: styles['styled-text-filter'], clearButton: styles['styled-tf-clear'] }}
      />
    </SimplePage>
  );
}
