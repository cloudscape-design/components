// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { ButtonGroupProps } from './interfaces';
import { ButtonDropdownProps } from '../button-dropdown/interfaces';
import { CancelableEventHandler, fireCancelableEvent } from '../internal/events';
import ButtonDropdown from '../button-dropdown/internal';
import styles from './styles.css.js';

const MenuDropdownItem = React.forwardRef(
  (
    {
      item,
      onItemClick,
      dropdownExpandToViewport,
    }: {
      item: ButtonGroupProps.MenuDropdown;
      onItemClick?: CancelableEventHandler<ButtonGroupProps.ItemClickDetails>;
      dropdownExpandToViewport?: boolean;
    },
    ref: React.Ref<ButtonDropdownProps.Ref>
  ) => {
    const onClickHandler = (event: CustomEvent<ButtonDropdownProps.ItemClickDetails>) => {
      fireCancelableEvent(onItemClick, { id: event.detail.id }, event);
    };

    return (
      <ButtonDropdown
        ref={ref}
        variant="icon"
        loading={item.loading}
        loadingText={item?.loadingText}
        disabled={item?.disabled}
        items={item.items}
        onItemClick={onClickHandler}
        expandToViewport={dropdownExpandToViewport}
        ariaLabel={item.text}
        data-testid={item.id}
        className={styles.item}
      />
    );
  }
);

export default MenuDropdownItem;
