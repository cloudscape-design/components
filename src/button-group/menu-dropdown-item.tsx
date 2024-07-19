// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect } from 'react';
import { ButtonGroupProps } from './interfaces';
import { ButtonDropdownProps } from '../button-dropdown/interfaces';
import { CancelableEventHandler, fireCancelableEvent } from '../internal/events';
import ButtonDropdown from '../button-dropdown/internal';
import styles from './styles.css.js';
import testUtilStyles from './test-classes/styles.css.js';
import clsx from 'clsx';
import InternalButton from '../button/internal';

const MenuDropdownItem = React.forwardRef(
  (
    {
      item,
      onItemClick,
      onDrowdownOpen,
      expandToViewport,
    }: {
      item: ButtonGroupProps.MenuDropdown;
      onItemClick?: CancelableEventHandler<ButtonGroupProps.ItemClickDetails>;
      onDrowdownOpen: (id: string, open: boolean) => void;
      expandToViewport?: boolean;
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
        loadingText={item.loadingText}
        disabled={item.disabled}
        items={item.items}
        onItemClick={onClickHandler}
        expandToViewport={expandToViewport}
        ariaLabel={item.text}
        className={testUtilStyles['button-group-item']}
        data-testid={item.id}
        customTriggerBuilder={({ onClick, isOpen, triggerRef, ariaLabel, ariaExpanded, testUtilsClass }) => (
          <>
            <InternalOpenEventEmitter isOpen={isOpen} item={item} onDrowdownOpen={onDrowdownOpen} />
            <InternalButton
              ref={triggerRef}
              variant="icon"
              ariaLabel={ariaLabel}
              ariaExpanded={ariaExpanded}
              className={clsx(styles.item, testUtilsClass)}
              data-testid={item.id}
              iconName="ellipsis"
              onClick={onClick}
              __title=""
            />
          </>
        )}
      />
    );
  }
);

function InternalOpenEventEmitter({
  item,
  isOpen,
  onDrowdownOpen,
}: {
  item: ButtonGroupProps.MenuDropdown;
  isOpen: boolean;
  onDrowdownOpen: (id: string, open: boolean) => void;
}) {
  useEffect(() => {
    onDrowdownOpen(item.id, isOpen);
  }, [isOpen, item.id, onDrowdownOpen]);

  return null;
}

export default MenuDropdownItem;
