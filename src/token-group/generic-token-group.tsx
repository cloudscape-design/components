// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { forwardRef, useState } from 'react';
import clsx from 'clsx';

import { useUniqueId } from '../internal/hooks/use-unique-id';
import { BaseComponentProps, getBaseProps } from '../internal/base-component';

import SpaceBetween from '../space-between/internal';

import { TokenGroupProps } from './interfaces';
import DismissButton from './dismiss-button';
import SelectToggle from './toggle';

import styles from './styles.css.js';

interface ItemAttributes {
  disabled?: boolean;
  dismiss?: {
    label?: string;
    onDismiss: () => void;
  };
}

interface GenericTokenGroupProps<Item> extends BaseComponentProps {
  items: readonly Item[];
  limit?: number;
  alignment: TokenGroupProps.Alignment;
  renderItem: (item: Item, itemIndex: number) => React.ReactNode;
  getItemAttributes: (item: Item, itemIndex: number) => ItemAttributes;
  i18nStrings?: TokenGroupProps.I18nStrings;
}

export default forwardRef(GenericTokenGroup) as <T>(
  props: GenericTokenGroupProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> }
) => ReturnType<typeof GenericTokenGroup>;

function GenericTokenGroup<Item>(
  { items, alignment, renderItem, getItemAttributes, limit, ...props }: GenericTokenGroupProps<Item>,
  ref: React.Ref<HTMLDivElement>
) {
  const [expanded, setExpanded] = useState(false);
  const controlId = useUniqueId();

  const hasItems = items.length > 0;
  const hasHiddenItems = hasItems && limit !== undefined && items.length > limit;
  const slicedItems = hasHiddenItems && !expanded ? items.slice(0, limit) : items;

  const baseProps = getBaseProps(props);
  const className = clsx(baseProps.className, styles.root, hasItems && styles['has-items']);

  return (
    <div {...baseProps} className={className} ref={ref}>
      {hasItems && (
        <SpaceBetween id={controlId} direction={alignment} size="xs">
          {slicedItems.map((item, itemIndex) => (
            <GenericToken key={itemIndex} {...getItemAttributes(item, itemIndex)}>
              {renderItem(item, itemIndex)}
            </GenericToken>
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

interface GenericTokenProps extends ItemAttributes {
  children: React.ReactNode;
}

function GenericToken({ disabled, dismiss, children }: GenericTokenProps) {
  return (
    <div
      className={clsx(styles.token, disabled && styles['token-disabled'])}
      aria-disabled={disabled ? 'true' : undefined}
    >
      {children}
      {dismiss && <DismissButton disabled={disabled} dismissLabel={dismiss.label} onDismiss={dismiss.onDismiss} />}
    </div>
  );
}
