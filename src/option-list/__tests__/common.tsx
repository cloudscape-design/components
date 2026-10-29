// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { fireEvent, render } from '@testing-library/react';

import OptionList, { OptionListProps } from '../../../lib/components/option-list';
import createWrapper from '../../../lib/components/test-utils/dom';

export const options: OptionListProps.Option[] = [
  { value: 'a', label: 'First', description: 'First description' },
  { value: 'b', label: 'Second' },
  { value: 'c', label: 'Third' },
];

export const withDisabled: OptionListProps.Options = [
  options[0],
  { ...options[1], disabled: true, disabledReason: 'Not available in this Region' },
  options[2],
];

export const groupedOptions: OptionListProps.Options = [
  {
    value: 'compute',
    label: 'Compute',
    options: [
      { value: 'ec2', label: 'EC2' },
      { value: 'lambda', label: 'Lambda' },
    ],
  },
  {
    value: 'storage',
    label: 'Storage',
    options: [
      { value: 's3', label: 'S3' },
      { value: 'efs', label: 'EFS', disabled: true },
    ],
  },
];

const leafOptions = (source: OptionListProps.Options) =>
  source.flatMap(option => (option as OptionListProps.OptionGroup).options ?? [option]);

const byValue = (values: string[], source: OptionListProps.Options) =>
  values.map(value => leafOptions(source).find(option => option.value === value)!);

export type StatefulProps = Partial<Omit<OptionListProps, 'onChange'>> & {
  initialSelected?: string[];
  onChange?: jest.Mock;
};

// Controlled OptionList that keeps its selection in state and reports the selected values to `onChange`.
export function Stateful({ initialSelected = [], onChange, ...props }: StatefulProps) {
  const [selectedOptions, setSelectedOptions] = useState<ReadonlyArray<OptionListProps.Option>>(
    byValue(initialSelected, props.options ?? options)
  );
  return (
    <OptionList
      ariaLabel="Goals"
      options={options}
      selectionType="single"
      {...props}
      selectedOptions={selectedOptions}
      onChange={event => {
        onChange?.(event.detail.selectedOptions.map(option => option.value));
        setSelectedOptions(event.detail.selectedOptions);
      }}
    />
  );
}

export function renderOptionList(jsx: React.ReactElement) {
  const { container, rerender } = render(jsx);
  const wrapper = createWrapper(container).findOptionList()!;
  // There is no test-utils finder for the listbox element, which receives focus and keyboard events.
  const listbox = wrapper.find('[role="listbox"]')!.getElement();
  return { container, rerender, wrapper, listbox };
}

export type Wrapper = ReturnType<typeof renderOptionList>['wrapper'];

export const clickOption = (wrapper: Wrapper, index: number) =>
  fireEvent.mouseUp(wrapper.findOptionByIndex(index)!.getElement());

export const pressKey = (listbox: HTMLElement, keyCode: number) => fireEvent.keyDown(listbox, { keyCode });

export const selectedLabels = (wrapper: Wrapper) =>
  wrapper.findSelectedOptions().map(option => option.findLabel()!.getElement().textContent);

export const highlightedValue = (wrapper: Wrapper) => wrapper.findHighlightedOption()?.getElement().dataset.value;
