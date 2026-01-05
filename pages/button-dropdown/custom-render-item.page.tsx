// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';

import { Icon } from '~components';
import ButtonDropdown, { ButtonDropdownProps } from '~components/button-dropdown';

import { SimplePage } from '../app/templates';

const withExpandedGroups: ButtonDropdownProps['items'] = [
  {
    id: 'connect',
    text: 'Connect',
    secondaryText: 'This is the Connect option',
    labelTag: 'Ctrl + C',
  },
  {
    id: 'password',
    text: 'Get password',
    secondaryText: 'This is the Get password option',
  },
  {
    id: 'states',
    text: 'Instance State',
    items: [
      {
        id: 'start',
        text: 'Start',
      },
      {
        id: 'stop',
        text: 'Stop',
        disabled: true,
      },
      {
        id: 'hibernate',
        text: 'Hibernate',
        disabled: true,
      },
      {
        id: 'reboot',
        text: 'Reboot',
        secondaryText: 'This is the Reboot Option',
        labelTag: 'Ctrl + B',
        disabled: true,
      },
      {
        id: 'terminate',
        text: 'Terminate',
        secondaryText: 'This is the Terminate Option',
      },
      {
        id: 'external',
        text: 'Root Page',
        secondaryText: '',
        labelTag: 'Ctrl + P',
        external: true,
        href: '/#/light/',
      },
    ],
  },
];

export default function ButtonDropdownPage() {
  const renderItem: ButtonDropdownProps.ButtonDropdownItemRenderer = ({ item }) => {
    if (item.type === 'group') {
      return (
        <div
          style={{
            padding: '4px 8px',
            fontWeight: 'bold',
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <span>{item.element.text}</span>
          <div
            style={{
              transform: item.expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 80ms linear',
            }}
          >
            {item.expandDirection === 'vertical' ? (
              <Icon name="caret-down-filled" />
            ) : (
              <Icon name="caret-right-filled" />
            )}
          </div>
        </div>
      );
    } else if (item.type === 'checkbox') {
      return <div style={{ padding: '4px 8px' }}>{item.element.text}</div>;
    } else {
      return <div style={{ padding: '4px 8px' }}>{item.element.text}</div>;
    }
  };
  return (
    <SimplePage title="Button Dropdown with custom render option" screenshotArea={{}}>
      <ButtonDropdown id="ButtonDropdown3" items={withExpandedGroups} expandableGroups={true} renderItem={renderItem}>
        With nested options
      </ButtonDropdown>
    </SimplePage>
  );
}
