// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import ButtonDropdown, { ButtonDropdownProps } from '~components/button-dropdown';
import Container from '~components/container';
import Header from '~components/header';
import Table from '~components/table';

import ScreenshotArea from '../utils/screenshot-area';
import { generateItems } from './generate-data';

const tableItems = generateItems(10);
const dropdownItems: Array<ButtonDropdownProps.Item> = [
  { id: '1', text: 'Item 1' },
  { id: '2', text: 'Item 2' },
  { id: '3', text: 'Item 3' },
  { id: '4', text: 'Item 4' },
  { id: '5', text: 'Item 5' },
  { id: '6', text: 'Item 6' },
];

export default function () {
  return (
    <>
      <h1>Table following another container with a dropdown</h1>
      <ScreenshotArea>
        <Container
          header={<Header actions={<ButtonDropdown items={dropdownItems}>Actions</ButtonDropdown>}>Details</Header>}
          variant="stacked"
        >
          Empty
        </Container>
        <Table
          variant="stacked"
          stickyHeader={true}
          columnDefinitions={[{ header: 'id', cell: item => item.id }]}
          items={tableItems}
        />
      </ScreenshotArea>
    </>
  );
}
