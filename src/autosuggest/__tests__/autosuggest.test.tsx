// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';
import createWrapper from '../../../lib/components/test-utils/dom';
import Autosuggest, { AutosuggestProps } from '../../../lib/components/autosuggest';
import styles from '../../../lib/components/autosuggest/styles.css.js';
import { KeyCode } from '@cloudscape-design/test-utils-core/utils';
import '../../__a11y__/to-validate-a11y';

let uniqueId = 1;

jest.mock('../../../lib/components/internal/hooks/use-unique-id', () => ({
  useUniqueId: () => 'random-' + uniqueId++,
  generateUniqueId: () => 'random-' + uniqueId++,
}));

const defaultOptions: AutosuggestProps.Options = [{ value: '1', label: 'One' }, { value: '2' }];
const defaultProps: AutosuggestProps = {
  enteredTextLabel: () => 'Use value',
  value: '',
  onChange: () => {},
  options: defaultOptions,
};

function renderAutosuggest(jsx: React.ReactElement) {
  const { container, rerender } = render(jsx);
  const wrapper = createWrapper(container).findAutosuggest()!;
  return { container, wrapper, rerender };
}

test('renders correct labels when focused', () => {
  const { wrapper } = renderAutosuggest(<Autosuggest {...defaultProps} />);

  wrapper.focus();
  expect(wrapper.findDropdown().findOptionByValue('1')!.getElement()).toHaveTextContent('One');
  expect(wrapper.findDropdown().findOptionByValue('2')!.getElement()).toHaveTextContent('2');
});

test('option can be selected', () => {
  const onChange = jest.fn();
  const { wrapper } = renderAutosuggest(<Autosuggest {...defaultProps} onChange={onChange} />);
  wrapper.focus();
  wrapper.selectSuggestion(1);
  expect(onChange).toHaveBeenCalledWith(
    expect.objectContaining({
      detail: {
        value: '1',
      },
    })
  );
});

test('option can be selected by value', () => {
  const onChange = jest.fn();
  const { wrapper } = renderAutosuggest(<Autosuggest {...defaultProps} onChange={onChange} />);
  wrapper.focus();
  wrapper.selectSuggestionByValue('2');
  expect(onChange).toHaveBeenCalledWith(
    expect.objectContaining({
      detail: {
        value: '2',
      },
    })
  );
});

test('option with special characters can be selected by value', () => {
  ['"quote"', 'greater than > '].forEach(value => {
    const onChange = jest.fn();
    const { wrapper } = renderAutosuggest(<Autosuggest {...defaultProps} options={[{ value }]} onChange={onChange} />);
    wrapper.focus();
    wrapper.selectSuggestionByValue(value);
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: { value },
      })
    );
  });
});

test('should display entered text option/label', () => {
  const enteredTextLabel = jest.fn(value => `Custom function with ${value} placeholder`);
  const { wrapper } = renderAutosuggest(
    <Autosuggest enteredTextLabel={enteredTextLabel} value="1" options={defaultOptions} />
  );
  wrapper.setInputValue('1');
  expect(enteredTextLabel).toBeCalledWith('1');
  expect(wrapper.findEnteredTextOption()!.getElement()).toHaveTextContent('Custom function with 1 placeholder');
});

describe('onSelect', () => {
  test('should select normal value', () => {
    const onChange = jest.fn();
    const onSelect = jest.fn();
    const { wrapper } = renderAutosuggest(
      <Autosuggest
        {...defaultProps}
        onChange={event => onChange(event.detail)}
        onSelect={event => onSelect(event.detail)}
      />
    );
    wrapper.focus();
    wrapper.selectSuggestion(1);
    expect(onChange).toHaveBeenCalledWith({ value: '1' });
    expect(onSelect).toHaveBeenCalledWith({ value: '1' });
  });

  test('should select `enteredText` option', () => {
    const onChange = jest.fn();
    const onSelect = jest.fn();
    const { wrapper } = renderAutosuggest(
      <Autosuggest
        {...defaultProps}
        value="test"
        onChange={event => onChange(event.detail)}
        onSelect={event => onSelect(event.detail)}
      />
    );
    wrapper.focus();
    wrapper.findEnteredTextOption()!.fireEvent(new MouseEvent('mouseup', { bubbles: true }));
    expect(onChange).toHaveBeenCalledWith({ value: 'test' });
    expect(onSelect).toHaveBeenCalledWith({ value: 'test' });
  });
});

