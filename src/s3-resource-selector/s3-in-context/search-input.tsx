// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { useFormFieldContext } from '../../internal/context/form-field-context';
import InternalInput, { InternalInputProps } from '../../input/internal';

export const SearchInput = React.forwardRef((props: InternalInputProps, ref: React.Ref<HTMLInputElement>) => {
  const formFieldContext = useFormFieldContext(props);
  return <InternalInput type="search" {...props} {...formFieldContext} ref={ref} />;
});
