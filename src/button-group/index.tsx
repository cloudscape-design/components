// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { getExternalProps } from '../internal/utils/external-props';
import useBaseComponent from '../internal/hooks/use-base-component';
import { ButtonGroupProps } from './interfaces';
import InternalButtonGroup from './internal';
import { getBaseProps } from '../internal/base-component';

export { ButtonGroupProps };

const ButtonGroup = React.forwardRef(
  ({ variant, dropdownExpandToViewport, ...rest }: ButtonGroupProps, ref: React.Ref<ButtonGroupProps.Ref>) => {
    const baseProps = getBaseProps(rest);
    const baseComponentProps = useBaseComponent('ButtonGroup', {
      props: {
        variant,
        dropdownExpandToViewport,
      },
    });

    const externalProps = getExternalProps(rest);
    return (
      <InternalButtonGroup
        {...baseProps}
        {...baseComponentProps}
        {...externalProps}
        ref={ref}
        variant={variant}
        dropdownExpandToViewport={dropdownExpandToViewport}
      />
    );
  }
);

applyDisplayName(ButtonGroup, 'ButtonGroup');
export default ButtonGroup;
