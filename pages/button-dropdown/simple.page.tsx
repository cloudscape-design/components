// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';

import ButtonDropdown, { ButtonDropdownProps } from '~components/button-dropdown';

import ScreenshotArea from '../utils/screenshot-area';

import styles from './styles.scss';

const items: ButtonDropdownProps['items'] = [
  {
    id: 'id1',
    text: 'Option 1',
  },
  {
    id: 'id2',
    text: 'Link option with some longer text inside it',
    disabled: true,
    href: '#',
  },
  {
    id: 'id3',
    text: 'Option 3',
    href: '#',
    external: true,
    externalIconAriaLabel: '(opens in new tab)',
  },
  {
    id: 'id4',
    text: 'Option 4',
    disabled: true,
  },
  {
    id: 'id5',
    text: 'Option 5',
  },
  {
    id: 'id6',
    text: 'Option 6',
    disabled: true,
  },
  {
    id: 'id7',
    text: 'Option 7',
    secondaryText: 'This is option 7',
  },
  {
    id: 'id8',
    text: 'Option 8',
    labelTag: 'Ctrl + 8',
  },
  {
    id: 'id9',
    text: 'Option 9',
    secondaryText: 'This is option 9',
    labelTag: 'Ctrl + 9',
  },
];

const withNestedOptions: ButtonDropdownProps['items'] = [
  {
    text: 'Instances',
    items: [
      {
        id: '1',
        text: 'Destroy',
        secondaryText: 'This is the Destroy option',
        labelTag: 'Ctrl + D',
      },
      {
        id: '2',
        text: 'Restart',
        secondaryText: 'This is the Restart option',
        labelTag: 'Ctrl + R',
      },
    ],
  },
  {
    id: 'id',
    text: 'SSH',
    disabled: true,
    items: [
      {
        id: '5',
        text: 'Destroy',
      },
      {
        id: '9',
        text: 'Restart',
      },
    ],
  },
];

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
        secondaryText: 'This is the Start option',
        labelTag: 'Ctrl + S',
      },
      {
        id: 'stop',
        text: 'Stop',
        secondaryText: 'This is the Stop Option',
        disabled: true,
      },
      {
        id: 'hibernate',
        text: 'Hibernate',
        secondaryText: 'This is the Hibernate Option',
        labelTag: 'Ctrl + H',
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

const withDisabledItems: ButtonDropdownProps['items'] = [
  {
    id: 'connect',
    text: 'Connect',
  },
  {
    id: 'troubleshoot',
    text: 'Monitoring and troubleshoot',
    disabled: true,
    items: [
      {
        id: 'screenshot',
        text: 'Get instance screenshot',
        disabled: true,
      },
      {
        id: 'serial',
        text: 'EC2 Serial console',
        disabled: true,
      },
    ],
  },
];

export default function ButtonDropdownPage() {
  return (
    <ScreenshotArea
      disableAnimations={true}
      style={{
        // extra space to include dropdown in the screenshot area
        paddingBlockEnd: 100,
      }}
    >
      <article>
        <h1>Simple ButtonDropdown</h1>
        <div className={styles.container}>
          <ButtonDropdown id="ButtonDropdown1" items={items}>
            Two
          </ButtonDropdown>
          <ButtonDropdown id="ButtonDropdown2" items={items}>
            ButtonDropdowns
          </ButtonDropdown>
        </div>
        <div className={styles.container}>
          <ButtonDropdown id="ButtonDropdown3" items={withNestedOptions}>
            With nested options
          </ButtonDropdown>
        </div>
        <div className={styles.container}>
          <ButtonDropdown id="ButtonDropdown4" expandableGroups={true} items={withExpandedGroups}>
            With expandable groups
          </ButtonDropdown>
        </div>
        <div className={styles.container}>
          <ButtonDropdown id="ButtonDropdown5" items={items} disabled={true}>
            Disabled
          </ButtonDropdown>
        </div>
        <div className={styles.container}>
          <ButtonDropdown id="ButtonDropdown6" items={items} disabled={true} loading={true}>
            Disabled and loading
          </ButtonDropdown>
        </div>
        <div className={styles.container}>
          <ButtonDropdown id="ButtonDropdown7" variant="primary" items={items}>
            Primary dropdown
          </ButtonDropdown>
        </div>
        <div className={styles.container}>
          <ButtonDropdown id="ButtonDropdown8" expandableGroups={true} items={withDisabledItems}>
            With expandable groups and disabled items
          </ButtonDropdown>
        </div>
      </article>
    </ScreenshotArea>
  );
}
