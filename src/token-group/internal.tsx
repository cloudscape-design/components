// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import clsx from 'clsx';

import Option from '../internal/components/option';
import { fireNonCancelableEvent } from '../internal/events';
import checkControlled from '../internal/hooks/check-controlled';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useUniqueId } from '../internal/hooks/use-unique-id';
import { getBaseProps } from '../internal/base-component';

import SpaceBetween from '../space-between/internal';

import { TokenGroupProps } from './interfaces';
import DismissButton from './dismiss-button';
import SelectToggle from './toggle';

import styles from './styles.css.js';
import { SomeRequired } from '../internal/types';

type InternalTokenGroupProps = SomeRequired<TokenGroupProps, 'items' | 'alignment'> & InternalBaseComponentProps;

export default function InternalTokenGroup({
  items,
  alignment,
  onDismiss,
  __internalRootRef,
  limit,
  ...props
}: InternalTokenGroupProps) {
  checkControlled('TokenGroup', 'items', items, 'onDismiss', onDismiss);

  const [expanded, setExpanded] = useState(false);
  const controlId = useUniqueId();

  const hasItems = items.length > 0;
  const hasHiddenItems = hasItems && limit !== undefined && items.length > limit;
  const slicedItems = hasHiddenItems && !expanded ? items.slice(0, limit) : items;

  const baseProps = getBaseProps(props);
  const className = clsx(baseProps.className, styles.root, hasItems && styles['has-items']);

  return (
    <div {...baseProps} className={className} ref={__internalRootRef}>
      {!!hasItems && (
        <SpaceBetween id={controlId} direction={alignment} size="xs">
          {slicedItems.map((item: TokenGroupProps.Item, itemIndex) => (
            <Token key={itemIndex} {...item} onDismiss={() => fireNonCancelableEvent(onDismiss, { itemIndex })} />
          ))}
        </SpaceBetween>
      )}
      {!!hasHiddenItems && (
        <SelectToggle
          controlId={controlId}
          allHidden={limit === 0}
          expanded={expanded}
          numberOfHiddenOptions={items.length - slicedItems.length}
          i18nStrings={props.i18nStrings}
          onClick={() => setExpanded(!expanded)}
        />
      )}
    </div>
  );
}

interface TokenProps extends TokenGroupProps.Item {
  onDismiss?: () => void;
}

export function Token({ disabled, dismissLabel, onDismiss, ...props }: TokenProps) {
  return (
    <div
      className={clsx(styles.token, disabled && styles['token-disabled'])}
      aria-disabled={disabled ? 'true' : undefined}
    >
      <Option
        option={{
          ...props,
          disabled,
        }}
      />
      <DismissButton disabled={disabled} dismissLabel={dismissLabel} onDismiss={onDismiss} />
    </div>
  );
}
