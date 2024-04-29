// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { render } from '@testing-library/react';
import * as React from 'react';
import Autosuggest from '../../../lib/components/autosuggest';
import Input from '../../../lib/components/input';
import DatePicker from '../../../lib/components/date-picker';
import PropertyFilter from '../../../lib/components/property-filter';
import TextFilter from '../../../lib/components/text-filter';
import TimeInput from '../../../lib/components/time-input';
import createWrapper from '../../../lib/components/test-utils/dom';
import BaseInputWrapper from '../../../lib/components/test-utils/dom/input/base-input';

function renderInputs(jsx: React.ReactElement) {
  const { container } = render(jsx);
  return createWrapper(container);
}

const defaults = {
  autosuggest: {
    value: '',
    onChange: () => {},
    enteredTextLabel: () => '',
  },
  datePicker: {
    nextMonthAriaLabel: '',
    previousMonthAriaLabel: '',
    todayAriaLabel: '',
    value: '',
    onChange: () => {},
  },
  propertyFilter: {
    i18nStrings: {
      allPropertiesLabel: '',
      filteringAriaLabel: '',
      dismissAriaLabel: '',
      groupValuesText: '',
      groupPropertiesText: '',
      operatorsText: '',
      operationAndText: '',
      operationOrText: '',
      operatorLessText: '',
      operatorLessOrEqualText: '',
      operatorGreaterText: '',
      operatorGreaterOrEqualText: '',
      operatorContainsText: '',
      operatorDoesNotContainText: '',
      operatorEqualsText: '',
      operatorDoesNotEqualText: '',
      editTokenHeader: '',
      propertyText: '',
      operatorText: '',
      valueText: '',
      cancelActionText: '',
      applyActionText: '',
      clearFiltersText: '',
      removeTokenButtonAriaLabel: () => '',
      enteredTextLabel: () => '',
    },
    query: { tokens: [], operation: 'and' },
    filteringProperties: [],
    onChange: () => {},
  },
} as const;

// element.querySelector returns the first matching element, so we place extra decoy elements above to ensure
// that we are receiving the correct match
function Decoy({ skip }: { skip: string }) {
  return (
    <>
      {skip !== 'autosuggest' && <Autosuggest {...defaults.autosuggest} />}
      {skip !== 'input' && <Input value="" onChange={() => {}} />}
      {skip !== 'date-picker' && <DatePicker {...defaults.datePicker} />}
      {skip !== 'text-filter' && <TextFilter filteringText="" onChange={() => {}} />}
      {skip !== 'time-input' && <TimeInput value="" onChange={() => {}} />}
    </>
  );
}

test('finds autosuggest among other input-like components', () => {
  const wrapper = renderInputs(
    <>
      <Decoy skip="autosuggest" />
      <Autosuggest {...defaults.autosuggest} value="autosuggest" />
    </>
  );
  expect(wrapper.findAutosuggest()!.findNativeInput().getElement()).toHaveValue('autosuggest');
});

test('finds input among other input-like components', () => {
  const wrapper = renderInputs(
    <>
      <Decoy skip="input" />
      <Input value="input" onChange={() => {}} />
    </>
  );
  expect(wrapper.findInput()!.findNativeInput().getElement()).toHaveValue('input');
});

test('finds date-picker among other input-like components', () => {
  const wrapper = renderInputs(
    <>
      <Decoy skip="date-picker" />
      <DatePicker {...defaults.datePicker} value="2021-10-07" onChange={() => {}} />
    </>
  );
  expect(wrapper.findDatePicker()!.findNativeInput().getElement()).toHaveValue('2021/10/07');
});

test('finds text-filter among other input-like components', () => {
  const wrapper = renderInputs(
    <>
      <Decoy skip="text-filter" />
      <TextFilter filteringText="text-filter" />
    </>
  );
  expect(wrapper.findTextFilter()!.findInput().findNativeInput().getElement()).toHaveValue('text-filter');
});

test('finds time-input among other input-like components', () => {
  const wrapper = renderInputs(
    <>
      <Decoy skip="time-input" />
      <TimeInput value="04:20:00" />
    </>
  );
  expect(wrapper.findTimeInput()!.findNativeInput().getElement()).toHaveValue('04:20:00');
});

describe.each<
  [
    name: string,
    getComponent: (disabled: boolean) => React.ReactElement,
    getWrapper: (container: HTMLElement) => BaseInputWrapper,
  ]
>([
  [
    'autosuggest',
    disabled => <Autosuggest {...defaults.autosuggest} disabled={disabled} />,
    container => createWrapper(container).findAutosuggest()!,
  ],
  [
    'date-picker',
    disabled => <DatePicker {...defaults.datePicker} disabled={disabled} />,
    container => createWrapper(container).findDatePicker()!,
  ],
  [
    'input',
    disabled => <Input value="" onChange={() => {}} disabled={disabled} />,
    container => createWrapper(container).findInput()!,
  ],
  [
    'property-filter',
    disabled => <PropertyFilter {...defaults.propertyFilter} disabled={disabled} />,
    container => createWrapper(container).findPropertyFilter()!,
  ],
  [
    'time-input',
    disabled => <TimeInput value="" disabled={disabled} />,
    container => createWrapper(container).findTimeInput()!,
  ],
])('Base functionality support on %s', (name, getComponent, getWrapper) => {
  test(`supports isDisabled test-util`, () => {
    const { container, rerender } = render(getComponent(false));
    const wrapper = getWrapper(container);
    expect(wrapper.isDisabled()).toBe(false);
    rerender(getComponent(true));
    expect(wrapper.isDisabled()).toBe(true);
  });
});
