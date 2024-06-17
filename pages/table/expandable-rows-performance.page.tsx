// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';
import Button from '~components/button';
import Header from '~components/header';
import Table from '~components/table';
import ScreenshotArea from '../utils/screenshot-area';
import { allInstances } from './expandable-rows/expandable-rows-data';
import { createColumns } from './expandable-rows/expandable-rows-configs';
import { useCollection } from '@cloudscape-design/collection-hooks';
import AppContext, { AppContextType } from '../app/app-context';
import { Checkbox, SpaceBetween } from '~components';

type PageContext = React.Context<
  AppContextType<{
    expandableRows: boolean;
  }>
>;

const columnDefinitions = createColumns();

export default function App() {
  const { urlParams, setUrlParams } = useContext(AppContext as PageContext);
  const [isActive, setIsActive] = useState(false);
  const { items, collectionProps } = useCollection(allInstances, {
    sorting: {},
    selection: { trackBy: 'name' },
    expandableRows: urlParams.expandableRows
      ? {
          getId: item => item.name,
          getParentId: item => item.parentName,
          defaultExpandedItems: allInstances,
        }
      : undefined,
  });
  return (
    <ScreenshotArea>
      <h1>Table with expandable rows performance test</h1>

      {isActive ? (
        <Table
          columnDefinitions={columnDefinitions}
          items={items}
          {...collectionProps}
          resizableColumns={true}
          header={<Header counter={allInstances.length.toString()}>Table with many items</Header>}
        />
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
