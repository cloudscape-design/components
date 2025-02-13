// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useState } from 'react';

import { FormField, Input } from '~components';
import SpaceBetween from '~components/space-between';
import Tabs, { TabsProps } from '~components/tabs';

const TabWithState = () => {
  const [value, setValue] = useState('');
  return (
    <FormField label="Input">
      <Input value={value} onChange={e => setValue(e.detail.value)} />
    </FormField>
  );
};

const TabWithLoading = ({ id }: { id: string }) => {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setTimeout(() => setLoaded(true), 1000);
  }, []);
  return <div id={id}>{loaded ? 'Loaded' : 'Loading...'}</div>;
};

export default function TabsDemoPage() {
  const tabs: Array<TabsProps.Tab> = [
    {
      label: 'Tab with state',
      id: 'state',
      content: <TabWithState />,
      contentRenderStrategy: 'lazy',
    },
    {
      label: 'Tab with state (not retained)',
      id: 'state2',
      content: <TabWithState />,
      contentRenderStrategy: 'active',
    },
    {
      label: 'Lazy loading',
      id: 'lazy',
      content: <TabWithLoading id="loading-lazy" />,
      contentRenderStrategy: 'lazy',
    },
    {
      label: 'Eager loading',
      id: 'eager',
      content: <TabWithLoading id="loading-eager" />,
      contentRenderStrategy: 'eager',
    },
  ];
  return (
    <>
      <h1>Tabs</h1>

      <SpaceBetween size="xs">
        <div>
          <h2>Content render strategy</h2>
          <Tabs
            tabs={tabs}
            i18nStrings={{ scrollLeftAriaLabel: 'Scroll left', scrollRightAriaLabel: 'Scroll right' }}
          />
        </div>
      </SpaceBetween>
    </>
  );
}
