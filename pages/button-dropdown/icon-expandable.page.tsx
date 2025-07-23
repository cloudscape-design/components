// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import ButtonDropdown, { ButtonDropdownProps } from '~components/button-dropdown';
import SpaceBetween from '~components/space-between';

import ScreenshotArea from '../utils/screenshot-area';

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
    items: [...Array(3)].map((_, index) => ({
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
    items: [...Array(2)].map((_, index) => ({
      id: 'category3Subitem' + index,
      text: 'Sub item ' + index,
    })),
  },
];

export default function IconExpandableButtonDropdown() {
  const [expandToViewport, setExpandToViewport] = useState(false);
  const [expandableGroups, setExpandableGroups] = useState(true);

  return (
    <div className={styles.container}>
      <article>
        <h1>Icon Expandable Dropdown</h1>
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

        <ScreenshotArea style={{ paddingBlockEnd: 300, paddingInlineEnd: 100 }}>
          <div style={{ padding: '10px', display: 'inline-block', marginTop: '10px' }} id="dropdown-container">
            <ButtonDropdown
              id="simpleDropdown"
              expandToViewport={expandToViewport}
              expandableGroups={expandableGroups}
              items={items}
              data-testid="icon-dropdown"
            >
              Dropdown with Icons
            </ButtonDropdown>
          </div>
        </ScreenshotArea>
      </article>
    </div>
  );
}
