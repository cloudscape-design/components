// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import FormField from '~components/form-field';
import { InternalControlGroupProps } from '~components/internal/components/control-group';
import { MultiselectProps } from '~components/multiselect';
import RadioGroup from '~components/radio-group';
import { SelectProps } from '~components/select';

import { useAppContext } from '../app/app-context';

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

export type Direction = NonNullable<InternalControlGroupProps['direction']>;

export function useControlGroupDirection() {
  const { urlParams, setUrlParams } = useAppContext<'controlGroupDirection'>(); // The name `direction` is already taken for the LTR/RTL URL parameter
  const direction: Direction = urlParams.controlGroupDirection === 'vertical' ? 'vertical' : 'horizontal';
  const setDirection = (value: Direction) => setUrlParams({ controlGroupDirection: value });
  return { direction, setDirection };
}

export function DirectionSettings({
  direction,
  setDirection,
}: {
  direction: Direction;
  setDirection: (value: Direction) => void;
}) {
  return (
    <FormField label="Direction">
      <RadioGroup
        value={direction}
        onChange={({ detail }) => setDirection(detail.value as Direction)}
        items={[
          { value: 'horizontal', label: 'Horizontal' },
          { value: 'vertical', label: 'Vertical' },
        ]}
      />
    </FormField>
  );
}
