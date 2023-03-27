// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Option from '../internal/components/option';
import checkControlled from '../internal/hooks/check-controlled';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { TokenGroupProps } from './interfaces';
import { SomeRequired } from '../internal/types';
import { TokenList } from '../internal/components/token-list';
import styles from './styles.css.js';
import clsx from 'clsx';
import { getBaseProps } from '../internal/base-component';
import { Token } from './token';
import { fireNonCancelableEvent } from '../internal/events';

type InternalTokenGroupProps = SomeRequired<TokenGroupProps, 'items' | 'alignment'> & InternalBaseComponentProps;

export default function InternalTokenGroup({
  items,
  onDismiss,
  __internalRootRef,
  limit,
  alignment,
  i18nStrings,
  ...props
}: InternalTokenGroupProps) {
  checkControlled('TokenGroup', 'items', items, 'onDismiss', onDismiss);

  const baseProps = getBaseProps(props);
  const hasItems = items.length > 0;
  return (
    <div
      {...baseProps}
      className={clsx(baseProps.className, styles.root, hasItems && styles['has-items'])}
      ref={__internalRootRef}
    >
      <TokenList
        alignment={alignment}
        limit={limit}
        items={items}
        getItemAttributes={item => ({
          ariaLabel: item.label ?? '',
          disabled: item.disabled,
        })}
        renderItem={(item, itemIndex) => (
          <Token
            dismiss={{ label: item.dismissLabel, onDismiss: () => fireNonCancelableEvent(onDismiss, { itemIndex }) }}
            disabled={item.disabled}
          >
            <Option option={item} />
          </Token>
        )}
        i18nStrings={i18nStrings}
      />
    </div>
  );
}
