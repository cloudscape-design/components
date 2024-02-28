// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { getBaseProps } from '../internal/base-component';
import { ButtonProps } from './interfaces';
import { InternalButton } from './internal';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import useBaseComponent from '../internal/hooks/use-base-component';
import { useLatencyMetrics } from '../internal/hooks/use-latency-metrics';

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
    const baseComponentProps = useBaseComponent<HTMLAnchorElement | HTMLButtonElement>('Button');
    const baseProps = getBaseProps(props);

    useLatencyMetrics({
      componentName: 'Button',
      elementRef: baseComponentProps.__internalRootRef,
      loading,
      // TODO: Add the instanceId when it becomes available (see document WlbaA28k7yCw).
      instanceId: undefined,
    });

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
