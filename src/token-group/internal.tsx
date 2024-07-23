// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import clsx from 'clsx';

import { getBaseProps } from '../internal/base-component';
import Option from '../internal/components/option';
import TokenList from '../internal/components/token-list';
import { fireNonCancelableEvent } from '../internal/events';
import checkControlled from '../internal/hooks/check-controlled';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { SomeRequired } from '../internal/types';
import { TokenGroupProps } from './interfaces';
import { Token } from './token';

import styles from './styles.css.js';

type InternalTokenGroupProps = SomeRequired<TokenGroupProps, 'items' | 'alignment'> & InternalBaseComponentProps;

export default function InternalTokenGroup({
  alignment,
  items,
  onDismiss,
  limit,
  i18nStrings,
  disableOuterPadding,
  limitShowFewerAriaLabel,
  limitShowMoreAriaLabel,
  readOnly,
  __internalRootRef,
  ...props
}: InternalTokenGroupProps) {
  checkControlled('TokenGroup', 'items', items, 'onDismiss', onDismiss);

  const [removedItemIndex, setRemovedItemIndex] = useState<null | number>(null);

  const baseProps = getBaseProps(props);
  const hasItems = items.length > 0;
  return (
    <div
      {...baseProps}
      className={clsx(
        baseProps.className,
        styles.root,
        hasItems && styles['has-items'],
        disableOuterPadding && styles['no-padding']
      )}
      ref={__internalRootRef}
    >
      <TokenList
        alignment={alignment}
        items={items}
        limit={limit}
        renderItem={(item, itemIndex) => (
          <Token
            ariaLabel={item.label}
            dismissLabel={item.dismissLabel}
            onDismiss={() => {
              fireNonCancelableEvent(onDismiss, { itemIndex });
              setRemovedItemIndex(itemIndex);
            }}
            disabled={item.disabled}
            readOnly={readOnly}
          >
            <Option option={item} isGenericGroup={false} />
          </Token>
        )}
        i18nStrings={i18nStrings}
        limitShowFewerAriaLabel={limitShowFewerAriaLabel}
        limitShowMoreAriaLabel={limitShowMoreAriaLabel}
        moveFocusNextToIndex={removedItemIndex}
        onExpandedClick={isExpanded => {
          if (isExpanded && limit) {
            setRemovedItemIndex(limit);
          } else {
            setRemovedItemIndex(null);
          }
        }}
      />
    </div>
  );
}
