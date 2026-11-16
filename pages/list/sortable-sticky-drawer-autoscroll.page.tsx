// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';

import { Box, Input, List, SegmentedControl, SpaceBetween } from '~components';

import AppContext, { AppContextType } from '../app/app-context';
import { SimplePage } from '../app/templates';

type Layout = 'drawer-scroller' | 'drawer' | 'drawer-nested' | 'container' | 'container-x' | 'page';

type PageContext = React.Context<AppContextType<{ layout: Layout; itemCount: string }>>;

interface Item {
  id: string;
  content: string;
}

const outerHeight = 600;
const innerHeight = 300;

function createItems(count: number): Item[] {
  return Array.from({ length: count }, (_, index) => ({ id: `item-${index + 1}`, content: `Item ${index + 1}` }));
}

function SortableList({ itemCount }: { itemCount: number }) {
  const [items, setItems] = useState<readonly Item[]>(() => createItems(itemCount));
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

function FillerRows({ count, prefix }: { count: number; prefix: string }) {
  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <Box key={index} padding="xxs">
          {prefix} row {index + 1}
        </Box>
      ))}
    </>
  );
}

function StickyDrawerLayout({ layout, itemCount }: { layout: Layout; itemCount: number }) {
  const ownScroller = layout !== 'drawer';
  return (
    <div data-testid="outer-scroller" style={{ blockSize: outerHeight, overflow: 'auto', display: 'flex' }}>
      <div style={{ flex: 1 }}>
        <FillerRows count={150} prefix="Main content" />
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
        {layout === 'drawer-nested' ? (
          <div data-testid="drawer-list-scroller" style={{ flex: 1, overflow: 'auto' }}>
            <FillerRows count={10} prefix="Drawer content" />
            <div data-testid="inner-scroller" style={{ blockSize: innerHeight, overflowY: 'auto' }}>
              <SortableList itemCount={itemCount} />
            </div>
            <FillerRows count={30} prefix="Drawer content" />
          </div>
        ) : ownScroller ? (
          <div data-testid="drawer-list-scroller" style={{ flex: 1, overflow: 'auto' }}>
            <SortableList itemCount={itemCount} />
          </div>
        ) : (
          <SortableList itemCount={itemCount} />
        )}
      </aside>
    </div>
  );
}

function ContainerLayout({ layout, itemCount }: { layout: Layout; itemCount: number }) {
  const style: React.CSSProperties =
    layout === 'container-x'
      ? { blockSize: innerHeight, overflowX: 'auto', overflowY: 'hidden' }
      : { blockSize: innerHeight, overflowY: 'auto' };
  return (
    <div>
      <FillerRows count={20} prefix="Page content" />
      <div data-testid="inner-scroller" style={{ ...style, border: '1px solid gray' }}>
        <SortableList itemCount={itemCount} />
      </div>
      <FillerRows count={60} prefix="Page content" />
    </div>
  );
}

export default function SortableListAutoScrollPage() {
  const {
    urlParams: { layout = 'drawer-scroller', itemCount = '30' },
    setUrlParams,
  } = useContext(AppContext as PageContext);
  const parsedItemCount = Math.max(1, parseInt(itemCount, 10) || 30);
  const content =
    layout === 'page' ? (
      <SortableList itemCount={parsedItemCount} />
    ) : layout === 'container' || layout === 'container-x' ? (
      <ContainerLayout layout={layout} itemCount={parsedItemCount} />
    ) : (
      <StickyDrawerLayout layout={layout} itemCount={parsedItemCount} />
    );
  return (
    <SimplePage
      title="Sortable list auto-scroll"
      screenshotArea={{}}
      settings={
        <SpaceBetween size="s" direction="horizontal">
          <SegmentedControl
            label="Layout"
            selectedId={layout}
            onChange={({ detail }) => setUrlParams({ layout: detail.selectedId as Layout })}
            options={[
              { id: 'drawer-scroller', text: 'Sticky drawer with own scroller' },
              { id: 'drawer', text: 'Sticky drawer without own scroller' },
              { id: 'drawer-nested', text: 'Nested scroller in sticky drawer' },
              { id: 'container', text: 'Fixed-height container' },
              { id: 'container-x', text: 'Horizontal-only container' },
              { id: 'page', text: 'Page flow' },
            ]}
          />
          <Input
            type="number"
            ariaLabel="Item count"
            value={itemCount}
            onChange={({ detail }) => setUrlParams({ itemCount: detail.value })}
          />
        </SpaceBetween>
      }
    >
      <div key={`${layout}-${parsedItemCount}`}>{content}</div>
    </SimplePage>
  );
}