describe('Dropdown states', () => {
  (
    [
      ['loading', true],
      ['error', true],
      ['finished', false],
    ] as const
  ).forEach(([statusType, isSticky]) => {
    test(`should display ${statusType} status text as ${isSticky ? 'sticky' : 'non-sticky'} footer`, () => {
      const statusText = {
        [`${statusType}Text`]: `Test ${statusType} text`,
      };
      const { wrapper } = renderAutosuggest(<Autosuggest {...defaultProps} statusType={statusType} {...statusText} />);
      wrapper.focus();
      expect(wrapper.findStatusIndicator()!.getElement()).toHaveTextContent(`Test ${statusType} text`);

      const dropdown = wrapper.findDropdown()!.findOpenDropdown()!;
      expect(Boolean(dropdown.findByClassName(styles['list-bottom']))).toBe(!isSticky);
    });

    test(`check a11y for ${statusType} and ${isSticky ? 'sticky' : 'non-sticky'} footer`, async () => {
      const statusText = {
        [`${statusType}Text`]: `Test ${statusType} text`,
      };
      const { container, wrapper } = renderAutosuggest(
        <Autosuggest {...defaultProps} statusType={statusType} {...statusText} ariaLabel="input" />
      );
      wrapper.focus();

      await expect(container).toValidateA11y();
    });
  });
});

describe('a11y props', () => {
  test('adds combobox role to input', () => {
    const { wrapper } = renderAutosuggest(<Autosuggest {...defaultProps} options={[]} />);
    const input = wrapper.findNativeInput().getElement();
    expect(input).toHaveAttribute('role', 'combobox');
  });

  test('adds correct aria properties to input', () => {
    const { wrapper } = renderAutosuggest(<Autosuggest {...defaultProps} options={[]} />);
    const input = wrapper.findNativeInput().getElement();
    expect(input).toHaveAttribute('aria-autocomplete', 'list');
    expect(input).toHaveAttribute('aria-expanded', 'false');
    expect(input).toHaveAttribute('aria-controls', expect.stringContaining('random-'));
    expect(input).not.toHaveAttribute('aria-label');
    expect(input).not.toHaveAttribute('aria-activedescendant');
  });

  test('adds correct aria properties to input when expanded', () => {
    const { wrapper } = renderAutosuggest(<Autosuggest {...defaultProps} />);
    const input = wrapper.findNativeInput().getElement();
    wrapper.focus();
    expect(input).toHaveAttribute('aria-expanded', 'true');
  });

  test('can add an aria-label to input', () => {
    const { wrapper } = renderAutosuggest(<Autosuggest {...defaultProps} options={[]} ariaLabel="input label" />);
    const input = wrapper.findNativeInput().getElement();
    expect(input).toHaveAttribute('aria-label', 'input label');
  });

  test('adds id of highlighted item as aria-activedescendant to input', () => {
    const { wrapper } = renderAutosuggest(<Autosuggest {...defaultProps} />);
    wrapper.findNativeInput().keydown(KeyCode.down);
    const input = wrapper.findNativeInput().getElement();
    const highlightedOption = wrapper.findDropdown().findHighlightedOption()!.getElement();
    expect(highlightedOption).toHaveAttribute('id', expect.stringContaining('random-'));
    expect(input).toHaveAttribute('aria-activedescendant', highlightedOption.getAttribute('id'));
  });
});

describe('keyboard interactions', () => {
  test('selects option on enter', () => {
    const onChange = jest.fn();
    const onSelect = jest.fn();
    const { wrapper } = renderAutosuggest(<Autosuggest {...defaultProps} onChange={onChange} onSelect={onSelect} />);
    wrapper.findNativeInput().keydown(KeyCode.down);
    wrapper.findNativeInput().keydown(KeyCode.enter);
    expect(onChange).toBeCalledWith(expect.objectContaining({ detail: { value: '1' } }));
    expect(onSelect).toBeCalledWith(expect.objectContaining({ detail: { value: '1' } }));
  });

  test('closes dropdown on enter and opens it on arrow keys', () => {
    const { wrapper } = renderAutosuggest(<Autosuggest {...defaultProps} onChange={() => undefined} />);
    expect(wrapper.findDropdown()!.findOpenDropdown()).toBe(null);

    wrapper.findNativeInput().keydown(KeyCode.down);
    expect(wrapper.findDropdown()!.findOpenDropdown()).not.toBe(null);

    wrapper.findNativeInput().keydown(KeyCode.enter);
    expect(wrapper.findDropdown()!.findOpenDropdown()).toBe(null);

    wrapper.findNativeInput().keydown(KeyCode.up);
    expect(wrapper.findDropdown()!.findOpenDropdown()).not.toBe(null);
  });
});
