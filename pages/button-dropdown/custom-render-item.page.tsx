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
          <span>
            {item.index}. {item.option.text}
          </span>
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
      return (
        <div style={{ padding: '4px 8px' }}>
          {item.index}. {item.option.text}
        </div>
      );
    } else {
      return (
        <div
          style={{
            padding: '4px 4px 4px 8px',
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span
            style={{
              color: item.disabled ? '#999' : 'inherit',
            }}
          >
            {item.parent
              ? item.parent.index + '.' + item.index + '. ' + item.option.text
              : item.index + '. ' + item.option.text}
          </span>
          {item.option.id === 'connect' || item.option.id === 'hibernate' ? (
            <div
              style={{
                background: '#ff9900',
                borderRadius: '4px',
                color: '#252f3e',
                fontStyle: 'italic',
                fontSize: '10px',
                fontWeight: 'bold',
                paddingInline: '3px',
              }}
            >
              NEW
            </div>
          ) : null}
        </div>
      );
    }
  };
  return (
    <SimplePage title="Button Dropdown with custom render option" screenshotArea={{}}>
      <ButtonDropdown id="ButtonDropdown3" items={withExpandedGroups} expandableGroups={true} renderItem={renderItem}>
        Button Action
      </ButtonDropdown>
    </SimplePage>
  );
}
