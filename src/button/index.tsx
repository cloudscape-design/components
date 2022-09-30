// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { getBaseProps } from '../internal/base-component';
import { ButtonProps } from './interfaces';
import { InternalButton } from './internal';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import useBaseComponent from '../internal/hooks/use-base-component';

export { ButtonProps };

const Button = React.forwardRef(
  (
    {
      children,
      iconName,
      iconAlign = 'left',
      iconUrl,
      iconSvg,
      iconAlt,
      variant = 'normal',
      loading = false,
      disabled = false,
      wrapText = true,
      href,
      target,
      download,
      formAction = 'submit',
      ariaLabel,
      onClick,
      onFollow,
      ariaExpanded,
      loadingAriaLiveText,
      ...props
    }: ButtonProps,
    ref: React.Ref<ButtonProps.Ref>
  ) => {
    const baseComponentProps = useBaseComponent('Button');
    const baseProps = getBaseProps(props);
    return (
      <InternalButton
        {...baseProps}
        {...baseComponentProps}
        ref={ref}
        iconName={iconName}
        iconAlign={iconAlign}
        iconUrl={iconUrl}
        iconSvg={iconSvg}
        iconAlt={iconAlt}
        variant={variant}
        loading={loading}
        disabled={disabled}
        wrapText={wrapText}
        href={href}
        target={target}
        download={download}
        formAction={formAction}
        ariaLabel={ariaLabel}
        onClick={onClick}
        onFollow={onFollow}
        ariaExpanded={ariaExpanded}
        loadingAriaLiveText={loadingAriaLiveText}
      >
        {children}
      </InternalButton>
    );
  }
);

applyDisplayName(Button, 'Button');
export default Button;
