// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React from 'react';
import { ButtonProps } from '../../button/interfaces';
import { InternalButton } from '../../button/internal';
import buttonDropdownStyles from '../../button-dropdown/styles.css.js';

export const getTrigger = (hasOverflowBadge: boolean, isActive: boolean) => {
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
