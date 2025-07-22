// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import ButtonDropdown, { ButtonDropdownProps } from '~components/button-dropdown';
import SpaceBetween from '~components/space-between';

import styles from './styles.scss';

export const items: ButtonDropdownProps['items'] = [
  {
    id: 'category1',
    text: 'category1',
    iconName: 'gen-ai',
    items: [...Array(2)].map((_, index) => ({
      id: 'category1Subitem' + index,
      text: 'Sub item ' + index,
      iconName: 'star',
    })),
  },
  {
    id: 'category2',
    text: 'category2',
    iconName: 'settings',
    items: [...Array(5)].map((_, index) => ({
      id: 'category2Subitem' + index,
      text: 'Cat 2 Sub item ' + index,
    })),
  },
  {
    id: 'item1',
    text: 'Item 1',
  },
  {
    id: 'category3',
    text: 'category3',
    iconName: 'folder',
    items: [...Array(3)].map((_, index) => ({
      id: 'category3Subitem' + index,
      text: 'Sub item ' + index,
    })),
  },
];

export default function SimpleButtonDropdownScenario() {
  const [expandToViewport, setExpandToViewport] = useState(false);
  const [expandableGroups, setExpandableGroups] = useState(true);

  return (
    <div className={styles.container}>
      <article>
        <h1>Simple Expandable Dropdown</h1>
        <SpaceBetween size="m" direction="horizontal">
          <label>
            <input
              id="expandToViewport"
              type="checkbox"
              checked={expandToViewport}
              onChange={e => setExpandToViewport(!!e.target.checked)}
            />{' '}
            expandToViewport
          </label>
          <label>
            <input
              id="expandableGroups"
              type="checkbox"
              checked={expandableGroups}
              onChange={e => setExpandableGroups(!!e.target.checked)}
            />{' '}
            expandableGroups
          </label>
        </SpaceBetween>

        <div style={{ padding: '100px', display: 'inline-block' }} id="dropdown-container">
          <ButtonDropdown
            id="simpleDropdown"
            expandToViewport={expandToViewport}
            expandableGroups={expandableGroups}
            items={items}
          >
            Dropdown with Icons
          </ButtonDropdown>
        </div>

        <div style={{ margin: '20px 0' }}>
          <ButtonDropdown
            id="simpleDropdown"
            expandToViewport={expandToViewport}
            expandableGroups={expandableGroups}
            items={items}
          >
            Dropdown with Icons
          </ButtonDropdown>
        </div>
      </article>
    </div>
  );
}
