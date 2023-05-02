// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { SplitButtonProps } from './interfaces';
import InternalSplitButton from './internal';
import { getBaseProps } from '../internal/base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import useBaseComponent from '../internal/hooks/use-base-component';

export { SplitButtonProps };

const SplitButton = React.forwardRef(
  (
    {
      items,
      variant = 'normal',
      loading = false,
      loadingText,
      disabled = false,
      expandableGroups = false,
      expandToViewport = false,
      ariaLabel,
      children,
      onItemClick,
      onItemFollow,
      ...props
    }: SplitButtonProps,
    ref: React.Ref<SplitButtonProps.Ref>
  ) => {
    const baseComponentProps = useBaseComponent('SplitButton');
    const baseProps = getBaseProps(props);
    return (
      <InternalSplitButton
        {...baseProps}
        {...baseComponentProps}
        ref={ref}
        items={items}
        variant={variant}
        loading={loading}
        loadingText={loadingText}
        disabled={disabled}
        expandableGroups={expandableGroups}
        expandToViewport={expandToViewport}
        ariaLabel={ariaLabel}
        onItemClick={onItemClick}
        onItemFollow={onItemFollow}
      >
        {children}
      </InternalSplitButton>
    );
  }
);

applyDisplayName(SplitButton, 'SplitButton');
export default SplitButton;
