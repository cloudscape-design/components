// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '~components/box';
import Container from '~components/container';
import TreeView from '~components/tree-view';

import { items } from './items/deeply-nested-items';

export default function TreeViewWithHorizontalScroll() {
  const [expandedItems, setExpandedItems] = useState<Array<string>>(items.map(i => i.id));

  return (
    <Box margin="m">
      <h1>Tree view with deep nesting</h1>

      <div style={{ maxWidth: '300px' }}>
        <Container>
          <div tabIndex={0} aria-label="TreeView container" style={{ overflowX: 'auto' }}>
            <div style={{ minWidth: '350px' }}>
              <TreeView
                ariaLabel="TreeView with deep nesting"
                items={items.filter(item => !item.parent)}
                renderItem={item => ({ content: item.content })}
                getItemId={item => item.id}
                getItemChildren={item => items.filter(i => i.parent === item.id)}
                expandedItems={expandedItems}
                onItemToggle={({ detail }: any) =>
                  setExpandedItems(prev =>
                    detail.expanded ? [...prev, detail.item.id] : prev.filter(id => id !== detail.item.id)
                  )
                }
                i18nStrings={{
                  expandButtonLabel: () => 'Expand item',
                  collapseButtonLabel: () => 'Collapse item',
                }}
              />
            </div>
          </div>
        </Container>
      </div>
    </Box>
  );
}
