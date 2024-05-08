// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';
import createWrapper from '../../../lib/components/test-utils/dom';
import Autosuggest, { AutosuggestProps } from '../../../lib/components/autosuggest';
import styles from '../../../lib/components/autosuggest/styles.css.js';
import itemStyles from '../../../lib/components/internal/components/selectable-item/styles.css.js';
import { KeyCode } from '@cloudscape-design/test-utils-core/utils';
import '../../__a11y__/to-validate-a11y';
import statusIconStyles from '../../../lib/components/status-indicator/styles.selectors.js';
import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

const defaultOptions: AutosuggestProps.Options = [
  { value: '1', label: 'One' },
  { value: '2', lang: 'fr' },
];
const groupOptions: AutosuggestProps.Options = [
  { label: 'Group 1', options: [{ value: '1' }, { value: '2' }] },
  { label: 'Group 2', options: [{ value: '3' }] },
];
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

test('renders correct labels when focused', () => {
  const { wrapper } = renderAutosuggest(<Autosuggest {...defaultProps} />);

  wrapper.focus();
  expect(wrapper.findDropdown().findOptionByValue('1')!.getElement()).toHaveTextContent('One');
  expect(wrapper.findDropdown().findOptionByValue('2')!.getElement()).toHaveTextContent('2');
});

