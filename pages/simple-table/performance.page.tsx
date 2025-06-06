// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useLayoutEffect, useRef, useState } from 'react';

import { Box, Checkbox, Container, Header, SpaceBetween, TextFilter } from '~components';

import SimpleTable from '~components/simple-table';

import ScreenshotArea from '../utils/screenshot-area';
import { useMergeRefs } from '@cloudscape-design/component-toolkit/internal';
import { useCollection } from '@cloudscape-design/collection-hooks';

const COLUMN_COUNT = 4;

interface Item {
  name: string;
  alt?: string;
  description?: string;
  size?: string;
  type?: string;
}

const ITEM_COUNT = 623;

const Icon = React.forwardRef<HTMLSpanElement, {name: string}>(({name}, ref) => {
  useLayoutEffect(() => {});
  const _ref = useMergeRefs(useRef<HTMLSpanElement>(null), ref);
  return <span ref={_ref}>+</span>
});

export const allItems: Array<Item> = [...new Array(ITEM_COUNT)].map((_, i) => ({
  name: 'Item' + i,
  alt: 'First',
  description: 'This is the first item' + i,
  type: '1A',
  size: 'Small',
}));

const columnDefinitions = [...new Array(COLUMN_COUNT)].map((_, i) => ({
  header: 'Variable name' + i,
  cell: (item: Item) => (<>{item.name}<Icon name="add-plus" /></>),
  minWidth: 176,
  sortingField: 'name',
}));

export default function App() {
  const { items, filterProps, collectionProps } = useCollection(allItems, {
    filtering: {
      noMatch: (
        <Box margin={{ vertical: 'xs' }} textAlign="center" color="inherit">
          <b>No matches</b>
          <Box padding={{ bottom: 's' }} variant="p" color="inherit">
            No resources to display.
          </Box>
        </Box>
      ),
    },
    sorting: {}
  })
  return (
    <ScreenshotArea>
      <h1>Simple table performance test</h1>

      <Container header={<SpaceBetween direction='vertical' size="s">
        <Header>Simple table</Header>
        <TextFilter {...filterProps} filteringPlaceholder='Filter records' />
      </SpaceBetween>} disableContentPaddings>
        <div style={{overflowX: 'auto'}}>
          <Box padding={{horizontal: 'l'}}>
            <SimpleTable
              columnDefinitions={columnDefinitions}
              items={items}
              {...collectionProps}
            />
          </Box>
        </div>
      </Container>
    </ScreenshotArea>
  );
}
