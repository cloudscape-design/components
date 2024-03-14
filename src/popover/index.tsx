// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import InternalPopover from './internal';
import { getExternalProps } from '../internal/utils/external-props';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import useBaseComponent from '../internal/hooks/use-base-component';
import { isDevelopment } from '../internal/is-development';
import { warnOnce } from '@cloudscape-design/component-toolkit/internal';
import { PopoverProps } from './interfaces';

export { PopoverProps };

export default function Popover({
  position = 'right',
  size = 'medium',
  fixedWidth = false,
  triggerType = 'text',
  dismissButton = true,
  renderWithPortal = false,
  header,
  ...rest
}: PopoverProps) {
  if (isDevelopment) {
    if (dismissButton && !header) {
      warnOnce('Popover', `You should provide a \`header\` when \`dismissButton\` is true.`);
    }
  }

  const baseComponentProps = useBaseComponent('Popover', {
    props: { dismissButton, fixedWidth, position, renderWithPortal, size, triggerType },
  });
  const externalProps = getExternalProps(rest);
  return (
    <InternalPopover
      header={header}
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
