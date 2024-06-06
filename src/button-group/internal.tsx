// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useImperativeHandle, useRef } from 'react';
import { getBaseProps } from '../internal/base-component';
import { ButtonGroupProps, InternalButtonGroupProps } from './interfaces';
import { isItemGroup, splitItems } from './utils';
import { ButtonProps } from '../button/interfaces';
import { useInternalI18n } from '../i18n/context';
import { ButtonDropdownProps } from '../button-dropdown/interfaces';
import SpaceBetween from '../space-between/internal';
import ItemElement from './item-element';
import MoreItems from './more-items';
import styles from './styles.css.js';
import clsx from 'clsx';

const InternalButtonGroup = React.forwardRef(
  (
    {
      items = [],
      limit = 5,
      onItemClick,
      __internalRootRef = null,
      dropdownExpandToViewport,
      i18nStrings,
      ...props
    }: InternalButtonGroupProps,
    ref: React.Ref<ButtonGroupProps.Ref>
  ) => {
    const itemsRef = useRef<Record<string, ButtonProps.Ref | null>>({});
    const moreItemsRef = useRef<ButtonDropdownProps.Ref | null>(null);
    const baseProps = getBaseProps(props);
    const { primary, secondary } = splitItems(items, limit);

    useImperativeHandle(ref, () => ({
      focus: id => {
        const current = itemsRef.current[id];
        if (current) {
          current.focus();
        } else if (secondary.some(item => item.id === id)) {
          moreItemsRef.current?.focus();
        }
      },
    }));

    const onSetButtonRef = (item: ButtonGroupProps.Item, element: ButtonProps.Ref | null) => {
      itemsRef.current[item.id] = element;
    };

    const i18n = useInternalI18n('button-group');

    return (
      <div {...baseProps} className={clsx(styles.root, baseProps.className)} ref={__internalRootRef}>
        <SpaceBetween direction="horizontal" size="xxs">
          {primary.map((current, index) =>
            isItemGroup(current) && current.items.length > 0 ? (
              <React.Fragment key={current.id}>
                {current.items.map(item => (
                  <ItemElement
                    key={item.id}
                    item={item}
                    onItemClick={onItemClick}
                    ref={element => onSetButtonRef(current, element)}
                  />
                ))}
                {index < primary.length - 1 && <div className={styles.divider} />}
              </React.Fragment>
            ) : (
              <ItemElement
                key={current.id}
                item={current}
                onItemClick={onItemClick}
                ref={element => onSetButtonRef(current, element)}
              />
            )
          )}
          {secondary.length > 0 && (
            <MoreItems
              ref={moreItemsRef}
              items={secondary}
              onItemClick={onItemClick}
              dropdownExpandToViewport={dropdownExpandToViewport}
              ariaLabel={i18n('i18nStrings.showMoreButtonAriaLabel', i18nStrings?.showMoreButtonAriaLabel)}
            />
          )}
        </SpaceBetween>
      </div>
    );
  }
);

export default InternalButtonGroup;
