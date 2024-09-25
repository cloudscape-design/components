// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import InternalButton from '../button/internal';
import { ButtonDropdownProps } from '../button-dropdown/interfaces';
import ButtonDropdown from '../button-dropdown/internal';
import Tooltip from '../internal/components/tooltip';
import { CancelableEventHandler, fireCancelableEvent } from '../internal/events';
import { ButtonGroupProps } from './interfaces';

import testUtilStyles from './test-classes/styles.css.js';

interface MenuDropdownItemProps {
  item: ButtonGroupProps.MenuDropdown;
  showTooltip: boolean;
  onItemClick?: CancelableEventHandler<ButtonGroupProps.ItemClickDetails>;
  expandToViewport?: boolean;
}

const MenuDropdownItem = React.forwardRef(
  (
    { item, showTooltip, onItemClick, expandToViewport }: MenuDropdownItemProps,
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
            {!isOpen && showTooltip && !item.disabled && !item.loading && (
              <Tooltip
                trackRef={containerRef}
                trackKey={item.id}
                value={item.text}
                className={clsx(testUtilStyles.tooltip, testUtilStyles['button-group-tooltip'])}
              />
            )}
            <InternalButton
              ref={triggerRef}
              variant="icon"
              ariaLabel={ariaLabel}
              data-itemid={item.id}
              ariaExpanded={ariaExpanded}
              className={clsx(testUtilStyles.item, testUtilsClass)}
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
