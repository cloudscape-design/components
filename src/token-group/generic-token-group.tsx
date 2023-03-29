// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { forwardRef } from 'react';
import clsx from 'clsx';

import { BaseComponentProps, getBaseProps } from '../internal/base-component';

import { TokenGroupProps } from './interfaces';
import DismissButton from './dismiss-button';

import styles from './styles.css.js';
import TokenList from '../internal/components/token-list';

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
  { items, alignment, renderItem, getItemAttributes, limit, i18nStrings, ...props }: GenericTokenGroupProps<Item>,
  ref: React.Ref<HTMLDivElement>
) {
  const baseProps = getBaseProps(props);
  return (
    <div {...baseProps} className={clsx(baseProps.className, styles.root)} ref={ref}>
      <TokenList
        alignment={alignment}
        items={items}
        limit={limit}
        renderItem={(item, itemIndex) => (
          <GenericToken key={itemIndex} {...getItemAttributes(item, itemIndex)}>
            {renderItem(item, itemIndex)}
          </GenericToken>
        )}
        i18nStrings={i18nStrings}
      />
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
