// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';

import { useCollection } from '@cloudscape-design/collection-hooks';

import { Checkbox, SpaceBetween } from '~components';
import Button from '~components/button';
import Header from '~components/header';
import Table from '~components/table';

import AppContext, { AppContextType } from '../app/app-context';
import ScreenshotArea from '../utils/screenshot-area';
import { createColumns } from './expandable-rows/expandable-rows-configs';
import { allInstances } from './expandable-rows/expandable-rows-data';

const allExpandableInstances = allInstances.filter(i => i.children > 0);

type PageContext = React.Context<
  AppContextType<{
    expandableRows: boolean;
  }>
>;

const columnDefinitions = createColumns();

export default function App() {
  const { urlParams, setUrlParams } = useContext(AppContext as PageContext);
  const [isActive, setIsActive] = useState(false);
  const { items, collectionProps, actions } = useCollection(allInstances, {
    sorting: {},
    selection: { trackBy: 'name' },
    expandableRows: urlParams.expandableRows
      ? {
          getId: item => item.name,
          getParentId: item => item.parentName,
          defaultExpandedItems: allExpandableInstances,
        }
      : undefined,
  });
  return (
    <ScreenshotArea>
      <h1>Table with expandable rows performance test</h1>

      {isActive ? (
        <SpaceBetween size="s">
          <Button
            onClick={() => {
              actions.setExpandedItems(allExpandableInstances);
              console.time('expand-all');
              requestAnimationFrame(() => console.timeEnd('expand-all'));
            }}
          >
            Expand all
          </Button>
          <Button
            onClick={() => {
              actions.setExpandedItems([]);
              console.time('collapse-all');
              requestAnimationFrame(() => console.timeEnd('collapse-all'));
            }}
          >
            Collapse all
          </Button>
          <Table
            columnDefinitions={columnDefinitions}
            items={items}
            {...collectionProps}
            resizableColumns={true}
            header={<Header counter={allInstances.length.toString()}>Table with many items</Header>}
          />
        </SpaceBetween>
      ) : (
        <SpaceBetween size="s">
          <Checkbox
            checked={urlParams.expandableRows}
            onChange={event => {
              setUrlParams({ expandableRows: event.detail.checked });
              window.location.reload();
            }}
          >
            Expandable rows
          </Checkbox>

          <Button
            onClick={() => {
              setIsActive(true);
              console.time('render');
              requestAnimationFrame(() => console.timeEnd('render'));
            }}
          >
            Render Table
          </Button>
        </SpaceBetween>
      )}
    </ScreenshotArea>
  );
}
