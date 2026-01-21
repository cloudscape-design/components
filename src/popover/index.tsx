// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import useBaseComponent from '../internal/hooks/use-base-component';
import { isDevelopment } from '../internal/is-development';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { getExternalProps } from '../internal/utils/external-props';
import { PopoverProps } from './interfaces';
import InternalPopover from './internal';

export { PopoverProps };

const Popover = React.forwardRef(
  (
    {
      position = 'right',
      size = 'medium',
      fixedWidth = false,
      triggerType = 'text',
      dismissButton = true,
      renderWithPortal = false,
      wrapTriggerText = true,
      maxHeight,
      header,
      ...rest
    }: PopoverProps,
    ref: React.Ref<PopoverProps.Ref>
  ) => {
    if (isDevelopment) {
      if (dismissButton && !header) {
        warnOnce('Popover', `You should provide a \`header\` when \`dismissButton\` is true.`);
      }
    }

    const baseComponentProps = useBaseComponent('Popover', {
      props: { dismissButton, fixedWidth, maxHeight, position, renderWithPortal, size, triggerType },
    });
    const externalProps = getExternalProps(rest);

    return (
      <InternalPopover
        ref={ref}
        header={header}
        position={position}
        size={size}
        fixedWidth={fixedWidth}
        triggerType={triggerType}
        dismissButton={dismissButton}
        renderWithPortal={renderWithPortal}
        wrapTriggerText={wrapTriggerText}
        maxHeight={maxHeight}
        {...externalProps}
        {...baseComponentProps}
      />
    );
  }
);

applyDisplayName(Popover, 'Popover');
export default Popover;
