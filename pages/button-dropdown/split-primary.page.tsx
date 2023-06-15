// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';

import ButtonDropdown, { ButtonDropdownProps } from '~components/button-dropdown';
import { Alert, Box, SpaceBetween } from '~components';
import { cloneDeep } from 'lodash';
import { useState } from 'react';

const defaultItems: ButtonDropdownProps['items'] = [
  {
    id: 'launch-instance',
    text: 'Launch instance',
    iconName: 'add-plus',
  },
  {
    id: 'launch-instance-from-template-a',
    text: 'Launch instance from template A',
    iconName: 'file',
  },
  {
    id: 'launch-instance-from-template-B',
    text: 'Launch instance from template B',
    iconName: 'file',
  },
  {
    id: 'view-instances',
    text: 'View instances',
    href: 'https://instances.com',
    external: true,
  },
];

const itemsWithTemplatesDisabled = cloneDeep(defaultItems);
itemsWithTemplatesDisabled[1].disabled = true;
itemsWithTemplatesDisabled[1].disabledReason = 'Template A is unavailable';
itemsWithTemplatesDisabled[2].disabled = true;
itemsWithTemplatesDisabled[2].disabledReason = 'Template A is unavailable';

const itemsWithInstancesDisabled = cloneDeep(defaultItems);
itemsWithInstancesDisabled[0].disabled = true;
itemsWithInstancesDisabled[0].disabledReason = 'No permission';
itemsWithInstancesDisabled[1].disabled = true;
itemsWithInstancesDisabled[1].disabledReason = 'No permission';
itemsWithInstancesDisabled[2].disabled = true;
itemsWithInstancesDisabled[2].disabledReason = 'No permission';

export default function ButtonDropdownPage() {
  const [lastAction, setLastAction] = useState('');

  const onItemClick: ButtonDropdownProps['onItemClick'] = event => {
    event.preventDefault();
    setLastAction(`Clicked "${defaultItems.find(it => it.id === event.detail.id)?.text}"`);
  };

  return (
    <Box padding="m">
      <article>
        <h1>ButtonDropdown with split action</h1>

        <SpaceBetween size="l">
          {lastAction ? <Alert type="info">{lastAction}</Alert> : null}

          <Container title="Dropdown with 4 active actions">
            <ButtonDropdown
              variant="split-primary"
              ariaLabel="Instance actions"
              items={defaultItems}
              onItemClick={onItemClick}
            />
          </Container>

          <Container title="Dropdown with 2 active actions and 2 inactive actions">
            <ButtonDropdown
              variant="split-primary"
              ariaLabel="Instance actions"
              items={itemsWithTemplatesDisabled}
              onItemClick={onItemClick}
            />
          </Container>

          <Container title="Dropdown with 3 main actions inactive">
            <ButtonDropdown
              variant="split-primary"
              ariaLabel="Instance actions"
              items={itemsWithInstancesDisabled}
              onItemClick={onItemClick}
            />
          </Container>

          <Container title="Component inactivated">
            <ButtonDropdown
              variant="split-primary"
              ariaLabel="Instance actions"
              items={defaultItems}
              onItemClick={onItemClick}
              disabled={true}
            />
          </Container>

          <Container title="Component loading">
            <ButtonDropdown
              variant="split-primary"
              ariaLabel="Instance actions"
              items={defaultItems}
              onItemClick={onItemClick}
              loading={true}
            />
          </Container>
        </SpaceBetween>
      </article>
    </Box>
  );
}

function Container({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <SpaceBetween size="s">
      <Box>{title}</Box>
      <Box>{children}</Box>
    </SpaceBetween>
  );
}
