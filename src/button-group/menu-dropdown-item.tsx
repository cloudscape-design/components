// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { getAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import InternalButton from '../button/internal';
import { ButtonDropdownProps } from '../button-dropdown/interfaces';
import ButtonDropdown from '../button-dropdown/internal';
import { CancelableEventHandler, fireCancelableEvent } from '../internal/events';
import Tooltip from '../tooltip/internal.js';
import { ButtonGroupProps } from './interfaces';

import testUtilStyles from './test-classes/styles.css.js';

interface MenuDropdownItemProps {
  item: ButtonGroupProps.MenuDropdown;
  showTooltip: boolean;
  onTooltipDismiss: () => void;
  onItemClick?: CancelableEventHandler<ButtonGroupProps.ItemClickDetails>;
  expandToViewport?: boolean;
  position: string;
}

const MenuDropdownItem = React.forwardRef(
  (
    { item, showTooltip, onItemClick, onTooltipDismiss, expandToViewport, position }: MenuDropdownItemProps,
    ref: React.Ref<ButtonDropdownProps.Ref>
  ) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const onClickHandler = (event: CustomEvent<ButtonDropdownProps.ItemClickDetails>) => {
      fireCancelableEvent(onItemClick, { id: event.detail.id, checked: event.detail.checked }, event);
    };

    return (
      <ButtonDropdown
        ref={ref}
        variant="icon"
        items={item.items}
        onItemClick={onClickHandler}
        expandToViewport={expandToViewport}
        ariaLabel={item.text}
        className={testUtilStyles['button-group-item']}
        position={position}
        data-testid={item.id}
        disabled={item.disabled}
        customTriggerBuilder={({ onClick, isOpen, triggerRef, ariaLabel, ariaExpanded, testUtilsClass }) => (
          <div ref={containerRef} {...(item.disabled ? {} : getAnalyticsMetadataAttribute({ detail: { position } }))}>
            {!isOpen && showTooltip && !item.disabled && !item.loading && (
              <Tooltip
                getTrack={() => containerRef.current}
                trackKey={item.id}
                content={item.text}
                onEscape={onTooltipDismiss}
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
              loading={item.loading}
              loadingText={item.loadingText}
              disabled={item.disabled}
              disabledReason={item.disabledReason}
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
