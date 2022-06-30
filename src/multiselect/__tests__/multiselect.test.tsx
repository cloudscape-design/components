// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';
import createWrapper from '../../../lib/components/test-utils/dom';
import Multiselect, { MultiselectProps } from '../../../lib/components/multiselect';
import tokenGroupStyles from '../../../lib/components/token-group/styles.css.js';
import selectPartsStyles from '../../../lib/components/select/parts/styles.css.js';
import { expectNoAxeViolations } from '../../__a11y__/axe';

const defaultOptions: MultiselectProps.Options = [
  { label: 'First', value: '1' },
  { label: 'Second', value: '2' },
  { label: 'Third', value: '3' },
  { label: 'Fourth', value: '4' },
];
const groupOptions: MultiselectProps.Options = [
  {
    label: 'First category',
    value: 'group',
    options: [
      { label: 'First', value: '1' },
      { label: 'Second', value: '2' },
      { label: 'Third', value: '3' },
      { label: 'Fourth', value: '4' },
    ],
  },
  { label: 'Fifth', value: '5' },
  {
    label: 'Second category',
    value: 'group2',
    options: [
      { label: 'sixth', value: '6' },
      { label: 'seventh', value: '7', disabled: true },
    ],
  },
];
function renderMultiselect(jsx: React.ReactElement) {
  const { container, rerender } = render(jsx);
  const wrapper = createWrapper(container).findMultiselect()!;
  const expectTokensToHaveText = (expected: string[]) => {
    const tokens = wrapper.findTokens();
    expect(tokens).toHaveLength(expected.length);
    tokens.forEach((token, index) => {
      expect(token.getElement()).toHaveTextContent(expected[index]);
    });
  };
  return { container, wrapper, rerender, expectTokensToHaveText };
}

test('opens and closes dropdown', () => {
  const { wrapper } = renderMultiselect(<Multiselect selectedOptions={[]} options={defaultOptions} />);
  wrapper.openDropdown();
  expect(wrapper.findDropdown().findOptionByValue('1')).toBeTruthy();
  wrapper.closeDropdown();
  expect(wrapper.findDropdown().findOptionByValue('1')).toBeFalsy();
});

test('keeps dropdown open after selecting an item by default', () => {
  const { wrapper } = renderMultiselect(<Multiselect selectedOptions={[]} options={defaultOptions} />);
  wrapper.openDropdown();
  wrapper.selectOptionByValue('2');
  expect(wrapper.findDropdown().findOptionByValue('2')).toBeTruthy();
});

test('closes dropdown after selecting an option when keepOpen=false', () => {
  const { wrapper } = renderMultiselect(<Multiselect selectedOptions={[]} options={defaultOptions} keepOpen={false} />);
  wrapper.openDropdown();
  wrapper.selectOptionByValue('2');
  expect(wrapper.findDropdown().findOptionByValue('2')).toBeFalsy();
});

test('does not open dropdown when disabled', () => {
  const { wrapper } = renderMultiselect(<Multiselect selectedOptions={[]} options={defaultOptions} disabled={true} />);
  expect(wrapper.isDisabled()).toEqual(true);
  wrapper.openDropdown();
  expect(wrapper.findDropdown().findOpenDropdown()).toEqual(null);
});

test('filtering state stays unchanged when an item is selected', () => {
  const FILTER_VALUE = 'Second';
  const { wrapper } = renderMultiselect(
    <Multiselect selectedOptions={[]} options={defaultOptions} filteringType="auto" />
  );
  wrapper.openDropdown();
  wrapper.findFilteringInput()!.setInputValue(FILTER_VALUE);
  wrapper.selectOption(1);
  expect(wrapper.findDropdown().findOptions()).toHaveLength(1);
  expect(wrapper.findFilteringInput()!.findNativeInput().getElement()).toHaveValue(FILTER_VALUE);
});

test('sets proper filtering text for the onLoadItems event', async () => {
  const onLoadItemsSpy = jest.fn();
  const testValue = 'Some input value';
  const { wrapper } = renderMultiselect(
    <Multiselect
      selectedOptions={[]}
      filteringType="auto"
      options={defaultOptions}
      onLoadItems={event => onLoadItemsSpy(event.detail)}
    />
  );
  wrapper.openDropdown();
  expect(onLoadItemsSpy).toHaveBeenCalledWith({ filteringText: '', firstPage: true, samePage: false });
  onLoadItemsSpy.mockReset();

  wrapper.findFilteringInput()!.setInputValue(testValue);
  await new Promise(resolve => setTimeout(resolve, 300));

  expect(onLoadItemsSpy).toHaveBeenCalledWith({ filteringText: testValue, firstPage: true, samePage: false });
  expect(wrapper.findFilteringInput()!.findNativeInput().getElement()).toHaveValue(testValue);
});

test('renders selected options', () => {
  const { expectTokensToHaveText } = renderMultiselect(
    <Multiselect selectedOptions={[{ label: 'First', value: '1' }]} options={defaultOptions} />
  );
  expectTokensToHaveText(['First']);
});

