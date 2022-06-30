// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { RadioGroupProps } from './interfaces';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import useBaseComponent from '../internal/hooks/use-base-component';
import InternalRadioGroup from './internal';

export { RadioGroupProps };

export default function RadioGroup(props: RadioGroupProps) {
  const baseComponentProps = useBaseComponent('RadioGroup');
  return <InternalRadioGroup {...props} {...baseComponentProps} />;
}

applyDisplayName(RadioGroup, 'RadioGroup');
