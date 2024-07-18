// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import InternalInput, { InternalInputProps } from '../../input/internal';
import { useFormFieldContext } from '../../internal/context/form-field-context';

export const SearchInput = React.forwardRef((props: InternalInputProps, ref: React.Ref<HTMLInputElement>) => {
  const formFieldContext = useFormFieldContext(props);
  return <InternalInput type="search" {...props} {...formFieldContext} ref={ref} />;
});
