// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { Button } from '~components';
import Tabs from '~components/tabs';

import { IframeWrapper } from '../utils/iframe-wrapper';

function Counter() {
  const [count, setCount] = useState(0);

  return <Button onClick={() => setCount(count + 1)}>This button has been clicked {count} times</Button>;
}

export default function InactiveTabPersistenceDemoPage() {
  return (
    <div id="test" style={{ padding: 10 }}>
      <h1>Tabs inactive tab persistence test page</h1>
      <h2>Tabs with persistence</h2>
      <Tabs tabs={tabsWithPersistence} preserveInactiveTabs={true} />
      <hr />
      <h2>Tabs without persistence</h2>
      <Tabs tabs={tabsWithoutPersistence} preserveInactiveTabs={false} />
    </div>
  );
}

const tabsWithPersistence = createTestTabs('iframe-with-persist');
const tabsWithoutPersistence = createTestTabs('iframe-without-persist');

function createTestTabs(iframeId: string) {
  return [
    {
      id: 'first',
      label: 'Tab one',
      content: <span>This tab contains static content.</span>,
    },
    {
      id: 'second',
      label: 'Tab two',
      content: <IframeWrapper id={iframeId} AppComponent={() => <Counter />} />,
    },
  ];
}
