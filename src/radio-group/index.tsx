// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { RadioGroupProps } from './interfaces';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import useBaseComponent from '../internal/hooks/use-base-component';
import InternalRadioGroup from './internal';

export { RadioGroupProps };

const RadioGroup = React.forwardRef((props: RadioGroupProps, ref: React.Ref<RadioGroupProps.Ref>) => {
  const baseComponentProps = useBaseComponent('RadioGroup', { value: props.value, items: props.items });
  return <InternalRadioGroup ref={ref} {...props} {...baseComponentProps} />;
});

applyDisplayName(RadioGroup, 'RadioGroup');
export default RadioGroup;