test('does not render tokens when no tokens are present', () => {
  const { wrapper } = renderMultiselect(<Multiselect selectedOptions={[]} options={defaultOptions} />);
  expect(wrapper.findTokens()).toHaveLength(0);
});

test('allows deselecting an option without object equality', () => {
  const onChange = jest.fn();
  const { wrapper } = renderMultiselect(
    <Multiselect selectedOptions={[{ label: 'First', value: '1' }]} options={defaultOptions} onChange={onChange} />
  );
  wrapper.openDropdown();
  wrapper.selectOption(1);
  expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ detail: { selectedOptions: [] } }));
});

test('allows deselecting options programmatically via empty array', () => {
  const { rerender, wrapper } = renderMultiselect(
    <Multiselect selectedOptions={[{ label: 'First', value: '1' }]} options={defaultOptions} />
  );
  rerender(<Multiselect selectedOptions={[]} options={defaultOptions} />);
  expect(wrapper.findByClassName(tokenGroupStyles.root)).toBeNull();
});

test('allows deselecting options programmatically via undefined', () => {
  const { rerender, wrapper } = renderMultiselect(
    <Multiselect selectedOptions={[{ label: 'First', value: '1' }]} options={defaultOptions} />
  );
  rerender(<Multiselect selectedOptions={[]} options={defaultOptions} />);
  expect(wrapper.findByClassName(tokenGroupStyles.root)).toBeNull();
});

test('fires change event when user selects an option', () => {
  const onChange = jest.fn();
  const { wrapper } = renderMultiselect(
    <Multiselect selectedOptions={[]} options={defaultOptions} onChange={onChange} />
  );
  wrapper.openDropdown();
  wrapper.selectOption(1);
  expect(onChange).toHaveBeenCalledWith(
    expect.objectContaining({
      detail: {
        selectedOptions: [{ label: 'First', value: '1' }],
      },
    })
  );
});

test('fires a change event when user selects option and there were other options selected', () => {
  const onChange = jest.fn();
  const { wrapper } = renderMultiselect(
    <Multiselect selectedOptions={[{ label: 'Second', value: '2' }]} options={defaultOptions} onChange={onChange} />
  );
  wrapper.openDropdown();
  wrapper.selectOption(1);
  expect(onChange).toHaveBeenCalledWith(
    expect.objectContaining({
      detail: {
        selectedOptions: [
          { label: 'Second', value: '2' },
          { label: 'First', value: '1' },
        ],
      },
    })
  );
});

test('fires a change event when user deselects an option from the dropdown', () => {
  const onChange = jest.fn();
  const { wrapper } = renderMultiselect(
    <Multiselect selectedOptions={defaultOptions.slice(0, 2)} options={defaultOptions} onChange={onChange} />
  );
  wrapper.openDropdown();
  wrapper.selectOption(1);
  expect(onChange).toHaveBeenCalledWith(
    expect.objectContaining({
      detail: {
        selectedOptions: [{ label: 'Second', value: '2' }],
      },
    })
  );
});

test('fires a change event when user dismisses an option from the token list', () => {
  const onChange = jest.fn();
  const { wrapper } = renderMultiselect(
    <Multiselect selectedOptions={defaultOptions.slice(0, 2)} options={defaultOptions} onChange={onChange} />
  );
  wrapper.openDropdown();
  wrapper.findToken(1)!.findDismiss().click();
  expect(onChange).toHaveBeenCalledWith(
    expect.objectContaining({
      detail: {
        selectedOptions: [{ label: 'Second', value: '2' }],
      },
    })
  );
});

test('can hide tokens completely', () => {
  const { wrapper } = renderMultiselect(
    <Multiselect selectedOptions={[{ label: 'First', value: '1' }]} options={defaultOptions} hideTokens={true} />
  );
  expect(wrapper.findByClassName(tokenGroupStyles.root)).toBeNull();
});

test('disables tokens when multiselect is disabled', () => {
  const { wrapper } = renderMultiselect(
    <Multiselect selectedOptions={[{ label: 'First', value: '1' }]} options={defaultOptions} disabled={true} />
  );

  expect(wrapper.findTokens()[0].getElement()).toHaveClass(tokenGroupStyles['token-disabled']);
});

test('does not render token group when no tokens are present', () => {
  const { wrapper } = renderMultiselect(<Multiselect selectedOptions={[]} options={defaultOptions} />);

  expect(wrapper.findByClassName(tokenGroupStyles.root)).toBeNull();
});

