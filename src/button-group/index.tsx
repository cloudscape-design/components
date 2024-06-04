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

const ButtonGroup = React.forwardRef((props: ButtonGroupProps, ref: React.Ref<ButtonGroupProps.Ref>) => {
  const baseProps = getBaseProps(props);
  const baseComponentProps = useBaseComponent('ButtonGroup');
  const filteredProps = getExternalProps(props);
  return <InternalButtonGroup {...baseProps} {...baseComponentProps} {...filteredProps} ref={ref} />;
});

applyDisplayName(ButtonGroup, 'ButtonGroup');
export default ButtonGroup;
