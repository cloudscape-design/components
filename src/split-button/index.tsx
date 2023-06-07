// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { SplitButtonProps } from './interfaces';
import InternalSplitButton from './internal';
import { getBaseProps } from '../internal/base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import useBaseComponent from '../internal/hooks/use-base-component';

export { SplitButtonProps };

const SplitButton = ({ children, ...props }: SplitButtonProps) => {
  const baseComponentProps = useBaseComponent('SplitButton');
  const baseProps = getBaseProps(props);
  return (
    <InternalSplitButton {...baseProps} {...baseComponentProps}>
      {children}
    </InternalSplitButton>
  );
};

applyDisplayName(SplitButton, 'SplitButton');
export default SplitButton;
