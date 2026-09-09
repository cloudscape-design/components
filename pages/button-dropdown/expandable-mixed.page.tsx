// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext } from 'react';

import ButtonDropdown, { ButtonDropdownProps } from '~components/button-dropdown';
import SpaceBetween from '~components/space-between';

import AppContext, { AppContextType } from '../app/app-context';

import styles from './styles.scss';

type PageContext = React.Context<
  AppContextType<{
    expandToViewport: boolean;
    expandableGroups: boolean;
  }>
>;

export const items: ButtonDropdownProps['items'] = [
  {
    id: 'expandable-1',
    text: 'Expandable category 1',
    items: [...Array(3)].map((_, index) => ({
      id: 'expandable-1-item-' + index,
      text: 'Expandable 1 · sub item ' + index,
    })),
  },
  {
    id: 'flat-2',
    text: 'Flat category 2 (expandable: false)',
    expandable: false,
    items: [...Array(3)].map((_, index) => ({
      id: 'flat-2-item-' + index,
      text: 'Flat 2 · inline item ' + index,
    })),
  },
  {
    id: 'forced-expandable',
    text: 'Forced-expandable category (expandable: true)',
    expandable: true,
    items: [...Array(3)].map((_, index) => ({
      id: 'forced-expandable-item-' + index,
      text: 'Forced · sub item ' + index,
    })),
  },
  ...[...Array(3)].map((_, index) => ({
    id: 'top-item-' + index,
    text: 'Top-level item ' + index,
  })),
  {
    id: 'expandable-3',
    text: 'Expandable category 3',
    items: [...Array(4)].map((_, index) => ({
      id: 'expandable-3-item-' + index,
      text: 'Expandable 3 · sub item ' + index,
    })),
  },
  {
    id: 'flat-4-disabled',
    text: 'Flat category 4 (disabled, expandable: false)',
    expandable: false,
    disabled: true,
    items: [{ id: 'flat-4-item', text: 'Flat 4 · inline item' }],
  },
  {
    id: 'top-item-last',
    text: 'Top-level item (last)',
    secondaryText: 'End of the list',
  },
];

export default function MixedExpandableScenario() {
  const {
    urlParams: { expandToViewport = false, expandableGroups = true },
    setUrlParams,
  } = useContext(AppContext as PageContext);

  return (
    <div className={styles.container}>
      <article>
        <h1>Mixed expandable / flat groups (prototype)</h1>
        <p>
          Each group&apos;s <code>expandable</code> flag overrides the dropdown-level <code>expandableGroups</code>:
          category 2 is forced flat (<code>expandable: false</code>), the forced-expandable category is forced open (
          <code>expandable: true</code>), and the rest inherit the global. Toggle <code>expandableGroups</code> — the
          forced groups hold their behavior while the inheriting ones follow. Use arrow keys to verify navigation
          confines to the current plane and steps across flat groups inline.
        </p>
        <SpaceBetween size="m" direction="horizontal">
          <label>
            <input
              id="expandToViewport"
              type="checkbox"
              checked={expandToViewport}
              onChange={e => setUrlParams({ expandToViewport: !!e.target.checked })}
            />{' '}
            expandToViewport
          </label>
          <label>
            <input
              id="expandableGroups"
              type="checkbox"
              checked={expandableGroups}
              onChange={e => setUrlParams({ expandableGroups: !!e.target.checked })}
            />{' '}
            expandableGroups (global)
          </label>
        </SpaceBetween>

        <div className={styles['wide-container']}>
          <div className={styles.row}>
            <ButtonDropdown
              id="mixedDropdown"
              expandToViewport={expandToViewport}
              expandableGroups={expandableGroups}
              className="bd-mixed"
              items={items}
            >
              Mixed groups
            </ButtonDropdown>
            <ButtonDropdown
              id="mixedFilteringDropdown"
              expandToViewport={expandToViewport}
              expandableGroups={expandableGroups}
              filteringType="auto"
              filteringPlaceholder="Find item"
              className="bd-mixed-filtering"
              items={items}
            >
              Mixed groups + filtering
            </ButtonDropdown>
          </div>
        </div>
      </article>
    </div>
  );
}
