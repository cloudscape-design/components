// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';

import { Box, Link } from '~components';

import { generateItems } from '../table/generate-data';
import { DnsName, Status } from './commons';
import { ContainerWithDragHandle, ReorderableContainers } from './reorderable-containers';
import { InstanceOption, ReorderableList } from './reorderable-list';
import { ReorderableTable } from './reorderable-table';

import styles from './styles.scss';

const items = generateItems(10);

export default function Page() {
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
      <ReorderableList
        options={options1}
        onChange={o => setOptions1([...o])}
        renderOption={props => <InstanceOption {...props} />}
      />
    ),
    table: (
      <ReorderableTable
        items={options2}
        onChange={o => setOptions2([...o])}
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
        options={containersWithContent}
        onChange={o => setContainers(o.map(({ id, title }) => ({ id, title })))}
        renderOption={props => (
          <ContainerWithDragHandle
            {...props}
            disabledUp={containers[0].id === props.option.id}
            disabledDown={containers[containers.length - 1].id === props.option.id}
            onMoveUp={() => setContainers(prev => [props.option, ...prev.filter(c => c.id !== props.option.id)])}
            onMoveDown={() => setContainers(prev => [...prev.filter(c => c.id !== props.option.id), props.option])}
          />
        )}
      />
    </Box>
  );
}
