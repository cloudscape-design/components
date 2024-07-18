// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import ButtonDropdown from '~components/button-dropdown';

import styles from './styles.scss';

const dropdownItems = [
  {
    text: 'enabled category',
    items: [
      { id: 'c1long1', text: 'VeryLongOptionTextValueHereToTestTheCaseWithThisDropdown' },
      { id: 'c1_disabled_item', text: 'disabled item', disabled: true },
      { id: 'c1_enabled_item', text: 'option2' },
      { id: 'c1long2', text: 'VeryLongOptionTextValueHereToTestTheCaseWithThisDropdown', disabled: true },
      { id: 'c1i3', text: 'option3' },
      { id: 'c1i4', text: 'option4' },
    ],
  },
  {
    text: 'disabled category',
    disabled: true,
    items: [
      { id: 'dci1', text: 'VeryLongOptionTextValueHereToTestTheCaseWithThisDropdown' },
      { id: 'item_in_disabled_category', text: 'option4' },
      { id: 'dci5', text: 'option5' },
    ],
  },
  {
    id: 'individual_enabled_item',
    text: 'Individual enabled item',
  },
  {
    id: 'individual_disabled_item',
    text: 'VeryLongOptionTextValueHereToTestTheCaseWithThisDropdown',
    disabled: true,
  },
  {
    id: 'plain_href',
    text: 'option6',
    href: '#',
  },
  {
    id: 'plain_href_prevented',
    text: 'option6',
    href: '#',
  },
];

export default function ButtonDropdownScenario() {
  const [message, setMessage] = useState('');

  return (
    <div className={styles.container}>
      <article>
        <h1>Complex actions menu</h1>
        <ButtonDropdown
          id="testDropdown"
          onItemClick={event => setMessage(`The action with id ${event.detail.id} has been selected`)}
          items={dropdownItems}
          onItemFollow={event => {
            if (event.detail.id === 'plain_href_prevented') {
              event.preventDefault();
            }
          }}
        >
          Dropdown Test
        </ButtonDropdown>
        <div id="testDropdownMessage">{message}</div>
      </article>
    </div>
  );
}
