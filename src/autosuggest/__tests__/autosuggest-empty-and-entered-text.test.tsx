// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { render } from '@testing-library/react';

import Autosuggest from '../../../lib/components/autosuggest';
import createWrapper, { AutosuggestWrapper } from '../../../lib/components/test-utils/dom';

interface DemoProps {
  hideEnteredText: boolean;
  hasEmpty: boolean;
  hasOptions: boolean;
}

function renderAutosuggest(jsx: React.ReactElement) {
  const { container, rerender } = render(jsx);
  const wrapper = createWrapper(container).findAutosuggest()!;
  return { container, wrapper, rerender };
}

const NOT_AN_OPTION = 'anything';
const EMPTY_LABEL = 'Nothing found';
const OPTIONS_VALUES = ['apple', 'banana', 'orange'];

function Demo(props: DemoProps) {
  const enteredTextLabel = (value: string) => `Use: ${value}`;
  const empty = <span>{EMPTY_LABEL}</span>;
  const [pendingValue, setPendingValue] = useState('');
  return (
    <Autosuggest
      value={pendingValue}
      options={props.hasOptions ? OPTIONS_VALUES.map(option => ({ value: option })) : undefined}
      enteredTextLabel={enteredTextLabel}
      hideEnteredTextLabel={props.hideEnteredText}
      ariaLabel="Multi-suggest"
      selectedAriaLabel="Selected"
      empty={props.hasEmpty ? empty : undefined}
      onChange={event => setPendingValue(event.detail.value)}
    />
  );
}

function expectToHaveEmptyLabel(wrapper: AutosuggestWrapper) {
  expect(wrapper.findDropdown()).not.toBe(null);
  expect(wrapper.findDropdown().getElement()).toHaveTextContent(EMPTY_LABEL);
}

test('Hide entered text label, no empty label, and no options', () => {
  const { wrapper } = renderAutosuggest(<Demo hideEnteredText={true} hasEmpty={false} hasOptions={false} />);
  wrapper.focus();
  expect(wrapper.findDropdown().findOpenDropdown()).toBe(null);
});

test('Hide entered text label, no empty label, and include options', () => {
  const { wrapper } = renderAutosuggest(<Demo hideEnteredText={true} hasEmpty={false} hasOptions={true} />);
  wrapper.focus();
  expect(wrapper.findDropdown().findOpenDropdown()).not.toBe(null);

  wrapper.setInputValue(OPTIONS_VALUES[0]);
  wrapper.focus();
  expect(wrapper.findEnteredTextOption()).toBe(null);

  wrapper.setInputValue(NOT_AN_OPTION);
  wrapper.focus();
  expect(wrapper.findEnteredTextOption()).toBe(null);
});

test('Hide entered text label, show empty label, and no options', () => {
  const { wrapper } = renderAutosuggest(<Demo hideEnteredText={true} hasEmpty={true} hasOptions={false} />);
  wrapper.focus();
  expect(wrapper.findDropdown().findOpenDropdown()).not.toBe(null);

  wrapper.setInputValue(NOT_AN_OPTION);
  wrapper.focus();
  expect(wrapper.findEnteredTextOption()).toBe(null);
  expectToHaveEmptyLabel(wrapper);
});

test('Hide entered text label, show empty label, and include options', () => {
  const { wrapper } = renderAutosuggest(<Demo hideEnteredText={true} hasEmpty={true} hasOptions={true} />);
  wrapper.focus();
  expect(wrapper.findDropdown().findOpenDropdown()).not.toBe(null);

  wrapper.setInputValue(OPTIONS_VALUES[0]);
  wrapper.focus();
  expect(wrapper.findEnteredTextOption()).toBe(null);
  expect(wrapper.findDropdown().findOptionByValue(OPTIONS_VALUES[0])!.getElement()).not.toBe(null);

  wrapper.setInputValue(NOT_AN_OPTION);
  wrapper.focus();
  expect(wrapper.findEnteredTextOption()).toBe(null);
  expectToHaveEmptyLabel(wrapper);
});

test('Show entered text label, no empty label, and no options', () => {
  const { wrapper } = renderAutosuggest(<Demo hideEnteredText={false} hasEmpty={false} hasOptions={false} />);
  wrapper.focus();
  expect(wrapper.findDropdown().findOpenDropdown()).toBe(null);

  wrapper.setInputValue(NOT_AN_OPTION);
  wrapper.focus();
  expect(wrapper.findEnteredTextOption()).not.toBe(null);
});

test('Show entered text label, no empty label, and include options', () => {
  const { wrapper } = renderAutosuggest(<Demo hideEnteredText={false} hasEmpty={false} hasOptions={true} />);
  wrapper.focus();
  expect(wrapper.findDropdown().findOpenDropdown()).not.toBe(null);

  wrapper.setInputValue(NOT_AN_OPTION);
  wrapper.focus();
  expect(wrapper.findEnteredTextOption()).not.toBe(null);
});

test('Show entered text label, show empty label, and no options', () => {
  const { wrapper } = renderAutosuggest(<Demo hideEnteredText={false} hasEmpty={true} hasOptions={false} />);
  wrapper.focus();
  expect(wrapper.findDropdown().findOpenDropdown()).not.toBe(null);

  wrapper.setInputValue(NOT_AN_OPTION);
  wrapper.focus();
  expect(wrapper.findEnteredTextOption()).not.toBe(null);
});

test('Show entered text label, show empty label, and include options', () => {
  const { wrapper } = renderAutosuggest(<Demo hideEnteredText={false} hasEmpty={true} hasOptions={true} />);
  wrapper.focus();
  expect(wrapper.findDropdown().findOpenDropdown()).not.toBe(null);

  wrapper.setInputValue(NOT_AN_OPTION);
  wrapper.focus();
  expect(wrapper.findEnteredTextOption()).not.toBe(null);
});
