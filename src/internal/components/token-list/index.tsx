// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';

import { TokenLimitToggle } from './token-limit-toggle';
import styles from './styles.css.js';
import { TokenListProps } from './interfaces';
import InternalSpaceBetween from '../../../space-between/internal';
import { useUniqueId } from '../../hooks/use-unique-id';

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
          <InternalSpaceBetween id={controlId} direction="horizontal" size="xs" className={styles.list}>
            {visibleItems.map((item, itemIndex) => renderItem(item, itemIndex))}
            {toggle}
            {after && <div className={styles.separator} />}
            {after}
          </InternalSpaceBetween>
        )}
      </div>
    );
  }

  return (
    <InternalSpaceBetween className={styles.root} size="xs">
      {hasVisibleItems && (
        <InternalSpaceBetween id={controlId} direction={alignment} size="xs" className={styles.list}>
          {visibleItems.map((item, itemIndex) => renderItem(item, itemIndex))}
        </InternalSpaceBetween>
      )}
      {toggle}
      {after}
    </InternalSpaceBetween>
  );
}
