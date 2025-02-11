// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import useForwardFocus from '../internal/hooks/forward-focus/index.js';
import useBaseComponent from '../internal/hooks/use-base-component/index.js';
import { isDevelopment } from '../internal/is-development.js';
import { applyDisplayName } from '../internal/utils/apply-display-name.js';
import { getExternalProps } from '../internal/utils/external-props.js';
import { PopoverProps } from './interfaces.js';
import InternalPopover, { InternalPopoverRef } from './internal.js';

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
      props: { dismissButton, fixedWidth, position, renderWithPortal, size, triggerType },
    });
    const externalProps = getExternalProps(rest);

    const internalRef = useRef<InternalPopoverRef | null>(null);
    useForwardFocus(ref, internalRef);

    return (
      <InternalPopover
        ref={internalRef}
        header={header}
        position={position}
        size={size}
        fixedWidth={fixedWidth}
        triggerType={triggerType}
        dismissButton={dismissButton}
        renderWithPortal={renderWithPortal}
        wrapTriggerText={wrapTriggerText}
        {...externalProps}
        {...baseComponentProps}
      />
    );
  }
);

applyDisplayName(Popover, 'Popover');
export default Popover;
