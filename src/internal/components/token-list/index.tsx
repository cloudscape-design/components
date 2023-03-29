// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';

import { TokenLimitToggle } from './token-limit-toggle';
import styles from './styles.css.js';
import { TokenListProps } from './interfaces';
import { useUniqueId } from '../../hooks/use-unique-id';
import clsx from 'clsx';

export default function TokenList<Item>({
  items,
  alignment,
  renderItem,
  limit,
  after,
  i18nStrings,
}: TokenListProps<Item>) {
  const controlId = useUniqueId();

  const [expanded, setExpanded] = useState(false);
  const hasItems = items.length > 0;
  const hasHiddenItems = hasItems && limit !== undefined && items.length > limit;
  const visibleItems = hasHiddenItems && !expanded ? items.slice(0, limit) : items;
  const hasVisibleItems = visibleItems.length > 0;

  const toggle = hasHiddenItems ? (
    <div className={styles[`toggle-container-${alignment}`]}>
      <TokenLimitToggle
        controlId={hasVisibleItems ? controlId : undefined}
        allHidden={limit === 0}
        expanded={expanded}
        numberOfHiddenOptions={items.length - visibleItems.length}
        i18nStrings={i18nStrings}
        onClick={() => setExpanded(!expanded)}
      />
    </div>
  ) : null;

  if (alignment === 'inline') {
    return (
      <div className={styles.root}>
        {hasItems && (
          <div id={controlId} className={clsx(styles.list, styles['list-horizontal'])}>
            {visibleItems.map((item, itemIndex) => (
              <div key={itemIndex} className={styles['list-item']}>
                {renderItem(item, itemIndex)}
              </div>
            ))}
            {toggle}
            {after && <div className={styles.separator} />}
            {after}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={styles.root}>
      {hasVisibleItems && (
        <div id={controlId} className={clsx(styles.list, styles[`list-${alignment}`])}>
          {visibleItems.map((item, itemIndex) => (
            <div key={itemIndex} className={styles['list-item']}>
              {renderItem(item, itemIndex)}
            </div>
          ))}
        </div>
      )}
      {toggle}
      {after}
    </div>
  );
}
