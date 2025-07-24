// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';

import Box from '~components/box';
import Checkbox from '~components/checkbox';
import TreeView from '~components/tree-view';

import AppContext, { AppContextType } from '../app/app-context';
import ScreenshotArea from '../utils/screenshot-area';
import {
  getAllExpandableItemIds,
  Item,
  longTextItems,
  statusIndicatorItems,
  textItems,
} from './items/permutations-items';

type PageContext = React.Context<
  AppContextType<{
    expandAll?: boolean;
  }>
>;

interface Permutation {
  title: string;
  items: Item[];
}

const textPermutation: Permutation = {
  title: 'Tree view with only text',
  items: textItems,
};

const longTextPermutation: Permutation = {
  title: 'Tree view with long text',
  items: longTextItems,
};

const statusIndicatorPermutation: Permutation = {
  title: 'Tree view with status indicators',
  items: statusIndicatorItems,
};

export default function TreeViewPermuations() {
  const { urlParams, setUrlParams } = useContext(AppContext as PageContext);

  return (
    <ScreenshotArea disableAnimations={true}>
      <h1>Tree view permutations</h1>

      <Checkbox
        checked={urlParams.expandAll ?? false}
        onChange={event => {
          setUrlParams({ expandAll: event.detail.checked });
          window.location.reload();
        }}
      >
        Expand all
      </Checkbox>

      {[textPermutation, longTextPermutation, statusIndicatorPermutation].map((permutation, index) => (
        <Permutation key={index} {...permutation} expandAll={urlParams.expandAll} />
      ))}
    </ScreenshotArea>
  );
}

function Permutation({ title, items, expandAll }: Permutation & { expandAll?: boolean }) {
  const [expandedItems, setExpandedItems] = useState(expandAll ? getAllExpandableItemIds(items) : []);

  return (
    <div>
      <h2>{title}</h2>
      <TreeView
        ariaLabel={title}
        items={items}
        renderItem={item => ({
          ...item,
          secondaryContent: item.secondaryContent ? (
            <Box color="text-status-inactive">{item.secondaryContent}</Box>
          ) : undefined,
        })}
        getItemId={item => item.id}
        getItemChildren={item => item.children}
        i18nStrings={{
          expandButtonLabel: () => 'Expand item',
          collapseButtonLabel: () => 'Collapse item',
        }}
        expandedItems={expandedItems}
        onItemToggle={({ detail }: any) => {
          if (detail.expanded) {
            return setExpandedItems(prev => [...prev, detail.item.id]);
          } else {
            return setExpandedItems(prev => prev.filter(id => id !== detail.item.id));
          }
        }}
      />
    </div>
  );
}
