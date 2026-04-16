// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { Checkbox, SpaceBetween, Table } from '~components';

import { SimplePage } from '../app/templates';
import { ariaLabels, createSimpleItems, simpleColumns } from './shared-configs';
import './css-style-api.css';

export default function Page() {
  const [selectedItems, setSelectedItems] = useState([{ number: 1, text: 'One' }]);
  const [standaloneChecked, setStandaloneChecked] = useState(true);

  return (
    <SimplePage title="CSS Style API — Table & Checkbox">
      <SpaceBetween size="l">
        <div>
          <h3>Standalone checkboxes (circular via CSS override)</h3>
          <SpaceBetween size="s" direction="horizontal">
            <Checkbox checked={standaloneChecked} onChange={e => setStandaloneChecked(e.detail.checked)}>
              Option A
            </Checkbox>
            <Checkbox checked={false} onChange={() => {}}>
              Option B
            </Checkbox>
          </SpaceBetween>
        </div>

        <div>
          <h3>Table with selection (square checkboxes, scaled up via CSS override)</h3>
          <Table
            columnDefinitions={simpleColumns}
            items={createSimpleItems(4)}
            selectionType="multi"
            selectedItems={selectedItems}
            trackBy="text"
            onSelectionChange={({ detail }) => setSelectedItems(detail.selectedItems)}
            ariaLabels={ariaLabels}
          />
        </div>
      </SpaceBetween>
    </SimplePage>
  );
}
