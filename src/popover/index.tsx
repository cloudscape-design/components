// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import InternalPopover from './internal';
import { getExternalProps } from '../internal/utils/external-props';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import useBaseComponent from '../internal/hooks/use-base-component';
import { PopoverProps } from './interfaces';

export { PopoverProps };

export default function Popover({
  position = 'right',
  size = 'medium',
  fixedWidth = false,
  triggerType = 'text',
  dismissButton = true,
  renderWithPortal = false,
  ...rest
}: PopoverProps) {
  const baseComponentProps = useBaseComponent('Popover');
  const externalProps = getExternalProps(rest);
  return (
    <InternalPopover
      position={position}
      size={size}
      fixedWidth={fixedWidth}
      triggerType={triggerType}
      dismissButton={dismissButton}
      renderWithPortal={renderWithPortal}
      {...externalProps}
      {...baseComponentProps}
    />
  );
}

applyDisplayName(Popover, 'Popover');
