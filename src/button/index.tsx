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
      loadingText,
      disabled = false,
      wrapText = true,
      href,
      target,
      rel,
      download,
      formAction = 'submit',
      ariaLabel,
      ariaDescribedby,
      onClick,
      onFollow,
      ariaExpanded,
      ariaControls,
      fullWidth,
      form,
      ...props
    }: ButtonProps,
    ref: React.Ref<ButtonProps.Ref>
  ) => {
    const baseComponentProps = useBaseComponent('Button', {
      props: { formAction, fullWidth, iconAlign, iconName, rel, target, variant, wrapText },
    });
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
        loadingText={loadingText}
        disabled={disabled}
        wrapText={wrapText}
        href={href}
        target={target}
        rel={rel}
        download={download}
        formAction={formAction}
        ariaLabel={ariaLabel}
        ariaDescribedby={ariaDescribedby}
        onClick={onClick}
        onFollow={onFollow}
        ariaExpanded={ariaExpanded}
        ariaControls={ariaControls}
        fullWidth={fullWidth}
        form={form}
      >
        {children}
      </InternalButton>
    );
  }
);

applyDisplayName(Button, 'Button');
export default Button;
