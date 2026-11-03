// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';

import { Box, List, SegmentedControl } from '~components';

import AppContext, { AppContextType } from '../app/app-context';
import { SimplePage } from '../app/templates';

type Layout = 'drawer-scroller' | 'drawer' | 'page';

type PageContext = React.Context<AppContextType<{ layout: Layout }>>;

interface Item {
  id: string;
  content: string;
}

const initialItems: Item[] = Array.from({ length: 30 }, (_, index) => ({
  id: `item-${index + 1}`,
  content: `Item ${index + 1}`,
}));

const outerHeight = 600;

function SortableList() {
  const [items, setItems] = useState<readonly Item[]>(initialItems);
  return (
    <List
      ariaLabel="Sortable list"
      items={items}
      sortable={true}
      renderItem={item => ({ id: item.id, content: item.content })}
      onSortingChange={event => setItems(event.detail.items)}
    />
  );
}

function StickyDrawerLayout({ ownScroller }: { ownScroller: boolean }) {
  return (
    <div data-testid="outer-scroller" style={{ blockSize: outerHeight, overflow: 'auto', display: 'flex' }}>
      <div style={{ flex: 1 }}>
        {Array.from({ length: 150 }, (_, index) => (
          <Box key={index} padding="xxs">
            Main content row {index + 1}
          </Box>
        ))}
      </div>
      <aside
        data-testid="sticky-drawer"
        style={{
          position: 'sticky',
          insetBlockStart: 0,
          alignSelf: 'flex-start',
          inlineSize: 320,
          blockSize: ownScroller ? outerHeight : undefined,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box variant="h2" padding="s">
          Drawer
        </Box>
        {ownScroller ? (
          <div data-testid="drawer-list-scroller" style={{ flex: 1, overflow: 'auto' }}>
            <SortableList />
          </div>
        ) : (
          <SortableList />
        )}
      </aside>
    </div>
  );
}

export default function SortableListAutoScrollPage() {
  const {
    urlParams: { layout = 'drawer-scroller' },
    setUrlParams,
  } = useContext(AppContext as PageContext);
  return (
    <SimplePage
      title="Sortable list auto-scroll"
      screenshotArea={{}}
      settings={
        <SegmentedControl
          label="Layout"
          selectedId={layout}
          onChange={({ detail }) => setUrlParams({ layout: detail.selectedId as Layout })}
          options={[
            { id: 'drawer-scroller', text: 'Sticky drawer with own scroller' },
            { id: 'drawer', text: 'Sticky drawer without own scroller' },
            { id: 'page', text: 'Page flow' },
          ]}
        />
      }
    >
      {layout === 'page' ? <SortableList /> : <StickyDrawerLayout ownScroller={layout === 'drawer-scroller'} />}
    </SimplePage>
  );
}
