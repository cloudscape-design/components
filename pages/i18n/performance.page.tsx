// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useMemo, useState } from 'react';

import Button from '~components/button';
import Header from '~components/header';
import I18nProvider from '~components/i18n';
import enMessages from '~components/i18n/messages/all.en';
import Table from '~components/table';

export default function WrappedI18nPerformancePage() {
  return (
    <I18nProvider locale="en" messages={[enMessages]}>
      <I18nPerformancePage />
    </I18nProvider>
  );
}

function I18nPerformancePage() {
  const [itemCount, setItemCount] = useState(10_000);

  const items = useMemo(
    () =>
      new Array(itemCount).fill(null).map((_value, i) => ({
        id: `${i}`,
        value: `Item ${i + 1}`,
        children: [{ id: `${i}-0`, value: 'Child' }],
      })),
    [itemCount]
  );

  return (
    <Table<{ id: string; value: string; children: { id: string; value: string }[] }>
      header={
        <Header
          variant="h1"
          counter={`(${itemCount})`}
          description="Reproduction page for AWSUI-60323"
          actions={<Button onClick={() => setItemCount(itemCount => itemCount + 1000)}>More items</Button>}
        >
          Performance test
        </Header>
      }
      items={items}
      trackBy="id"
      expandableRows={{
        getItemChildren: () => [],
        isItemExpandable: item => item.children.length > 0,
        onExpandableItemToggle: () => {},
        expandedItems: [],
      }}
      columnDefinitions={[
        {
          id: 'value',
          header: 'Text value',
          cell: ({ value }) => value,
        },
      ]}
      enableKeyboardNavigation={true}
    />
  );
}
