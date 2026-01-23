// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '~components/box';
import Container from '~components/container';
import Header from '~components/header';
import Card from '~components/internal/components/card';

import ScreenshotArea from '../utils/screenshot-area';

const accounts = [
  {
    alias: 'Account alias',
    id: '873423479685',
    role: 'Dev',
    email: 'john.doe@anycompany.com',
    lastLogin: '1 minute ago',
  },
  {
    id: '63547903567',
    role: 'ReadOnly',
    email: 'john.doe@anycompany.com',
    lastLogin: '10 minute ago',
  },
  {
    id: '583821526507',
    role: 'Root',
    lastLogin: '2 hours ago',
  },
  {
    alias: 'acme-staging-infra',
    id: '886694904548',
    role: 'Admin',
    email: 'john.doe@anycompany.com',
    lastLogin: '3 hours ago',
  },
  {
    alias: 'acme-prod-monitoring',
    id: '634308714948',
    role: 'PowerUser',
    email: 'john.doe@anycompany.com',
    lastLogin: '10 hours ago',
  },
];

export default function ButtonsScenario() {
  const [activeId, setActiveId] = useState<string>();
  return (
    <article>
      <h1>Action card: list selection</h1>
      <ScreenshotArea>
        <div style={{ inlineSize: 550, marginInline: 'auto' }}>
          <Container header={<Header variant="h2">Choose an active session</Header>}>
            <ol style={{ display: 'flex', flexDirection: 'column', gap: 16, margin: 0, padding: 0 }}>
              {accounts.map(({ alias, id, role, email, lastLogin }) => (
                <Card
                  tagName="li"
                  header={alias ? `${alias} (${id})` : `Account ID: ${id}`}
                  description={[role, email].filter(Boolean).join('/')}
                  key={id}
                  variant="action"
                  active={activeId === id}
                  onClick={() => setActiveId(id)}
                >
                  <Box color="text-body-secondary" fontSize="body-s">{`Logged in ${lastLogin}`}</Box>
                </Card>
              ))}
            </ol>
          </Container>
        </div>
      </ScreenshotArea>
    </article>
  );
}