describe('Dropdown states', () => {
  [
    ['loading', true],
    ['error', true],
    ['finished', false],
  ].forEach(([statusType, isSticky]) => {
    test(`should display ${statusType} status text as ${isSticky ? 'sticky' : 'non-sticky'} footer`, () => {
      const statusText = { [`${statusType}Text`]: `Test ${statusType} text` };
      const { wrapper } = renderMultiselect(
        <Multiselect selectedOptions={[]} options={defaultOptions} statusType={statusType as any} {...statusText} />
      );
      wrapper.openDropdown();
      const statusIndicator = wrapper.findStatusIndicator()!;
      expect(statusIndicator.getElement()).toHaveTextContent(`Test ${statusType} text`);
      const dropdown = wrapper.findDropdown()!.findOpenDropdown()!;
      expect(Boolean(dropdown.findByClassName(selectPartsStyles['list-bottom']))).toBe(!isSticky);
    });

    test(`check a11y for ${statusType} and ${isSticky ? 'sticky' : 'non-sticky'} footer`, async () => {
      const statusText = { [`${statusType}Text`]: `Test ${statusType} text` };
      const { container, wrapper } = renderMultiselect(
        <Multiselect
          selectedOptions={[]}
          options={defaultOptions}
          statusType={statusType as any}
          ariaLabel="input"
          {...statusText}
        />
      );
      wrapper.openDropdown();

      await expectNoAxeViolations(container);
    });
  });
});

test('fires a change event when user selects a group option from the dropdown', () => {
  const onChange = jest.fn();
  const { wrapper } = renderMultiselect(
    <Multiselect selectedOptions={[]} options={groupOptions} onChange={onChange} />
  );
  wrapper.openDropdown();
  wrapper.selectOptionByValue('group');
  expect(onChange).toHaveBeenCalledWith(
    expect.objectContaining({
      detail: {
        selectedOptions: [
          { label: 'First', value: '1' },
          { label: 'Second', value: '2' },
          { label: 'Third', value: '3' },
          { label: 'Fourth', value: '4' },
        ],
      },
    })
  );
});

test('deselects all options when a user clicks on a selected group option from the dropdown', () => {
  const onChange = jest.fn();
  const { wrapper } = renderMultiselect(
    <Multiselect
      selectedOptions={[
        { label: 'First', value: '1' },
        { label: 'Second', value: '2' },
        { label: 'Third', value: '3' },
        { label: 'Fourth', value: '4' },
      ]}
      options={groupOptions}
      onChange={onChange}
    />
  );
  wrapper.openDropdown();
  wrapper.selectOptionByValue('group');
  expect(onChange).toHaveBeenCalledWith(
    expect.objectContaining({
      detail: {
        selectedOptions: [],
      },
    })
  );
});
test('fires a change event when user selects group option and there were other options selected', () => {
  const onChange = jest.fn();
  const { wrapper } = renderMultiselect(
    <Multiselect selectedOptions={[{ label: 'Fifth', value: '5' }]} options={groupOptions} onChange={onChange} />
  );
  wrapper.openDropdown();
  wrapper.selectOptionByValue('group');
  expect(onChange).toHaveBeenCalledWith(
    expect.objectContaining({
      detail: {
        selectedOptions: [
          { label: 'Fifth', value: '5' },
          { label: 'First', value: '1' },
          { label: 'Second', value: '2' },
          { label: 'Third', value: '3' },
          { label: 'Fourth', value: '4' },
        ],
      },
    })
  );
});

test('deselecting a group option does not remove other selected options', () => {
  const onChange = jest.fn();
  const { wrapper } = renderMultiselect(
    <Multiselect
      selectedOptions={[
        { label: 'First', value: '1' },
        { label: 'Second', value: '2' },
        { label: 'Third', value: '3' },
        { label: 'Fourth', value: '4' },
        { label: 'Fifth', value: '5' },
      ]}
      options={groupOptions}
      onChange={onChange}
    />
  );
  wrapper.openDropdown();
  wrapper.selectOptionByValue('group');
  expect(onChange).toHaveBeenCalledWith(
    expect.objectContaining({
      detail: {
        selectedOptions: [{ label: 'Fifth', value: '5' }],
      },
    })
  );
});
test('group selection allows only the selection of enabled options', () => {
  const onChange = jest.fn();
  const { wrapper } = renderMultiselect(
    <Multiselect selectedOptions={[]} options={groupOptions} onChange={onChange} />
  );
  wrapper.openDropdown();
  wrapper.selectOptionByValue('group2');
  expect(onChange).toHaveBeenCalledWith(
    expect.objectContaining({
      detail: {
        selectedOptions: [{ label: 'sixth', value: '6' }],
      },
    })
  );
});
test('keeps dropdown open after selecting a group option by default', () => {
  const { wrapper } = renderMultiselect(<Multiselect selectedOptions={[]} options={groupOptions} />);
  wrapper.openDropdown();
  wrapper.selectOptionByValue('group');
  expect(wrapper.findDropdown().findOptionByValue('group')).toBeTruthy();
});

test('closes dropdown after selecting a group option when keepOpen=false', () => {
  const { wrapper } = renderMultiselect(<Multiselect selectedOptions={[]} options={groupOptions} keepOpen={false} />);
  wrapper.openDropdown();
  wrapper.selectOptionByValue('group');
  expect(wrapper.findDropdown().findOptionByValue('group')).toBeFalsy();
});
