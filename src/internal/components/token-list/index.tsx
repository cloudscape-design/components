// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import clsx from 'clsx';

import { useUniqueId } from '../../hooks/use-unique-id';
import { TokenListProps } from './interfaces';
import TokenLimitToggle from './token-limit-toggle';

import styles from './styles.css.js';

export { TokenListProps };

export default function TokenList<Item>({
  items,
  secondaryItems = [],
  alignment,
  renderItem,
  renderSecondary,
  beforeSecondary = null,
  limit,
  after,
  i18nStrings,
  limitShowFewerAriaLabel,
  limitShowMoreAriaLabel,
  onExpandedClick = () => undefined,
}: TokenListProps<Item>) {
  const controlId = useUniqueId();

  const [expanded, setExpanded] = useState(false);
  const hasItems = items.length > 0;
  const hasSecondaryItems = secondaryItems.length > 0;
  const allItems = [...items, ...secondaryItems];
  const hasHiddenItems = (hasItems || hasSecondaryItems) && limit !== undefined && allItems.length > limit;
  const allVisibleItems = hasHiddenItems && !expanded ? allItems.slice(0, limit) : allItems;
  const visibleItems = items.filter(item => allVisibleItems.includes(item));
  const visibleSecondaryItems = secondaryItems.filter(item => allVisibleItems.includes(item));
  const hasVisibleItems = allVisibleItems.length > 0;

  const toggle = hasHiddenItems ? (
    <div className={styles[`toggle-container-${alignment}`]}>
      <TokenLimitToggle
        controlId={hasVisibleItems ? controlId : undefined}
        allHidden={limit === 0}
        expanded={expanded}
        numberOfHiddenOptions={allItems.length - allVisibleItems.length}
        i18nStrings={i18nStrings}
        limitShowFewerAriaLabel={limitShowFewerAriaLabel}
        limitShowMoreAriaLabel={limitShowMoreAriaLabel}
        onClick={() => {
          const isExpanded = !expanded;
          setExpanded(isExpanded);
          onExpandedClick(isExpanded);
        }}
      />
    </div>
  ) : null;

  if (alignment === 'inline') {
    return (
      <div className={clsx(styles.root, styles.horizontal)}>
        {hasItems && (
          <ul id={controlId} className={styles.list}>
            {visibleItems.map((item, itemIndex) => (
              <li
                key={itemIndex}
                className={styles['list-item']}
                aria-setsize={items.length}
                aria-posinset={itemIndex + 1}
              >
                {renderItem(item, itemIndex)}
              </li>
            ))}
          </ul>
        )}
        {visibleSecondaryItems.length > 0 && (
          <>
            {hasItems && <div className={styles.separator} />}
            {beforeSecondary && (
              <div style={{ marginInlineStart: hasItems ? -16 : 0, display: 'flex', alignItems: 'center' }}>
                {beforeSecondary}
              </div>
            )}
            <ul id={controlId} className={styles.list}>
              {visibleSecondaryItems.map((item, itemIndex) => (
                <li
                  key={itemIndex}
                  className={styles['list-item']}
                  aria-setsize={items.length}
                  aria-posinset={itemIndex + 1}
                >
                  {(renderSecondary || renderItem)(item, itemIndex)}
                </li>
              ))}
            </ul>
          </>
        )}
        {toggle}
        {after && <div className={styles.separator} />}
        {after}
      </div>
    );
  }

  return (
    <div className={clsx(styles.root, styles.vertical)}>
      {hasVisibleItems && (
        <ul
          id={controlId}
          className={clsx(styles.list, {
            [styles.vertical]: alignment === 'vertical',
            [styles.horizontal]: alignment === 'horizontal',
            [styles.grid]: alignment === 'horizontal-grid',
          })}
        >
          {visibleItems.map((item, itemIndex) => (
            <li
              key={itemIndex}
              className={styles['list-item']}
              aria-setsize={items.length}
              aria-posinset={itemIndex + 1}
            >
              {renderItem(item, itemIndex)}
            </li>
          ))}
        </ul>
      )}
      {toggle}
      {after}
    </div>
  );
}
