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
    { items, variant = 'normal', expandToViewport = false, expandableGroups = false, ...props }: SplitButtonProps,
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
        expandToViewport={expandToViewport}
        expandableGroups={expandableGroups}
      />
    );
  }
);

applyDisplayName(SplitButton, 'SplitButton');
export default SplitButton;
