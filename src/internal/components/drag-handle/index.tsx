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
      ariaDescribedby,
      tooltipText,
      ariaValue,
      disabled,
      directions = {},
      onPointerDown,
      onKeyDown,
      onDirectionClick,
      ...rest
    }: DragHandleProps,
    ref: React.Ref<DragHandleProps.Ref>
  ) => {
    const baseProps = getBaseProps(rest);

    return (
      <DragHandleWrapper
        directions={!disabled ? directions : {}}
        tooltipText={tooltipText}
        onDirectionClick={onDirectionClick}
      >
        <DragHandleButton
          ref={ref}
          className={baseProps.className}
          variant={variant}
          size={size}
          ariaLabel={ariaLabel}
          ariaDescribedby={ariaDescribedby}
          ariaValue={ariaValue}
          disabled={disabled}
          onPointerDown={onPointerDown}
          onKeyDown={onKeyDown}
        />
      </DragHandleWrapper>
    );
  }
);

export default InternalDragHandle;
