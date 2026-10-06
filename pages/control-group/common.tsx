// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { MultiselectProps } from '~components/multiselect';
import { SelectProps } from '~components/select';

export const noop = () => {
  /* empty handler to suppress controlled-component warnings */
};

export const operators: SelectProps.Option[] = [
  { value: '=', label: '=' },
  { value: '!=', label: '!=' },
];

export const multiOptions: MultiselectProps.Option[] = [
  { value: '1', label: 'Option 1' },
  { value: '2', label: 'Option 2' },
];

export const enteredTextLabel = (value: string) => `Use: ${value}`;
