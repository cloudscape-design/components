// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { BaseInputProps, InputProps } from '../input/interfaces';
import { BaseComponentProps } from '../internal/base-component';
import { FormFieldValidationControlProps } from '../internal/context/form-field-context';

export interface DateInputProps extends BaseInputProps, FormFieldValidationControlProps, BaseComponentProps {}

export namespace DateInputProps {
  export type Ref = InputProps.Ref;
}
