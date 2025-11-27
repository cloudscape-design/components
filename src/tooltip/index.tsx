// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { TooltipProps } from './interfaces';
import InternalTooltip from './internal';

export { TooltipProps };

const Tooltip = React.forwardRef(
  (
    {
      value,
      trackRef,
      trackKey,
      position,
      className,
      contentAttributes,
      size,
      hideOnOverscroll,
      onDismiss,
      ...props
    }: TooltipProps,
    ref: React.Ref<TooltipProps.Ref>
  ) => {
    const baseComponentProps = useBaseComponent('Tooltip', {
      props: { position, size },
    });
    const baseProps = getBaseProps(props);

    return (
      <InternalTooltip
        {...baseProps}
        {...baseComponentProps}
        ref={ref}
        value={value}
        trackRef={trackRef}
        trackKey={trackKey}
        position={position}
        className={className}
        contentAttributes={contentAttributes}
        size={size}
        hideOnOverscroll={hideOnOverscroll}
        onDismiss={onDismiss}
      />
    );
  }
);

applyDisplayName(Tooltip, 'Tooltip');
export default Tooltip;
