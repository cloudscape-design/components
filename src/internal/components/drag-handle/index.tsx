// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { forwardRef } from 'react';

import { getBaseProps } from '../../base-component/index.js';
import DragHandleWrapper from '../drag-handle-wrapper/index.js';
import DragHandleButton from './button.js';
import { DragHandleProps } from './interfaces.js';

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
      triggerMode,
      initialShowButtons,
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
          onKeyDown={onKeyDown}
        />
      </DragHandleWrapper>
    );
  }
);

export default InternalDragHandle;
