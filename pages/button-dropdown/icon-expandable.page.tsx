// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext } from 'react';

import ButtonDropdown, { ButtonDropdownProps } from '~components/button-dropdown';
import SpaceBetween from '~components/space-between';

import AppContext, { AppContextType } from '../app/app-context';
import img from '../icon/custom-icon.png';
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
    })),
  },
  {
    id: 'category2',
    text: 'category2',
    //New source for iconUrl
    iconUrl: img,
    items: [...Array(2)].map((_, index) => ({
      id: 'category2Subitem' + index,
      text: 'Cat 2 Sub item ' + index,
    })),
  },
  {
    id: 'item1',
    text: 'Item 1',
    iconName: 'settings',
  },
  {
    id: 'category3',
    text: 'category3',
    iconSvg: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" focusable="false">
        <path
          d="M2 4V12C2 12.5523 2.44772 13 3 13H13C13.5523 13 14 12.5523 14 12V6C14 5.44772 13.5523 5 13 5H8L6 3H3C2.44772 3 2 3.44772 2 4Z"
          fill="currentColor"
        />
      </svg>
    ),
    items: [...Array(2)].map((_, index) => ({
      id: 'category3Subitem' + index,
      text: 'Sub item ' + index,
    })),
  },
];

type DemoContext = React.Context<
  AppContextType<{
    expandableGroups: boolean;
  }>
>;

export default function IconExpandableButtonDropdown() {
  const {
    urlParams: { expandableGroups = true },
    setUrlParams,
  } = useContext(AppContext as DemoContext);

  return (
    <div className={styles.container}>
      <article>
        <h1>Icon Expandable Dropdown</h1>
        <SpaceBetween size="m">
          <label>
            <input
              id="expandableGroups"
              type="checkbox"
              checked={expandableGroups}
              onChange={e => setUrlParams({ expandableGroups: !!e.target.checked })}
            />{' '}
            expandableGroups
          </label>
          <ScreenshotArea
            style={{
              paddingBlockStart: 10,
              paddingBlockEnd: 300,
              paddingInlineStart: 10,
              paddingInlineEnd: 100,
              display: 'inline-block',
            }}
          >
            <ButtonDropdown expandableGroups={expandableGroups} items={items}>
              Dropdown with Icons
            </ButtonDropdown>
          </ScreenshotArea>
        </SpaceBetween>
      </article>
    </div>
  );
}
