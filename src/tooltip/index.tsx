// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { TooltipProps } from './interfaces';
import InternalTooltip from './internal';

export { TooltipProps };

export default function Tooltip({
  position = 'top',
  align = 'center',
  trigger = 'hover-focus',
  open,
  defaultOpen = false,
  onOpenChange,
  showDelay = 120,
  hideDelay = 200,
  hideOnOverscroll = true,
  disableHoverableContent = false,
  ...props
}: TooltipProps) {
  const baseComponentProps = useBaseComponent('Tooltip', {
    props: {
      position,
      align,
      trigger,
      open,
      defaultOpen,
      showDelay,
      hideDelay,
      hideOnOverscroll,
      disableHoverableContent,
    },
  });

  return (
    <InternalTooltip
      position={position}
      align={align}
      trigger={trigger}
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      showDelay={showDelay}
      hideDelay={hideDelay}
      hideOnOverscroll={hideOnOverscroll}
      disableHoverableContent={disableHoverableContent}
      {...props}
      {...baseComponentProps}
    />
  );
}

applyDisplayName(Tooltip, 'Tooltip');
