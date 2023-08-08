// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React from 'react';
import { ButtonProps } from '../../button/interfaces';
import { InternalButton } from '../../button/internal';
import buttonDropdownStyles from '../../button-dropdown/styles.css.js';
import InternalButtonDropdown from '../../button-dropdown/internal';
import { ButtonDropdownProps } from '../../button-dropdown/interfaces';
import { CancelableEventHandler } from '../../internal/events';

const getTrigger = (hasOverflowBadge?: boolean, isActive?: boolean) => {
  const DropdownTrigger = (
    clickHandler: () => void,
    ref: React.Ref<ButtonProps.Ref>,
    isDisabled: boolean,
    isExpanded: boolean,
    ariaLabel?: string
  ) => {
    return (
      <InternalButton
        disabled={isDisabled}
        onClick={event => {
          event.preventDefault();
          clickHandler();
        }}
        className={clsx(isActive && buttonDropdownStyles['trigger-active'])}
        ref={ref}
        ariaExpanded={isExpanded}
        aria-haspopup={true}
        ariaLabel={ariaLabel}
        variant="icon"
        iconName="ellipsis"
        badge={hasOverflowBadge}
        badgeColor="red"
      />
    );
  };
  return DropdownTrigger;
};

interface OverflowMenuProps {
  drawersRefs?: any;
  className?: any;
  overflowItems: any[];
  onItemClick: CancelableEventHandler<ButtonDropdownProps.ItemClickDetails>;
  hasOverflowBadge?: boolean;
  hasActiveStyles?: boolean;
}

export default function OverflowMenu(props: OverflowMenuProps) {
  const { drawersRefs, className, overflowItems, onItemClick, hasOverflowBadge, hasActiveStyles } = props;
  return (
    <InternalButtonDropdown
      ref={drawersRefs ? drawersRefs.toggle : null}
      className={className}
      items={overflowItems.map(item => ({
        id: item.id,
        text: item.ariaLabels?.content || 'Content',
        iconName: item.trigger.iconName,
        iconSvg: item.trigger.iconSvg,
        badge: item.badge,
      }))}
      onItemClick={onItemClick}
      ariaLabel="Overflow drawer triggers"
      variant="icon"
      customTriggerBuilder={getTrigger(hasOverflowBadge, hasActiveStyles)}
      expandToViewport={true}
    />
  );
}
