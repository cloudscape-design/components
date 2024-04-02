// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';
import Button from '~components/button';
import Box from '~components/box';
import Header from '~components/header';
import Input from '~components/input';
import Table, { TableProps } from '~components/table';
import ScreenshotArea from '../utils/screenshot-area';
import AppContext, { AppContextType } from '../app/app-context';
import { Checkbox, SpaceBetween } from '~components';

type PageContext = React.Context<
  AppContextType<{
    enableKeyboardNavigation: boolean;
  }>
>;

const COLUMN_COUNT = 100;

interface Item {
  name: string;
  alt?: string;
  description?: string;
  size?: string;
  type?: string;
}

const ITEM_COUNT = 100;

export const items: Array<Item> = [...new Array(ITEM_COUNT)].map((_, i) => ({
  name: 'Item' + i,
  alt: 'First',
  description: 'This is the first item' + i,
  type: '1A',
  size: 'Small',
}));

const columnDefinitions: Array<TableProps.ColumnDefinition<Item>> = [...new Array(COLUMN_COUNT)].map((_, i) => ({
  id: 'variable' + i,
  header: 'Variable name' + i,
  minWidth: 176,
  cell: item => {
    return item.name;
  },
  editConfig: {
    ariaLabel: 'Name',
    editIconAriaLabel: 'editable',
    errorIconAriaLabel: 'Name Error',
    editingCell: (item, { currentValue, setValue }) => {
      return (
        <Input autoFocus={true} value={currentValue ?? item.name} onChange={event => setValue(event.detail.value)} />
      );
    },
  },
}));

export default function App() {
  const [isActive, setIsActive] = useState(false);
  const { urlParams, setUrlParams } = useContext(AppContext as PageContext);
  return (
    <ScreenshotArea>
      <h1>Table performance test</h1>

      {isActive ? (
        <Table
          columnDefinitions={columnDefinitions}
          items={items}
          loadingText="Loading resources"
          submitEdit={async () => {
            await new Promise(e => setTimeout(e, 1e3));
          }}
          resizableColumns={true}
          empty={
            <Box textAlign="center" color="inherit">
              <b>No resources</b>
              <Box padding={{ bottom: 's' }} variant="p" color="inherit">
                No resources to display.
              </Box>
              <Button>Create resource</Button>
            </Box>
          }
          header={<Header>Table with inline editing</Header>}
          enableKeyboardNavigation={urlParams.enableKeyboardNavigation}
        />
      ) : (
        <SpaceBetween size="s">
          <Checkbox
            checked={urlParams.enableKeyboardNavigation}
            onChange={event => setUrlParams({ enableKeyboardNavigation: event.detail.checked })}
          >
            Keyboard navigation
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
