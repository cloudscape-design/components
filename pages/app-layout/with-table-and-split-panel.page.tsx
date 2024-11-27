// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { useCollection } from '@cloudscape-design/collection-hooks';

import AppLayout from '~components/app-layout';
import Header from '~components/header';
import SplitPanel from '~components/split-panel';
import Table from '~components/table';

import { generateItems, Instance } from '../table/generate-data';
import { columnsConfig } from '../table/shared-configs';
import { Breadcrumbs, Footer, Navigation, Tools } from './utils/content-blocks';
import labels from './utils/labels';
import * as toolsContent from './utils/tools-content';

const allItems = generateItems();
const PAGE_SIZE = 12;

const DEMO_CONTENT = (
  <div>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
      magna aliqua. Augue neque gravida in fermentum. Suspendisse sed nisi lacus sed viverra tellus in hac. Nec sagittis
      aliquam malesuada bibendum arcu vitae elementum. Lectus proin nibh nisl condimentum id venenatis. Penatibus et
      magnis dis parturient montes nascetur ridiculus mus mauris. Nisi porta lorem mollis aliquam ut porttitor leo a.
      Facilisi morbi tempus iaculis urna. Odio tempor orci dapibus ultrices in iaculis nunc.
    </p>
    <p>
      Ut diam quam nulla porttitor massa id neque. Duis at tellus at urna condimentum mattis pellentesque id nibh. Metus
      vulputate eu scelerisque felis imperdiet proin fermentum.
    </p>
    <p>
      Orci porta non pulvinar neque laoreet suspendisse interdum consectetur libero. Varius quam quisque id diam vel.
      Risus viverra adipiscing at in. Orci sagittis eu volutpat odio facilisis mauris. Mauris vitae ultricies leo
      integer malesuada nunc. Sem et tortor consequat id porta nibh. Semper auctor neque vitae tempus quam pellentesque.
    </p>
  </div>
);

export default function () {
  const { items } = useCollection(allItems, {
    pagination: { pageSize: PAGE_SIZE },
    sorting: {},
  });

  const [splitPanelOpen, setSplitPanelOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Instance[]>([]);

  return (
    <>
      <AppLayout
        ariaLabels={labels}
        breadcrumbs={<Breadcrumbs />}
        navigation={<Navigation />}
        tools={<Tools>{toolsContent.long}</Tools>}
        disableContentPaddings={true}
        splitPanelOpen={splitPanelOpen}
        onSplitPanelToggle={e => setSplitPanelOpen(e.detail.open)}
        splitPanelPreferences={{
          position: 'side',
        }}
        splitPanel={
          <SplitPanel
            header="Split panel header"
            i18nStrings={{
              preferencesTitle: 'Preferences',
              preferencesPositionLabel: 'Split panel position',
              preferencesPositionDescription: 'Choose the default split panel position for the service.',
              preferencesPositionSide: 'Side',
              preferencesPositionBottom: 'Bottom',
              preferencesConfirm: 'Confirm',
              preferencesCancel: 'Cancel',
              closeButtonAriaLabel: 'Close panel',
              openButtonAriaLabel: 'Open panel',
              resizeHandleAriaLabel: 'Slider',
            }}
          >
            {DEMO_CONTENT}
          </SplitPanel>
        }
        content={
          <>
            <Table<Instance>
              resizableColumns={true}
              header={
                <Header headingTagOverride="h1" counter={`(${allItems.length})`}>
                  Sticky Scrollbar Example
                </Header>
              }
              columnDefinitions={columnsConfig}
              items={items}
              selectionType="single"
              selectedItems={selectedItems}
              ariaLabels={{
                itemSelectionLabel(data, row) {
                  return `Select item ${row.id}`;
                },
              }}
              onSelectionChange={e => {
                setSelectedItems(e.detail.selectedItems);
                setSplitPanelOpen(e.detail.selectedItems.length > 0);
              }}
            />
          </>
        }
      />
      <Footer legacyConsoleNav={false} />
    </>
  );
}
