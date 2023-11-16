// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';
import createWrapper from '../../../lib/components/test-utils/dom';
import Multiselect, { MultiselectProps } from '../../../lib/components/multiselect';
import tokenGroupStyles from '../../../lib/components/token-group/styles.css.js';
import selectPartsStyles from '../../../lib/components/select/parts/styles.css.js';
import '../../__a11y__/to-validate-a11y';
import statusIconStyles from '../../../lib/components/status-indicator/styles.selectors.js';
import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

const defaultOptions: MultiselectProps.Options = [
  { label: 'First', value: '1' },
  { label: 'Second', value: '2' },
  { label: 'Third', value: '3', lang: 'es' },
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

jest.mock('@cloudscape-design/component-toolkit/internal', () => {
  const originalModule = jest.requireActual('@cloudscape-design/component-toolkit/internal');

  //just mock the `warnOnce` export
  return {
    __esModule: true,
    ...originalModule,
    warnOnce: jest.fn(),
  };
});
beforeEach(() => {
  (warnOnce as any).mockClear();
});

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

test('renders lang on options', () => {
  const { wrapper } = renderMultiselect(<Multiselect selectedOptions={[]} options={defaultOptions} />);
  wrapper.openDropdown();
  expect(wrapper.findDropdown()!.findOptionByValue('3')!.getElement()).toHaveAttribute('lang', 'es');
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

  expect(wrapper.findTokens()[0].getElement()).toHaveAttribute('aria-disabled', 'true');
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

    test(`should associate ${statusType} status text as ${
      isSticky ? 'sticky' : 'non-sticky'
    } footer to the dropdown element`, () => {
      const statusText = { [`${statusType}Text`]: `Test ${statusType} text` };
      const { wrapper } = renderMultiselect(
        <Multiselect selectedOptions={[]} options={defaultOptions} statusType={statusType as any} {...statusText} />
      );
      wrapper.openDropdown();
      expect(wrapper.findDropdown().find('ul')!.getElement()).toHaveAccessibleDescription(`Test ${statusType} text`);
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

      await expect(container).toValidateA11y();
    });
  });
  test('should display error status icon with provided aria label', () => {
    const { wrapper } = renderMultiselect(
      <Multiselect
        selectedOptions={[]}
        options={defaultOptions}
        statusType="error"
        errorText="Test error text"
        errorIconAriaLabel="Test error text"
      />
    );
    wrapper.openDropdown();

    const statusIcon = wrapper.findStatusIndicator()!.findByClassName(statusIconStyles.icon)!.getElement();
    expect(statusIcon).toHaveAttribute('aria-label', 'Test error text');
    expect(statusIcon).toHaveAttribute('role', 'img');
  });
  it('should warn if recoveryText is provided without associated handler', () => {
    renderMultiselect(
      <Multiselect
        selectedOptions={[]}
        options={defaultOptions}
        statusType="error"
        errorText="Test error text"
        errorIconAriaLabel="Test error text"
        recoveryText="Retry"
      />
    );
    expect(warnOnce).toHaveBeenCalledTimes(1);
    expect(warnOnce).toHaveBeenCalledWith(
      'Multiselect',
      '`onLoadItems` must be provided for `recoveryText` to be displayed.'
    );
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

test('Option should have aria-checked', () => {
  const { wrapper } = renderMultiselect(
    <Multiselect selectedOptions={[{ label: 'Second', value: '2' }]} options={groupOptions} />
  );
  wrapper.openDropdown();
  expect(wrapper.findDropdown()!.find('[data-mouse-target="0"]')!.getElement()).toHaveAttribute(
    'aria-checked',
    'mixed'
  );
  expect(wrapper.findDropdown()!.find('[data-mouse-target="1"]')!.getElement()).toHaveAttribute(
    'aria-checked',
    'false'
  );
  expect(wrapper.findDropdown()!.find('[data-mouse-target="2"]')!.getElement()).toHaveAttribute('aria-checked', 'true');
});

test('Trigger should have refer to the element using aria-label value and placeholder', () => {
  const { wrapper } = renderMultiselect(
    <Multiselect selectedOptions={[]} options={groupOptions} ariaLabel="multi select" placeholder="select options" />
  );
  const label = wrapper
    .findTrigger()
    .getElement()
    .getAttribute('aria-labelledby')!
    .split(' ')
    .map(labelId => wrapper.getElement().querySelector(`#${labelId}`)!.textContent)
    .join(' ');
  expect(label).toBe('multi select select options');
});

describe('a11y properties', () => {
  test('trigger should aria-control the list (role="listbox") when filtering disabled', () => {
    const { wrapper } = renderMultiselect(<Multiselect selectedOptions={[]} options={defaultOptions} />);
    const hasPopup = wrapper.findTrigger().getElement().getAttribute('aria-haspopup');
    expect(hasPopup).toBe('listbox');
    wrapper.openDropdown();
    const controlledId = wrapper.findTrigger().getElement().getAttribute('aria-controls');
    expect(controlledId).toBeTruthy();
    expect(wrapper.findDropdown().getElement().querySelector(`#${controlledId}`)!.getAttribute('role')).toBe('listbox');
  });
  test('trigger should aria-control the dropdown (role="dialog") when filtering enabled', () => {
    const { wrapper } = renderMultiselect(
      <Multiselect selectedOptions={[]} options={defaultOptions} filteringType="auto" />
    );
    const hasPopup = wrapper.findTrigger().getElement().getAttribute('aria-haspopup');
    expect(hasPopup).toBe('dialog');
    wrapper.openDropdown();
    const controlledId = wrapper.findTrigger().getElement().getAttribute('aria-controls');
    expect(controlledId).toBeTruthy();
    expect(
      wrapper.findDropdown().getElement().parentNode!.querySelector(`#${controlledId}`)!.getAttribute('role')
    ).toBe('dialog');
  });
  test('dropdown (role="dialog") should receive a label when filtering enabled', () => {
    const { wrapper } = renderMultiselect(
      <Multiselect selectedOptions={[]} options={defaultOptions} filteringType="auto" ariaLabel="multiselect-label" />
    );
    wrapper.openDropdown();
    const controlledId = wrapper.findTrigger().getElement().getAttribute('aria-controls');
    expect(wrapper.findDropdown().getElement().parentNode!.querySelector(`#${controlledId}`)!).toHaveAccessibleName(
      'multiselect-label'
    );
  });
});

test('Trigger receives focus when autofocus is true', () => {
  const { wrapper } = renderMultiselect(<Multiselect selectedOptions={[]} options={groupOptions} autoFocus={true} />);
  expect(document.activeElement).toBe(wrapper.findTrigger().getElement());
});

describe('With inline tokens (private API)', () => {
  it('can render inline tokens', () => {
    const { wrapper } = renderMultiselect(
      <Multiselect {...{ inlineTokens: true }} options={defaultOptions} selectedOptions={[defaultOptions[0]]} />
    );

    // Trigger contains token labels and the number of selected items
    expect(wrapper.findTrigger().getElement()).toHaveTextContent('First');
    expect(wrapper.findTrigger().getElement()).toHaveTextContent('(1)');

    // Default tokens below the trigger are not displayed
    expect(wrapper.findTokens()).toHaveLength(0);
  });

  it('shows placeholder when no items are selected', () => {
    const { wrapper } = renderMultiselect(
      <Multiselect {...{ inlineTokens: true }} selectedOptions={[]} placeholder="Choose something" />
    );

    expect(wrapper.findTrigger().getElement()).toHaveTextContent('Choose something');
  });

  it('does not display features like tags in the inline tokens', () => {
    const extendedOptions = [
      { value: '1', label: 'First', description: 'description', tags: ['tag'], labelTag: 'label' },
    ];
    const { wrapper } = renderMultiselect(
      <Multiselect {...{ inlineTokens: true }} options={extendedOptions} selectedOptions={[extendedOptions[0]]} />
    );

    expect(wrapper.findTrigger().getElement()).toHaveTextContent('First');
    expect(wrapper.findTrigger().getElement()).not.toHaveTextContent('description');
    expect(wrapper.findTrigger().getElement()).not.toHaveTextContent('tag');
    expect(wrapper.findTrigger().getElement()).not.toHaveTextContent('label');
  });

  it('shows multiple selected options inline', () => {
    const { wrapper } = renderMultiselect(
      <Multiselect
        {...{ inlineTokens: true }}
        options={defaultOptions}
        selectedOptions={[defaultOptions[0], defaultOptions[1], defaultOptions[2]]}
      />
    );

    expect(wrapper.findTrigger().getElement()).toHaveTextContent('First');
    expect(wrapper.findTrigger().getElement()).toHaveTextContent('Second');
    expect(wrapper.findTrigger().getElement()).toHaveTextContent('Third');
    expect(wrapper.findTrigger().getElement()).toHaveTextContent('(3)');
  });
});
