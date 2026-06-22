// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { createContext, useContext } from 'react';

import { FormFieldValidationControlProps } from '../../types/form-field';

export const FormFieldContext = createContext<FormFieldValidationControlProps>({});

function applyDefault<T>(fields: T, defaults: T, keys: (keyof T)[]) {
  const result = <T>{};
  keys.forEach(key => {
    result[key] = fields[key] === undefined ? defaults[key] : fields[key];
  });
  return result;
}

export function useFormFieldContext(props: FormFieldValidationControlProps) {
  const context = useContext(FormFieldContext);
  return applyDefault(props, context, ['invalid', 'warning', 'controlId', 'ariaLabelledby', 'ariaDescribedby']);
}

// Backward-compatibility re-export for consumers importing this public type from the internal path.
export type {
  FormFieldCommonValidationControlProps,
  FormFieldControlProps,
  FormFieldValidationControlProps,
} from '../../types/form-field';
