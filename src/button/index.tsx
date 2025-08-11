// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name.js';
import { ButtonProps } from './interfaces.js';
import { InternalButton } from './internal.js';

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
      disabledReason,
      wrapText = true,
      href,
      target,
      rel,
      external = false,
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
      i18nStrings,
      style,
      nativeButtonAttributes,
      nativeAnchorAttributes,
      ...props
    }: ButtonProps,
    ref: React.Ref<ButtonProps.Ref>
  ) => {
    const baseComponentProps = useBaseComponent('Button', {
      props: { formAction, fullWidth, iconAlign, iconName, rel, target, external, variant, wrapText },
      metadata: { hasDisabledReason: Boolean(disabledReason) },
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
        disabledReason={disabledReason}
        wrapText={wrapText}
        href={href}
        target={target}
        rel={rel}
        external={external}
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
        i18nStrings={i18nStrings}
        style={style}
        nativeButtonAttributes={nativeButtonAttributes}
        nativeAnchorAttributes={nativeAnchorAttributes}
        __injectAnalyticsComponentMetadata={true}
      >
        {children}
      </InternalButton>
    );
  }
);

applyDisplayName(Button, 'Button');
export default Button;
