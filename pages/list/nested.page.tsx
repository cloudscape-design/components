// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Badge from '~components/badge';
import Box from '~components/box';
import ButtonDropdown from '~components/button-dropdown';
import List from '~components/list';

interface Endpoint {
  name: string;
  method: string;
  path: string;
}

interface Section {
  name: string;
  endpoints: ReadonlyArray<Endpoint>;
}

const sections: ReadonlyArray<Section> = [
  {
    name: 'Pet store - production',
    endpoints: [
      { name: 'Retrieve pets', method: 'GET', path: '/pets' },
      { name: 'Return pets headers', method: 'HEAD', path: '/pets' },
      { name: 'Return pets options', method: 'OPTIONS', path: '/pets' },
      { name: 'Create petId', method: 'POST', path: '/pets/{petId}' },
    ],
  },
  {
    name: 'Book store - development',
    endpoints: [
      { name: 'Retrieve books', method: 'GET', path: '/books' },
      { name: 'Return books headers', method: 'HEAD', path: '/books' },
      { name: 'Return books options', method: 'OPTIONS', path: '/books' },
      { name: 'Create bookId', method: 'POST', path: '/books/{bookId}' },
    ],
  },
  {
    name: 'Game store - development',
    endpoints: [
      { name: 'Retrieve games', method: 'GET', path: '/games' },
      { name: 'Return games headers', method: 'HEAD', path: '/games' },
      { name: 'Return games options', method: 'OPTIONS', path: '/games' },
      { name: 'Create gameId', method: 'POST', path: '/games/{gameId}' },
    ],
  },
];

function ApiSection({ section }: { section: Section }) {
  const [items, setItems] = useState(section.endpoints);

  return (
    <Box margin={{ left: 'xl' }}>
      <List
        items={items}
        renderItem={endpoint => ({
          id: `${endpoint.method}-${endpoint.path}`,
          content: endpoint.path,
          secondaryContent: <Badge>{endpoint.method}</Badge>,
          actions: (
            <ButtonDropdown
              variant="inline-icon"
              items={[
                { id: 'edit', text: 'Edit' },
                { id: 'delete', text: 'Delete' },
              ]}
            />
          ),
        })}
        sortable={true}
        onSortingChange={({ detail }) => setItems(detail.items)}
      />
    </Box>
  );
}

function ApiList() {
  const [items, setItems] = useState(sections);

  return (
    <List
      items={items}
      renderItem={section => {
        return {
          id: section.name,
          content: <Box fontWeight="bold">{section.name}</Box>,
          secondaryContent: <ApiSection section={section} />,
          actions: (
            <ButtonDropdown
              variant="inline-icon"
              items={[
                { id: 'edit', text: 'Edit' },
                { id: 'delete', text: 'Delete' },
              ]}
            />
          ),
        };
      }}
      sortable={true}
      onSortingChange={({ detail }) => setItems(detail.items)}
    />
  );
}

export default function ListIntegrationTestPage() {
  return (
    <>
      <h1>Nested list</h1>
      <ApiList />
    </>
  );
}
