// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { forwardRef } from 'react';

import { getBaseProps } from '../../base-component';
import DragHandleButton from './components/button';
import DragHandleWrapper from './components/wrapper';
import { useDefaultDragBehavior } from './hooks/use-default-drag-behavior';
import { DragHandleProps } from './interfaces';

export { DragHandleProps };

const InternalDragHandle = forwardRef(
  (
    {
      variant,
      size,
      ariaLabel,
      ariaLabelledBy,
      ariaDescribedby,
      tooltipText,
      ariaValue,
      disabled,
      directions = {},
      onPointerDown,
      onKeyDown,
      onDirectionClick,
      triggerMode = 'focus',
      initialShowButtons = false,
      hideButtonsOnDrag = false,
      clickDragThreshold = 3,
      active,
      ...rest
    }: DragHandleProps,
    ref: React.Ref<Element>
  ) => {
    const baseProps = getBaseProps(rest);
    const { wrapperProps } = useDefaultDragBehavior({
      directions,
      triggerMode,
      initialShowButtons,
      hideButtonsOnDrag,
      clickDragThreshold,
      onDirectionClick,
    });

    return (
      <DragHandleWrapper tooltipText={tooltipText} {...wrapperProps}>
        <DragHandleButton
          ref={ref}
          className={baseProps.className}
          variant={variant}
          size={size}
          ariaLabel={ariaLabel}
          ariaLabelledBy={ariaLabelledBy}
          ariaDescribedby={ariaDescribedby}
          ariaValue={ariaValue}
          disabled={disabled}
          active={active}
          onKeyDown={onKeyDown}
          onPointerDown={onPointerDown}
        />
      </DragHandleWrapper>
    );
  }
);

export default InternalDragHandle;