test('renders lang on options', () => {
  const { wrapper } = renderAutosuggest(<Autosuggest {...defaultProps} />);
  wrapper.focus();
  expect(wrapper.findDropdown()!.findOptionByValue('2')!.getElement()).toHaveAttribute('lang', 'fr');
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

test('entered text option should not get screenreader override', () => {
  const { wrapper } = renderAutosuggest(<Autosuggest {...defaultProps} value="1" />);
  wrapper.focus();
  expect(
    wrapper.findEnteredTextOption()!.findByClassName(itemStyles['screenreader-content'])?.getElement().textContent
  ).toBeFalsy();
});

test('should not close dropdown when no realted target in blur', () => {
  const { wrapper, container } = renderAutosuggest(
    <div>
      <Autosuggest enteredTextLabel={v => v} value="1" options={defaultOptions} />
      <button id="focus-target">focus target</button>
    </div>
  );
  wrapper.findNativeInput().focus();
  expect(wrapper.findDropdown().findOpenDropdown()).not.toBe(null);

  document.body.focus();
  expect(wrapper.findDropdown().findOpenDropdown()).not.toBe(null);

  createWrapper(container).find('#focus-target')!.focus();
  expect(wrapper.findDropdown().findOpenDropdown()).toBe(null);
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
    expect(onSelect).toHaveBeenCalledWith({ value: '1', selectedOption: defaultOptions[0] });
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
    expect(onSelect).toHaveBeenCalledWith({ value: 'test', selectedOption: undefined });
    expect(wrapper.findDropdown().findOpenDropdown()).toBeFalsy();
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

  test('should display error status icon with provided aria label', () => {
    const { wrapper } = renderAutosuggest(
      <Autosuggest
        {...defaultProps}
        statusType="error"
        errorText="Test error text"
        errorIconAriaLabel="Test error text"
      />
    );
    wrapper.focus();
    const statusIcon = wrapper.findStatusIndicator()!.findByClassName(statusIconStyles.icon)!.getElement();
    expect(statusIcon).toHaveAttribute('aria-label', 'Test error text');
    expect(statusIcon).toHaveAttribute('role', 'img');
  });

  test('should associate the error status footer with the dropdown', () => {
    const { wrapper } = renderAutosuggest(
      <Autosuggest {...defaultProps} statusType="error" errorText="Test error text" />
    );
    wrapper.focus();
    expect(wrapper.findDropdown().find('ul')!.getElement()).toHaveAccessibleDescription('Test error text');
  });

  test('should associate the finished status footer with the dropdown', () => {
    const { wrapper } = renderAutosuggest(
      <Autosuggest {...defaultProps} statusType="finished" finishedText="Finished text" />
    );
    wrapper.focus();
    expect(wrapper.findDropdown().find('ul')!.getElement()).toHaveAccessibleDescription('Finished text');
  });

  it('when no options is matched the dropdown is shown but aria-expanded is false', () => {
    const { wrapper } = renderAutosuggest(<Autosuggest {...defaultProps} statusType="finished" value="free-text" />);
    wrapper.setInputValue('free-text');
    expect(wrapper.findNativeInput().getElement()).toHaveAttribute('aria-expanded', 'false');
    expect(wrapper.findDropdown().findOpenDropdown()).not.toBe(null);
  });

  it('should warn if recoveryText is provided without associated handler', () => {
    renderAutosuggest(
      <Autosuggest {...defaultProps} statusType="error" errorText="Test error text" recoveryText="Retry" />
    );
    expect(warnOnce).toHaveBeenCalledTimes(1);
    expect(warnOnce).toHaveBeenCalledWith(
      'Autosuggest',
      '`onLoadItems` must be provided for `recoveryText` to be displayed.'
    );
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
    expect(input).not.toHaveAttribute('aria-controls');
    expect(input).not.toHaveAttribute('aria-owns');
    expect(input).not.toHaveAttribute('aria-label');
    expect(input).not.toHaveAttribute('aria-activedescendant');
  });

  test('has correct aria property when suggestion dialog is open', () => {
    const { wrapper } = renderAutosuggest(<Autosuggest {...defaultProps} options={[]} />);
    const input = wrapper.findNativeInput().getElement();
    wrapper.findNativeInput().focus();
    expect(input).toHaveAttribute('aria-controls', expect.any(String));
    expect(input).toHaveAttribute('aria-owns', expect.any(String));
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
    expect(highlightedOption).toHaveAttribute('id', expect.any(String));
    expect(input).toHaveAttribute('aria-activedescendant', highlightedOption.getAttribute('id'));
  });

  test('Option should have appropriate aria-selected values', () => {
    const { wrapper } = renderAutosuggest(<Autosuggest {...defaultProps} value="2" />);
    wrapper.focus();
    expect(wrapper.findDropdown()!.find('[data-test-index="1"]')!.getElement()).toHaveAttribute(
      'aria-selected',
      'false'
    );
    expect(wrapper.findDropdown()!.find('[data-test-index="2"]')!.getElement()).toHaveAttribute(
      'aria-selected',
      'true'
    );
    wrapper.findNativeInput().keydown(KeyCode.down);
    wrapper.findNativeInput().keydown(KeyCode.down);
    expect(wrapper.findDropdown()!.find('[data-test-index="1"]')!.getElement()).toHaveAttribute(
      'aria-selected',
      'false'
    );
    expect(wrapper.findDropdown()!.find('[data-test-index="2"]')!.getElement()).toHaveAttribute(
      'aria-selected',
      'true'
    );
  });

  test('Option should have appropriate aria label', () => {
    const { wrapper } = renderAutosuggest(<Autosuggest {...defaultProps} value="1" selectedAriaLabel="Selected" />);
    wrapper.focus();
    wrapper.findNativeInput().keydown(KeyCode.down);
    wrapper.findNativeInput().keydown(KeyCode.down);
    expect(
      wrapper
        .findDropdown()!
        .find('[data-test-index="1"]')!
        .findByClassName(itemStyles['screenreader-content'])!
        .getElement()
    ).toHaveTextContent('Selected');
    wrapper.findNativeInput().keydown(KeyCode.down);
    expect(
      wrapper
        .findDropdown()!
        .find('[data-test-index="2"]')!
        .findByClassName(itemStyles['screenreader-content'])!
        .getElement()
    ).not.toHaveTextContent('Selected');
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
    expect(onSelect).toBeCalledWith(
      expect.objectContaining({ detail: { value: '1', selectedOption: defaultOptions[0] } })
    );
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

  test('closes dropdown and clears input on esc', () => {
    const onChange = jest.fn();
    const { wrapper, rerender } = renderAutosuggest(<Autosuggest {...defaultProps} value="1" onChange={onChange} />);
    expect(wrapper.findDropdown()!.findOpenDropdown()).toBe(null);

    wrapper.findNativeInput().keydown(KeyCode.down);
    expect(wrapper.findDropdown()!.findOpenDropdown()).not.toBe(null);

    wrapper.findNativeInput().keydown(KeyCode.escape);
    expect(wrapper.findDropdown()!.findOpenDropdown()).toBe(null);
    expect(onChange).toBeCalledTimes(0);

    wrapper.findNativeInput().keydown(KeyCode.escape);
    expect(wrapper.findDropdown()!.findOpenDropdown()).toBe(null);
    expect(onChange).toBeCalledTimes(1);
    expect(onChange).toBeCalledWith(expect.objectContaining({ detail: { value: '' } }));

    rerender(<Autosuggest {...defaultProps} value="" onChange={onChange} />);

    wrapper.findNativeInput().keydown(KeyCode.escape);
    expect(wrapper.findDropdown()!.findOpenDropdown()).toBe(null);
    expect(onChange).toBeCalledTimes(1);
  });

  test('arrow up key on first option should highlight last option', () => {
    const { wrapper } = renderAutosuggest(<Autosuggest {...defaultProps} />);

    expect(wrapper.findDropdown()!.findOpenDropdown()).toBe(null);
    wrapper.findNativeInput().keydown(KeyCode.down);
    expect(wrapper.findDropdown()!.findOpenDropdown()).not.toBe(null);

    expect(wrapper.findDropdown().findHighlightedOption()!.getElement()).toHaveTextContent('One');
    wrapper.findNativeInput().keydown(KeyCode.up);
    expect(wrapper.findDropdown().findHighlightedOption()!.getElement()).toHaveTextContent('2');
  });

  test('arrow up key on first option should highlight last option (options with groups)', () => {
    const { wrapper } = renderAutosuggest(<Autosuggest {...defaultProps} options={groupOptions} />);

    expect(wrapper.findDropdown()!.findOpenDropdown()).toBe(null);
    wrapper.findNativeInput().keydown(KeyCode.down);
    expect(wrapper.findDropdown()!.findOpenDropdown()).not.toBe(null);

    expect(wrapper.findDropdown().findHighlightedOption()!.getElement()).toHaveTextContent('1');
    wrapper.findNativeInput().keydown(KeyCode.up);
    expect(wrapper.findDropdown().findHighlightedOption()!.getElement()).toHaveTextContent('3');
  });

  test('arrow down key on last option should highlight first option', () => {
    const { wrapper } = renderAutosuggest(<Autosuggest {...defaultProps} />);

    expect(wrapper.findDropdown()!.findOpenDropdown()).toBe(null);
    wrapper.findNativeInput().keydown(KeyCode.down);
    expect(wrapper.findDropdown()!.findOpenDropdown()).not.toBe(null);

    expect(wrapper.findDropdown().findHighlightedOption()!.getElement()).toHaveTextContent('One');
    wrapper.findNativeInput().keydown(KeyCode.down);
    expect(wrapper.findDropdown().findHighlightedOption()!.getElement()).toHaveTextContent('2');
    wrapper.findNativeInput().keydown(KeyCode.down);
    expect(wrapper.findDropdown().findHighlightedOption()!.getElement()).toHaveTextContent('One');
  });
});

describe('Check if should render dropdown', () => {
  test('should render dropdown content when not empty and dropdown content is not null', () => {
    const { wrapper } = renderAutosuggest(
      <Autosuggest
        {...defaultProps}
        value="1"
        options={[{ value: '1', label: 'One' }]}
        statusType="error"
        errorText="Test error text"
      />
    );

    wrapper.focus();

    expect(wrapper.findDropdown().findOpenDropdown()).not.toBe(null);
  });

  test('should not render dropdown content when empty and dropdown content is null', () => {
    const { wrapper } = renderAutosuggest(<Autosuggest {...defaultProps} value="" options={[]} />);

    wrapper.focus();

    expect(wrapper.findDropdown().findOpenDropdown()).toBe(null);
  });

  test('should render dropdown content when not empty', () => {
    const { wrapper } = renderAutosuggest(
      <Autosuggest {...defaultProps} value="1" options={[{ value: '1', label: 'One' }]} />
    );

    wrapper.focus();

    expect(wrapper.findDropdown().findOpenDropdown()).not.toBe(null);
  });

  test('should render dropdown content when dropdown content is not null', () => {
    const { wrapper } = renderAutosuggest(
      <Autosuggest {...defaultProps} value="" options={[]} statusType="error" errorText="Test error text" />
    );

    wrapper.focus();

    expect(wrapper.findDropdown().findOpenDropdown()).not.toBe(null);
  });
});

describe('Ref', () => {
  test('can be used to focus the component', () => {
    const ref = React.createRef<AutosuggestProps.Ref>();
    const { wrapper } = renderAutosuggest(<Autosuggest {...defaultProps} value="1" ref={ref} />);
    const input = wrapper.findNativeInput().getElement();
    expect(document.activeElement).not.toBe(input);
    ref.current!.focus();
    expect(document.activeElement).toBe(input);
  });

  test('can be used to select all text', () => {
    const ref = React.createRef<AutosuggestProps.Ref>();
    const { wrapper } = renderAutosuggest(<Autosuggest {...defaultProps} value="te" ref={ref} />);
    const input = wrapper.findNativeInput().getElement();

    // Make sure no text is selected
    input.selectionStart = input.selectionEnd = 0;
    input.blur();
    expect(input.selectionStart).toBe(0);
    expect(input.selectionEnd).toBe(0);

    // Select all text
    ref.current!.select();
    expect(input.selectionStart).toBe(0);
    expect(input.selectionEnd).toBe(2);
  });
});

test('findOptionInGroup', () => {
  const { container } = render(
    <Autosuggest value="" onChange={() => {}} enteredTextLabel={() => 'Use value'} options={groupOptions} />
  );
  const wrapper = createWrapper(container).findAutosuggest()!;
  wrapper.findNativeInput().focus();
  expect(wrapper.findDropdown().findOptionInGroup(1, 2)).toBeTruthy();
});
