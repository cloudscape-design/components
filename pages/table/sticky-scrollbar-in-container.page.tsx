// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext } from 'react';

import { useCollection } from '@cloudscape-design/collection-hooks';

import { Checkbox, Container, Header, Pagination, SpaceBetween, Table } from '~components';

import AppContext, { AppContextType } from '../app/app-context';
import ScreenshotArea from '../utils/screenshot-area';
import { generateItems } from './generate-data';
import { columnsConfig, paginationLabels } from './shared-configs';

type PageContext = React.Context<
  AppContextType<{
    fitHeight?: boolean;
    hasFooter?: boolean;
  }>
>;

const allItems = generateItems();
const PAGE_SIZE = 50;

export default function App() {
  const {
    urlParams: { fitHeight = true, hasFooter = false },
    setUrlParams,
  } = useContext(AppContext as PageContext);

  const { items, paginationProps } = useCollection(allItems, { pagination: { pageSize: PAGE_SIZE }, sorting: {} });

  return (
    <ScreenshotArea>
      <SpaceBetween size="m" direction="horizontal">
        <div style={{ blockSize: '500px', inlineSize: '500px', overflow: 'scroll' }}>
          <Container fitHeight={fitHeight}>
            <Table
              variant="borderless"
              header={
                <Header headingTagOverride="h1" counter={`(${allItems.length})`}>
                  Sticky Scrollbar Example
                </Header>
              }
              footer={hasFooter ? <Pagination {...paginationProps} ariaLabels={paginationLabels} /> : undefined}
              columnDefinitions={columnsConfig}
              items={items}
            />
          </Container>
        </div>

        <SpaceBetween size="s">
          <Checkbox checked={fitHeight} onChange={({ detail }) => setUrlParams({ fitHeight: detail.checked })}>
            fitHeight
          </Checkbox>
          <Checkbox checked={hasFooter} onChange={({ detail }) => setUrlParams({ hasFooter: detail.checked })}>
            hasFooter
          </Checkbox>
        </SpaceBetween>
      </SpaceBetween>
    </ScreenshotArea>
  );
}
