// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { CheckboxProps } from './interfaces';
import InternalCheckbox from './internal';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import useBaseComponent from '../internal/hooks/use-base-component';

export { CheckboxProps };

const Checkbox = React.forwardRef(({ ...props }: CheckboxProps, ref: React.Ref<CheckboxProps.Ref>) => {
  const baseComponentProps = useBaseComponent('Checkbox', { disabled: props.disabled, checked: props.checked });
  return <InternalCheckbox {...props} {...baseComponentProps} ref={ref} />;
});

applyDisplayName(Checkbox, 'Checkbox');
export default Checkbox;
