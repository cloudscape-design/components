// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { ButtonGroupProps } from './interfaces';
import { ButtonDropdownProps } from '../button-dropdown/interfaces';
import { CancelableEventHandler, fireCancelableEvent } from '../internal/events';
import ButtonDropdown from '../button-dropdown/internal';
import styles from './styles.css.js';
import testUtilStyles from './test-classes/styles.css.js';
import clsx from 'clsx';
import InternalButton from '../button/internal';
import Tooltip from '../internal/components/tooltip';

const MenuDropdownItem = React.forwardRef(
  (
    {
      item,
      tooltipItemId,
      onItemClick,
      expandToViewport,
    }: {
      item: ButtonGroupProps.MenuDropdown;
      tooltipItemId: string | null;
      onItemClick?: CancelableEventHandler<ButtonGroupProps.ItemClickDetails>;
      expandToViewport?: boolean;
    },
    ref: React.Ref<ButtonDropdownProps.Ref>
  ) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
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
          <div ref={containerRef}>
            {!isOpen && tooltipItemId === item.id && (
              <Tooltip
                trackRef={containerRef}
                trackKey={item.id}
                value={item.text}
                className={clsx(styles.tooltip, testUtilStyles['button-group-tooltip'])}
              />
            )}
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
          </div>
        )}
      />
    );
  }
);

export default MenuDropdownItem;
