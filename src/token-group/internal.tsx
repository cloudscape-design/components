// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';

import Option from '../internal/components/option';
import { fireNonCancelableEvent } from '../internal/events';
import checkControlled from '../internal/hooks/check-controlled';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';

import { TokenGroupProps } from './interfaces';
import { SomeRequired } from '../internal/types';
import { getBaseProps } from '../internal/base-component';
import clsx from 'clsx';
import styles from './styles.css.js';
import TokenList from '../internal/components/token-list';
import { Token } from './token';

type InternalTokenGroupProps = SomeRequired<TokenGroupProps, 'items' | 'alignment'> & InternalBaseComponentProps;

export default function InternalTokenGroup({
  alignment,
  items,
  onDismiss,
  limit,
  i18nStrings,
  __internalRootRef,
  ...props
}: InternalTokenGroupProps) {
  checkControlled('TokenGroup', 'items', items, 'onDismiss', onDismiss);

  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const dismissButtonRefs = useRef<{ [key: number]: HTMLButtonElement }>({});
  const [removedItemIndex, setRemovedItemIndex] = useState<null | number>(null);

  const baseProps = getBaseProps(props);
  const hasItems = items.length > 0;

  useEffect(() => {
    if (removedItemIndex === null) {
      return;
    }

    const activeItemIndices = Object.keys(dismissButtonRefs.current).map(key => parseInt(key));

    let closestPrevIndex = Number.NEGATIVE_INFINITY;
    let closestNextIndex = Number.POSITIVE_INFINITY;

    for (const activeIndex of activeItemIndices) {
      if (activeIndex < removedItemIndex) {
        closestPrevIndex =
          removedItemIndex - activeIndex < removedItemIndex - closestPrevIndex ? activeIndex : closestPrevIndex;
      } else {
        closestNextIndex =
          activeIndex - removedItemIndex < closestNextIndex - removedItemIndex ? activeIndex : closestNextIndex;
      }
    }

    if (dismissButtonRefs.current[closestNextIndex]) {
      dismissButtonRefs.current[closestNextIndex].focus();
    } else if (dismissButtonRefs.current[closestPrevIndex]) {
      dismissButtonRefs.current[closestPrevIndex].focus();
    } else if (toggleButtonRef.current) {
      toggleButtonRef.current.focus();
    }

    setRemovedItemIndex(null);
  }, [removedItemIndex]);

  return (
    <div
      {...baseProps}
      className={clsx(baseProps.className, styles.root, hasItems && styles['has-items'])}
      ref={__internalRootRef}
    >
      <TokenList
        alignment={alignment}
        items={items}
        limit={limit}
        renderItem={(item, itemIndex) => (
          <Token
            dismissButtonRef={elem => {
              if (elem && !item.disabled) {
                dismissButtonRefs.current[itemIndex] = elem;
              } else {
                delete dismissButtonRefs.current[itemIndex];
              }
            }}
            dismissLabel={item.dismissLabel}
            onDismiss={() => {
              fireNonCancelableEvent(onDismiss, { itemIndex });
              setRemovedItemIndex(itemIndex);
            }}
            disabled={item.disabled}
          >
            <Option option={item} />
          </Token>
        )}
        i18nStrings={i18nStrings}
        toggleButtonRef={toggleButtonRef}
      />
    </div>
  );
}
