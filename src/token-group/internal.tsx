// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

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

  const baseProps = getBaseProps(props);

  return (
    <div {...baseProps} className={clsx(baseProps.className, styles.root)} ref={__internalRootRef}>
      <TokenList
        alignment={alignment}
        items={items}
        limit={limit}
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
