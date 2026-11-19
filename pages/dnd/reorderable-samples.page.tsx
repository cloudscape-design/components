// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';

import { Box, Checkbox, Link, SpaceBetween } from '~components';

import { generateItems } from '../table/generate-data';
import { DnsName, Status } from './commons';
import { ReorderableContainers } from './reorderable-containers';
import { ReorderableList } from './reorderable-list';
import { ReorderableTable } from './reorderable-table';

import styles from './styles.scss';

const items = generateItems(10);

export default function Page() {
  const [fixedOptions, setFixedOptions] = useState(false);
  const [options1, setOptions1] = useState(() => [...items]);
  const [options2, setOptions2] = useState(() => [...items]);
  const [containers, setContainers] = useState(() => [
    {
      id: 'list',
      title: 'Reorderable list',
    },
    {
      id: 'table',
      title: 'Reorderable table',
    },
  ]);

  const containersContent: Record<string, React.ReactNode> = {
    list: (
      <SpaceBetween size="m">
        <Checkbox checked={fixedOptions} onChange={({ detail }) => setFixedOptions(detail.checked)}>
          Make first 3 items fixed
        </Checkbox>

        <ReorderableList
          options={options1}
          onReorder={o => setOptions1([...o])}
          fixedOptionsStart={fixedOptions ? 3 : 0}
        />
      </SpaceBetween>
    ),
    table: (
      <ReorderableTable
        items={options2}
        onReorder={o => setOptions2([...o])}
        columnDefinitions={[
          { key: 'id', label: 'ID', render: item => <Link>{item.id}</Link> },
          { key: 'type', label: 'Type', render: item => item.type },
          { key: 'state', label: 'State', render: item => <Status {...item} /> },
          { key: 'dnsName', label: 'DNS name', render: item => <DnsName {...item} /> },
        ]}
      />
    ),
  };
  const containersWithContent = containers.map(option => ({ ...option, content: containersContent[option.id] }));

  return (
    <Box margin="m">
      <h1 className={styles.title}>Reorderable samples page</h1>

      <ReorderableContainers
        items={containersWithContent}
        onReorder={o => setContainers(o.map(({ id, title }) => ({ id, title })))}
        disabledUp={item => containers[0].id === item.id}
        disabledDown={item => containers[containers.length - 1].id === item.id}
        onMoveUp={item => setContainers(prev => [item, ...prev.filter(c => c.id !== item.id)])}
        onMoveDown={item => setContainers(prev => [...prev.filter(c => c.id !== item.id), item])}
      />
    </Box>
  );
}
