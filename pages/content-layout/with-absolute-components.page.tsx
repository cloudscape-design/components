// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import AppLayout from '~components/app-layout';
import ButtonDropdown, { ButtonDropdownProps } from '~components/button-dropdown';
import ContentLayout from '~components/content-layout';
import Flashbar from '~components/flashbar';
import Select, { SelectProps } from '~components/select';
import SpaceBetween from '~components/space-between';
import ScreenshotArea from '../utils/screenshot-area';
import { Breadcrumbs } from '../app-layout/utils/content-blocks';
import labels from '../app-layout/utils/labels';

const dropdownItems: ButtonDropdownProps.Items = [
  { id: '1', text: 'Item 1' },
  {
    id: '2',
    text: 'Sub menu',
    items: [
      {
        id: '2-1',
        text: 'Long enough sub-menu item to display it over the navigation panel',
      },
      {
        id: '2-2',
        text: 'Sub-menu item 2',
      },
      {
        id: '2-3',
        text: 'Sub-menu item 3',
      },
    ],
  },
  { id: '3', text: 'Item 3' },
  { id: '4', text: 'Item 4' },
];
const selectOptions: SelectProps.Options = [
  { value: 'First' },
  { value: 'Second' },
  { value: 'Third' },
  { value: 'Forth' },
  { value: 'Fifth' },
];

export default function () {
  const [selectedOption, setSelectedOption] = useState<SelectProps.Option | null>(null);
  const [isSticky, setSticky] = useState(false);
  return (
    <ScreenshotArea gutters={false}>
      <AppLayout
        ariaLabels={labels}
        stickyNotifications={isSticky}
        notifications={
          <Flashbar
            items={[
              {
                type: 'success',
                header: 'Success message',
                buttonText: 'Toggle sticky notifications',
                statusIconAriaLabel: 'success',
                onButtonClick: () => setSticky(sticky => !sticky),
              },
            ]}
          />
        }
        breadcrumbs={<Breadcrumbs />}
        content={
          <ContentLayout disableOverlap={true}>
            <SpaceBetween size="s">
              <h1>With absolutely positioned elements</h1>
              <ButtonDropdown items={dropdownItems} expandableGroups={true}>
                Button dropdown
              </ButtonDropdown>
              <Select
                ariaLabel="Demo select"
                selectedOption={selectedOption}
                options={selectOptions}
                onChange={event => setSelectedOption(event.detail.selectedOption)}
              />
              <div style={{ lineHeight: '100vh' }}>Extra empty space to activate the scroll</div>
            </SpaceBetween>
          </ContentLayout>
        }
      />
    </ScreenshotArea>
  );
}
