// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';
import { InternalButton, InternalButtonProps } from '../../button/internal';
import TriggerButton from './trigger-button';

import styles from './styles.css.js';
import testutilStyles from '../test-classes/styles.css.js';
import { useMergeRefs } from '../../internal/hooks/use-merge-refs';
import { DrawerFocusControlRefs } from '../utils/use-drawer-focus-control';

export interface BaseTriggerButtonWithRefsProps {
  openedFromOverflow: boolean;
  triggerRef: React.Ref<HTMLElement>;
  ariaLabel?: string;
  ariaExpanded: boolean | undefined;
  overflowMenuHasBadge: boolean;
  testUtilsClass: string;
  drawersRefs: DrawerFocusControlRefs;
}

export interface DesktopTriggerButtonWithRefsProps extends BaseTriggerButtonWithRefsProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

export interface MobileTriggerButtonWithRefsProps extends BaseTriggerButtonWithRefsProps {
  onClick: InternalButtonProps['onClick'];
}

export function TriggerButtonWithRefs({
  openedFromOverflow,
  triggerRef,
  ariaLabel,
  ariaExpanded,
  overflowMenuHasBadge,
  testUtilsClass,
  onClick,
  drawersRefs,
}: DesktopTriggerButtonWithRefsProps) {
  const mergedRef = useMergeRefs(drawersRefs.toggle, triggerRef);
  return (
    <TriggerButton
      ref={openedFromOverflow ? mergedRef : triggerRef}
      ariaLabel={ariaLabel}
      ariaExpanded={ariaExpanded}
      badge={overflowMenuHasBadge}
      className={clsx(styles['drawers-trigger'], testutilStyles['drawers-trigger'], testUtilsClass)}
      iconName="ellipsis"
      onClick={onClick}
    />
  );
}

export function MobileTriggerButtonWithRefs({
  openedFromOverflow,
  triggerRef,
  ariaLabel,
  ariaExpanded,
  overflowMenuHasBadge,
  testUtilsClass,
  onClick,
  drawersRefs,
}: MobileTriggerButtonWithRefsProps) {
  const mergedRef = useMergeRefs(drawersRefs.toggle, triggerRef);
  return (
    <InternalButton
      ref={openedFromOverflow ? mergedRef : triggerRef}
      className={clsx(styles['drawers-trigger'], testutilStyles['drawers-trigger'], testUtilsClass)}
      ariaLabel={ariaLabel}
      ariaExpanded={ariaExpanded}
      variant="icon"
      iconName="ellipsis"
      badge={overflowMenuHasBadge}
      onClick={onClick}
    />
  );
}
