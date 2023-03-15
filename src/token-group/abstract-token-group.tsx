// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import clsx from 'clsx';

import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useUniqueId } from '../internal/hooks/use-unique-id';
import { getBaseProps } from '../internal/base-component';

import SpaceBetween from '../space-between/internal';

import { TokenGroupProps } from './interfaces';
import DismissButton from './dismiss-button';
import SelectToggle from './toggle';

import styles from './styles.css.js';
import { SomeRequired } from '../internal/types';

type AbstractTokenGroupProps<Item> = Omit<SomeRequired<TokenGroupProps, 'alignment'>, 'items' | 'onDismiss'> &
  InternalBaseComponentProps & {
    items: readonly Item[];
    renderItem: (item: Item) => React.ReactNode;
    getItemAttributes: (item: Item) => { disabled?: boolean; dismissLabel?: string };
    onDismiss?: (index: number, item: Item) => void;
  };

export default function AbstractTokenGroup<Item>({
  items,
  renderItem,
  getItemAttributes,
  alignment,
  onDismiss,
  __internalRootRef,
  limit,
  ...props
}: AbstractTokenGroupProps<Item>) {
  const [expanded, setExpanded] = useState(false);
  const controlId = useUniqueId();

  const hasItems = items.length > 0;
  const hasHiddenItems = hasItems && limit !== undefined && items.length > limit;
  const slicedItems = hasHiddenItems && !expanded ? items.slice(0, limit) : items;

  const baseProps = getBaseProps(props);
  const className = clsx(baseProps.className, styles.root, hasItems && styles['has-items']);

  return (
    <div {...baseProps} className={className} ref={__internalRootRef}>
      {hasItems && (
        <SpaceBetween id={controlId} direction={alignment} size="xs">
          {slicedItems.map((item: Item, itemIndex) => (
            <Token
              key={itemIndex}
              {...getItemAttributes(item)}
              onDismiss={onDismiss && (() => onDismiss(itemIndex, item))}
            >
              {renderItem(item)}
            </Token>
          ))}
        </SpaceBetween>
      )}
      {hasHiddenItems && (
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

interface TokenProps {
  disabled?: boolean;
  dismissLabel?: string;
  children: React.ReactNode;
  onDismiss?: () => void;
}

export function Token({ disabled, dismissLabel, onDismiss, children }: TokenProps) {
  return (
    <div
      className={clsx(styles.token, disabled && styles['token-disabled'])}
      aria-disabled={disabled ? 'true' : undefined}
    >
      {children}
      {onDismiss && <DismissButton disabled={disabled} dismissLabel={dismissLabel} onDismiss={onDismiss} />}
    </div>
  );
}
