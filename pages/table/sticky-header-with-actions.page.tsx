// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import Header from '~components/header';
import ButtonDropdown, { ButtonDropdownProps } from '~components/button-dropdown';
import Table from '~components/table';
import { Instance, generateItems } from '../table/generate-data';
import { columnsConfig, selectionLabels } from '../table/shared-configs';
import ScreenshotArea from '../utils/screenshot-area';

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
      <h1>Table with a sticky header and actions</h1>
      <ScreenshotArea>
        <div style={{ height: '400px', width: '500px', overflow: 'auto', padding: '0px 1px' }} id="scroll-container">
          <div style={{ height: '100px' }} />
          <Table<Instance>
            ariaLabels={selectionLabels}
            selectionType="multi"
            stickyColumns={{ last: 1 }}
            header={
              <Header
                actions={
                  <ButtonDropdown data-test-gid="actions-button" items={dropdownItems}>
                    Actions
                  </ButtonDropdown>
                }
                headingTagOverride="h1"
              >
                Instances
              </Header>
            }
            columnDefinitions={columnsConfig}
            items={generateItems(1)}
            stickyHeader={true}
          />
        </div>
      </ScreenshotArea>
    </>
  );
}
