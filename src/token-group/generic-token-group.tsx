// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { forwardRef } from 'react';
import clsx from 'clsx';

import { BaseComponentProps, getBaseProps } from '../internal/base-component';

import { TokenGroupProps } from './interfaces';
import DismissButton from './dismiss-button';

import styles from './styles.css.js';
import { TokenList } from '../internal/components/token-list/token-list';

interface ItemAttributes {
  ariaLabel: string;
  disabled?: boolean;
  dismiss?: {
    label?: string;
    onDismiss: () => void;
  };
}

export interface GenericTokenGroupProps<Item> extends BaseComponentProps {
  items: readonly Item[];
  list?: boolean;
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
  { items, alignment, renderItem, getItemAttributes, list, limit, ...props }: GenericTokenGroupProps<Item>,
  ref: React.Ref<HTMLDivElement>
) {
  const baseProps = getBaseProps(props);
  return (
    <div {...baseProps} className={clsx(baseProps.className, styles.root)} ref={ref}>
      <TokenList
        variant={list ? 'ul' : 'div'}
        alignment={alignment}
        limit={limit}
        items={items}
        getItemAttributes={getItemAttributes}
        renderItem={(item, itemIndex) => {
          const { dismiss, disabled } = getItemAttributes(item, itemIndex);
          return (
            <div className={clsx(styles.token, disabled && styles['token-disabled'])}>
              {renderItem(item, itemIndex)}
              {dismiss && (
                <DismissButton disabled={disabled} dismissLabel={dismiss.label} onDismiss={dismiss.onDismiss} />
              )}
            </div>
          );
        }}
        i18nStrings={props.i18nStrings}
      />
    </div>
  );
}
