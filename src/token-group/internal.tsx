// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import clsx from 'clsx';

import { getAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import { getBaseProps } from '../internal/base-component';
import Option from '../internal/components/option';
import TokenList from '../internal/components/token-list';
import { fireNonCancelableEvent } from '../internal/events';
import checkControlled from '../internal/hooks/check-controlled';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useListFocusController } from '../internal/hooks/use-list-focus-controller';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import { SomeRequired } from '../internal/types';
import { TokenGroupProps } from './interfaces';
import { Token } from './token';

import tokenListStyles from '../internal/components/token-list/styles.css.js';
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

  const [nextFocusIndex, setNextFocusIndex] = useState<null | number>(null);
  const tokenListRef = useListFocusController({
    nextFocusIndex,
    onFocusMoved: target => {
      target.focus();
      setNextFocusIndex(null);
    },
    listItemSelector: `.${tokenListStyles['list-item']}`,
    showMoreSelector: `.${tokenListStyles.toggle}`,
  });

  const baseProps = getBaseProps(props);
  const hasItems = items.length > 0;
  const mergedRef = useMergeRefs(__internalRootRef, tokenListRef);
  return (
    <div
      {...baseProps}
      className={clsx(
        baseProps.className,
        styles.root,
        hasItems && styles['has-items'],
        disableOuterPadding && styles['no-padding']
      )}
      ref={mergedRef}
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
              setNextFocusIndex(itemIndex);
            }}
            disabled={item.disabled}
            readOnly={readOnly}
            {...(item.disabled || readOnly
              ? {}
              : getAnalyticsMetadataAttribute({ detail: { position: `${itemIndex + 1}` } }))}
          >
            <Option option={item} isGenericGroup={false} />
          </Token>
        )}
        i18nStrings={i18nStrings}
        limitShowFewerAriaLabel={limitShowFewerAriaLabel}
        limitShowMoreAriaLabel={limitShowMoreAriaLabel}
        onExpandedClick={isExpanded => {
          if (isExpanded && limit) {
            setNextFocusIndex(limit);
          } else {
            setNextFocusIndex(null);
          }
        }}
      />
    </div>
  );
}
