// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { FormProps } from './interfaces';
import InternalForm from './internal';
import useBaseComponent from '../internal/hooks/use-base-component';

export { FormProps };

export default function Form(props: FormProps) {
  const baseComponentProps = useBaseComponent('Form');
  return <InternalForm {...props} {...baseComponentProps} />;
}

applyDisplayName(Form, 'Form');
