// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useContext } from 'react';

import { FormFieldContext } from '../contexts/form-field-context';

export const useFormFieldContext = () => {
  const formFieldContext = useContext(FormFieldContext);
  return formFieldContext;
};
