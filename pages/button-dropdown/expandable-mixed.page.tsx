// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useState } from 'react';

import ButtonDropdown, { ButtonDropdownProps } from '~components/button-dropdown';
import SpaceBetween from '~components/space-between';

import styles from './styles.scss';

// Prototype for per-group expandability (inherit-override): `expandableGroups` is the
// dropdown-level default, and each group's `expandable` flag overrides it — `false` forces a
// group flat even when the default is on, `true` forces it expandable even when the default is
// off, and an unset flag inherits the default. Toggle the global switch to watch the forced
// groups hold their behavior while the inheriting ones follow.
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
  const [expandToViewport, setExpandToViewport] = useState(false);
  const [expandableGroups, setExpandableGroups] = useState(true);
  const [forceMobile, setForceMobile] = useState(false);

  // Force the component into its mobile "restricted view" navigation model without resizing
  // the window, using the built-in override symbol read by the useMobile hook. Dispatching a
  // resize event makes the useMobile singleton re-evaluate immediately.
  useEffect(() => {
    const forceMobileModeSymbol = Symbol.for('awsui-force-mobile-mode');
    if (forceMobile) {
      (globalThis as Record<symbol, unknown>)[forceMobileModeSymbol] = true;
    } else {
      delete (globalThis as Record<symbol, unknown>)[forceMobileModeSymbol];
    }
    window.dispatchEvent(new Event('resize'));
    return () => {
      delete (globalThis as Record<symbol, unknown>)[forceMobileModeSymbol];
      window.dispatchEvent(new Event('resize'));
    };
  }, [forceMobile]);

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
        <p>
          Turn on <strong>Force mobile mode</strong> and open a dropdown with the keyboard: on mobile the flat group
          renders inline and arrow keys step onto its children (the top-plane fix).
        </p>
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
            expandableGroups (global)
          </label>
          <label>
            <input
              id="forceMobile"
              type="checkbox"
              checked={forceMobile}
              onChange={e => setForceMobile(!!e.target.checked)}
            />{' '}
            Force mobile mode (restricted view)
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
