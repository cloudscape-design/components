// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component/index.js';
import useBaseComponent from '../internal/hooks/use-base-component/index.js';
import { applyDisplayName } from '../internal/utils/apply-display-name.js';
import { ToggleButtonProps } from './interfaces.js';
import { InternalToggleButton } from './internal.js';

export { ToggleButtonProps };

const ToggleButton = React.forwardRef(
  (
    {
      children,
      iconName,
      pressedIconName,
      iconUrl,
      pressedIconUrl,
      iconSvg,
      pressedIconSvg,
      variant = 'normal',
      loading = false,
      loadingText,
      disabled = false,
      disabledReason,
      wrapText = true,
      ariaLabel,
      ariaDescribedby,
      ariaControls,
      pressed = false,
      onChange,
      ...props
    }: ToggleButtonProps,
    ref: React.Ref<ToggleButtonProps.Ref>
  ) => {
    const baseComponentProps = useBaseComponent('ToggleButton', {
      props: { iconName, pressedIconName, pressed, variant, wrapText },
      metadata: {
        hasDisabledReason: Boolean(disabledReason),
      },
    });
    const baseProps = getBaseProps(props);

    return (
      <InternalToggleButton
        {...baseProps}
        {...baseComponentProps}
        ref={ref}
        iconName={iconName}
        iconUrl={iconUrl}
        iconSvg={iconSvg}
        variant={variant}
        loading={loading}
        loadingText={loadingText}
        disabled={disabled}
        disabledReason={disabledReason}
        wrapText={wrapText}
        ariaLabel={ariaLabel}
        ariaDescribedby={ariaDescribedby}
        ariaControls={ariaControls}
        pressedIconName={pressedIconName}
        pressedIconUrl={pressedIconUrl}
        pressedIconSvg={pressedIconSvg}
        pressed={pressed}
        onChange={onChange}
      >
        {children}
      </InternalToggleButton>
    );
  }
);

applyDisplayName(ToggleButton, 'ToggleButton');
export default ToggleButton;
