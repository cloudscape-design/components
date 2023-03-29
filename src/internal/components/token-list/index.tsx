// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import clsx from 'clsx';

import { TokenLimitToggle } from './token-limit-toggle';
import styles from './styles.css.js';
import { TokenListProps } from './interfaces';
import InternalSpaceBetween from '../../../space-between/internal';
import { useUniqueId } from '../../hooks/use-unique-id';

export default function TokenList<Item>({
  items,
  alignment,
  toggleAlignment,
  renderItem,
  limit,
  i18nStrings,
}: TokenListProps<Item>) {
  const controlId = useUniqueId();

  const [expanded, setExpanded] = useState(false);
  const hasItems = items.length > 0;
  const hasHiddenItems = hasItems && limit !== undefined && items.length > limit;
  const visibleItems = hasHiddenItems && !expanded ? items.slice(0, limit) : items;

  return (
    <div className={clsx(styles.root, styles[`root-${toggleAlignment}`])}>
      {hasItems && (
        <InternalSpaceBetween id={controlId} direction={alignment} size="xs">
          {visibleItems.map((item, itemIndex) => renderItem(item, itemIndex))}
        </InternalSpaceBetween>
      )}
      {hasHiddenItems && (
        <TokenLimitToggle
          controlId={controlId}
          allHidden={limit === 0}
          expanded={expanded}
          numberOfHiddenOptions={items.length - visibleItems.length}
          i18nStrings={i18nStrings}
          onClick={() => setExpanded(!expanded)}
        />
      )}
    </div>
  );
}
