// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { getBaseProps } from '../internal/base-component';
import { ToggleButtonProps } from './interfaces';
import { InternalToggleButton } from './internal';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import useBaseComponent from '../internal/hooks/use-base-component';

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
      iconAlt,
      variant = 'normal',
      loading = false,
      loadingText,
      disabled = false,
      disabledReason,
      wrapText = true,
      ariaLabel,
      ariaDescribedby,
      onClick,
      onFollow,
      ariaControls,
      fullWidth,
      pressed = false,
      onChange,
      ...props
    }: ToggleButtonProps,
    ref: React.Ref<ToggleButtonProps.Ref>
  ) => {
    const baseComponentProps = useBaseComponent('ToggleButton', {
      props: { fullWidth, iconName, pressedIconName, pressed, variant, wrapText },
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
        iconAlt={iconAlt}
        variant={variant}
        loading={loading}
        loadingText={loadingText}
        disabled={disabled}
        disabledReason={disabledReason}
        wrapText={wrapText}
        ariaLabel={ariaLabel}
        ariaDescribedby={ariaDescribedby}
        onClick={onClick}
        onFollow={onFollow}
        ariaControls={ariaControls}
        fullWidth={fullWidth}
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
