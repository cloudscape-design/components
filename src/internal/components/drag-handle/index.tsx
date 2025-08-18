// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { forwardRef } from 'react';

import { getBaseProps } from '../../base-component';
import DragHandleWrapper from '../drag-handle-wrapper';
import DragHandleButton from './button';
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
      onClick,
      onKeyDown,
      onDirectionClick,
      triggerMode,
      initialShowButtons,
      controlledShowButtons,
      hideButtonsOnDrag = false,
      clickDragThreshold = 3,
      active,
      ...rest
    }: DragHandleProps,
    ref: React.Ref<Element>
  ) => {
    const baseProps = getBaseProps(rest);

    return (
      <DragHandleWrapper
        directions={!disabled ? directions : {}}
        tooltipText={tooltipText}
        onDirectionClick={onDirectionClick}
        triggerMode={triggerMode}
        initialShowButtons={initialShowButtons}
        controlledShowButtons={controlledShowButtons}
        hideButtonsOnDrag={hideButtonsOnDrag}
        clickDragThreshold={clickDragThreshold}
      >
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
          onPointerDown={onPointerDown}
          onClick={onClick}
          onKeyDown={onKeyDown}
        />
      </DragHandleWrapper>
    );
  }
);

export default InternalDragHandle;
