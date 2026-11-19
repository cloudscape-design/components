// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { useState } from 'react';

import Button from '~components/button';
import Dropdown from '~components/dropdown';
import List from '~components/list';

import { SimplePage } from '../app/templates';

export default function DropdownScenario() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { content: 'Reorderable item 1' },
    { content: 'Reorderable item 2' },
    { content: 'Reorderable item 3' },
    { content: 'Reorderable item 4' },
    { content: 'Reorderable item 5' },
  ]);
  return (
    <SimplePage title="Dropdown with reorderable list">
      <Dropdown
        trigger={<Button onClick={() => setOpen(!open)}>Open dropdown</Button>}
        open={open}
        onOutsideClick={() => setOpen(false)}
        content={
          <List
            items={items}
            sortable={true}
            ariaLabel="Reorderable list"
            renderItem={item => ({ id: item.content, content: item.content })}
            onSortingChange={({ detail }) => setItems([...detail.items])}
          />
        }
      />
    </SimplePage>
  );
}
