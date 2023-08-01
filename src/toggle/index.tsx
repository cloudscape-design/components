// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import useBaseComponent from '../internal/hooks/use-base-component';
import { ToggleProps } from './interfaces';
import InternalToggle from './internal';

export { ToggleProps };

const Toggle = React.forwardRef<ToggleProps.Ref, ToggleProps>((props, ref) => {
  const baseComponentProps = useBaseComponent('Toggle', { disabled: props.disabled, checked: props.checked });
  return <InternalToggle {...props} {...baseComponentProps} ref={ref} />;
});

applyDisplayName(Toggle, 'Toggle');
export default Toggle;
