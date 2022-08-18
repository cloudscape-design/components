// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, render } from '@testing-library/react';

import { i18nStrings } from './common';

import createWrapper, {
  ElementWrapper,
  PropertyFilterWrapper,
  PopoverWrapper,
} from '../../../lib/components/test-utils/dom';
import PropertyFilter, { PropertyFilterProps } from '../../../lib/components/property-filter';

import styles from '../../../lib/components/property-filter/styles.selectors.js';
import { KeyCode } from '@cloudscape-design/test-utils-core/dist/utils';

const filteringProperties = [
  {
    key: 'string',
    propertyLabel: 'string',
    operators: ['!:', ':', '=', '!='],
    groupValuesLabel: 'String values',
  },
  // property label has the a prefix equal to another property's label
  {
    key: 'other-string',
    propertyLabel: 'string-other',
    operators: ['!:', ':', '=', '!='],
    groupValuesLabel: 'Other string values',
  },
  // operator unspecified
  {
    key: 'default-operator',
    propertyLabel: 'default',
    groupValuesLabel: 'Default values',
  },
  // supports range operators
  {
    key: 'range',
    propertyLabel: 'range',
    operators: ['>', '<', '=', '!=', '>=', '<='],
    groupValuesLabel: 'Range values',
    group: 'group-name',
  },
  // property label is consists of another property with an operator after
  {
    key: 'edge-case',
    propertyLabel: 'string!=',
    operators: ['!:', ':', '=', '!='],
    groupValuesLabel: 'Edge case values',
  },
] as const;

const filteringOptions: readonly PropertyFilterProps.FilteringOption[] = [
  { propertyKey: 'string', value: 'value1' },
  { propertyKey: 'other-string', value: 'value1' },
  { propertyKey: 'string', value: 'value2' },
  { propertyKey: 'range', value: '1' },
  { propertyKey: 'range', value: '2' },
  { propertyKey: 'other-string', value: 'value2' },
  { propertyKey: 'missing-property', value: 'value' },
  { propertyKey: 'default-operator', value: 'value' },
] as const;

const defaultProps: PropertyFilterProps = {
  filteringProperties,
  filteringOptions,
  onChange: () => {},
  query: { tokens: [], operation: 'and' },
  i18nStrings,
  id: 'property-filter',
};

const renderComponent = (props?: Partial<PropertyFilterProps & { ref: React.Ref<PropertyFilterProps.Ref> }>) => {
  const { container } = render(
    <div>
      <button id="button" />
      <PropertyFilter {...defaultProps} {...props} />
    </div>
  );
  const pageWrapper = createWrapper(container);
  return {
    propertyFilterWrapper: pageWrapper.findPropertyFilter()!,
    pageWrapper,
  };
};

function findPropertySelector(wrapper: ElementWrapper) {
  return wrapper.findByClassName(styles['property-selector'])!.findSelect()!;
}
function findOperatorSelector(wrapper: ElementWrapper) {
  return wrapper.findByClassName(styles['operator-selector'])!.findSelect()!;
}
function findValueSelector(wrapper: ElementWrapper) {
  return wrapper.findByClassName(styles['value-selector'])!.findAutosuggest()!;
}

describe('property filter parts', () => {
  describe('filtering input', () => {
    describe('"use entered" option', () => {
      test('is added, when a token can be created from the current text in the input', () => {
        const { propertyFilterWrapper: wrapper } = renderComponent();
        act(() => wrapper.setInputValue('string'));
        expect(wrapper.findEnteredTextOption()!.getElement()).toHaveTextContent('Use: "string"');
      });
      test('with free text tokens disabled', () => {
        const { propertyFilterWrapper: wrapper } = renderComponent({ disableFreeTextFiltering: true });
        // is not shown, when the current text does not represent a property token
        act(() => wrapper.setInputValue('string'));
        expect(wrapper.findEnteredTextOption()).toBeNull();
        // is shown otherwise
        act(() => wrapper.setInputValue('string:'));
        expect(wrapper.findEnteredTextOption()!.getElement()).toHaveTextContent('Use: "string:"');
      });
      test('causes a token to be created, when selected', () => {
        const handleChange = jest.fn();
        const { propertyFilterWrapper: wrapper } = renderComponent({ onChange: handleChange });
        // free text
        act(() => wrapper.setInputValue('string'));
        act(() => wrapper.findNativeInput().keydown(KeyCode.down));
        act(() => wrapper.findNativeInput().keydown(KeyCode.enter));
        expect(handleChange).toHaveBeenCalledWith(
          expect.objectContaining({ detail: { tokens: [{ value: 'string', operator: ':' }], operation: 'and' } })
        );
        // property
        act(() => wrapper.setInputValue('string   !:123'));
        act(() => wrapper.findNativeInput().keydown(KeyCode.down));
        act(() => wrapper.findNativeInput().keydown(KeyCode.enter));
        expect(handleChange).toHaveBeenLastCalledWith(
          expect.objectContaining({
            detail: { tokens: [{ propertyKey: 'string', value: '123', operator: '!:' }], operation: 'and' },
          })
        );
      });
    });
    test('can be focused using the property filter ref', () => {
      const focusRef: React.Ref<PropertyFilterProps.Ref> = { current: null };
      const { propertyFilterWrapper: wrapper } = renderComponent({ ref: focusRef });
      act(() => focusRef.current!.focus());
      expect(wrapper.findNativeInput().getElement()).toHaveFocus();
    });
    test('recieves `placeholder`, `ariaLabel` and `disabled` properties passed to the component', () => {
      const { propertyFilterWrapper: wrapper } = renderComponent({
        disabled: true,
        i18nStrings: { ...i18nStrings, filteringPlaceholder: 'placeholder' },
      });
      expect(wrapper.findNativeInput().getElement()).toHaveAttribute('placeholder', 'placeholder');
      expect(wrapper.findNativeInput().getElement()).toHaveAttribute('disabled');
      expect(wrapper.findNativeInput().getElement()).toHaveAttribute('aria-label', 'your choice');
    });
    describe('typing experience: ', () => {
      test('provides relevant suggestions depending on the currently entered string', () => {
        const { propertyFilterWrapper: wrapper } = renderComponent();
        // property suggestions
        act(() => wrapper.findNativeInput().focus());
        expect(
          wrapper
            .findDropdown()
            .findOptions()
            .map(optionWrapper => optionWrapper.getElement().textContent)
        ).toEqual(['string', 'string-other', 'default', 'string!=', 'range']);
        // property and value suggestions
        act(() => wrapper.setInputValue('a'));
        expect(
          wrapper
            .findDropdown()
            .findOptions()
            .map(optionWrapper => optionWrapper.getElement().textContent)
        ).toEqual([
          'default',
          'range',
          'string = value1',
          'string-other = value1',
          'string = value2',
          'string-other = value2',
          'default = value',
        ]);
        // operator suggestions
        act(() => wrapper.setInputValue('string'));
        expect(
          wrapper
            .findDropdown()
            .findOptions()
            .map(optionWrapper => optionWrapper.getElement().textContent)
        ).toEqual(['string =Equals', 'string !=Does not equal', 'string :Contains', 'string !:Does not contain']);
        // value suggestions
        act(() => wrapper.setInputValue('string:'));
        expect(
          wrapper
            .findDropdown()
            .findOptions()
            .map(optionWrapper => optionWrapper.getElement().textContent)
        ).toEqual(['string : value1', 'string : value2']);
      });
      test('supports property names that are substrings of others', () => {
        const { propertyFilterWrapper: wrapper } = renderComponent({
          filteringProperties: [
            {
              key: 'string',
              propertyLabel: 'string',
              operators: ['!:', ':', '=', '!='],
              groupValuesLabel: 'String values',
            },
            {
              key: 'other-string',
              propertyLabel: 'string-other',
              operators: ['!:', ':', '=', '!='],
              groupValuesLabel: 'Other string values',
            },
          ],
        });
        act(() => wrapper.setInputValue('string'));
        expect(
          wrapper
            .findDropdown()
            .findOptions()
            .map(optionWrapper => optionWrapper.getElement().textContent)
        ).toEqual(['string =Equals', 'string !=Does not equal', 'string :Contains', 'string !:Does not contain']);
        act(() => wrapper.setInputValue('string-other'));
        expect(
          wrapper
            .findDropdown()
            .findOptions()
            .map(optionWrapper => optionWrapper.getElement().textContent)
        ).toEqual([
          'string-other =Equals',
          'string-other !=Does not equal',
          'string-other :Contains',
          'string-other !:Does not contain',
        ]);
      });
      test('supports property names that are substrings of others (alternate order)', () => {
        const { propertyFilterWrapper: wrapper } = renderComponent({
          filteringProperties: [
            {
              key: 'other-string',
              propertyLabel: 'string-other',
              operators: ['!:', ':', '=', '!='],
              groupValuesLabel: 'Other string values',
            },
            {
              key: 'string',
              propertyLabel: 'string',
              operators: ['!:', ':', '=', '!='],
              groupValuesLabel: 'String values',
            },
          ],
        });
        act(() => wrapper.setInputValue('string'));
        expect(
          wrapper
            .findDropdown()
            .findOptions()
            .map(optionWrapper => optionWrapper.getElement().textContent)
        ).toEqual(['string =Equals', 'string !=Does not equal', 'string :Contains', 'string !:Does not contain']);
        act(() => wrapper.setInputValue('string-other'));
        expect(
          wrapper
            .findDropdown()
            .findOptions()
            .map(optionWrapper => optionWrapper.getElement().textContent)
        ).toEqual([
          'string-other =Equals',
          'string-other !=Does not equal',
          'string-other :Contains',
          'string-other !:Does not contain',
        ]);
      });
      test('can be submitted to create a token', () => {
        const handleChange = jest.fn();
        const { propertyFilterWrapper: wrapper } = renderComponent({ onChange: handleChange });
        act(() => wrapper.findNativeInput().focus());
        act(() => wrapper.setInputValue('string'));
        act(() => wrapper.findNativeInput().keydown(KeyCode.enter));
        expect(handleChange).toHaveBeenCalledWith(
          expect.objectContaining({
            detail: { tokens: [{ value: 'string', operator: ':' }], operation: 'and' },
          })
        );
        expect(wrapper.findNativeInput().getElement()).toHaveValue('');

        act(() => wrapper.setInputValue('string:value'));
        act(() => wrapper.findNativeInput().keydown(KeyCode.enter));
        expect(handleChange).toHaveBeenLastCalledWith(
          expect.objectContaining({
            detail: { tokens: [{ value: 'value', operator: ':', propertyKey: 'string' }], operation: 'and' },
          })
        );
        expect(wrapper.findNativeInput().getElement()).toHaveValue('');
      });
      test('submitting empty input does not create a token', () => {
        const handleChange = jest.fn();
        const { propertyFilterWrapper: wrapper } = renderComponent({ onChange: handleChange });
        act(() => wrapper.findNativeInput().focus());
        act(() => wrapper.findNativeInput().keydown(KeyCode.enter));
        expect(handleChange).not.toHaveBeenCalled();
      });
      test('can not be submitted to create a free text token, when free text tokens are disabled', () => {
        const handleChange = jest.fn();
        const { propertyFilterWrapper: wrapper } = renderComponent({
          onChange: handleChange,
          disableFreeTextFiltering: true,
        });
        act(() => wrapper.findNativeInput().focus());
        act(() => wrapper.setInputValue('string'));
        act(() => wrapper.findNativeInput().keydown(KeyCode.enter));
        expect(handleChange).not.toHaveBeenCalled();
        expect(wrapper.findNativeInput().getElement()).toHaveValue('string');
      });
    });
    describe('selecting items in the dropdown', () => {
      test('keeps the dropdown open, when property or operator suggestions are selected', () => {
        const { propertyFilterWrapper: wrapper } = renderComponent();

        act(() => wrapper.findNativeInput().focus());
        act(() => wrapper.findNativeInput().keydown(KeyCode.down));
        act(() => wrapper.findNativeInput().keydown(KeyCode.enter));
        expect(wrapper.findNativeInput().getElement()).toHaveValue('string');
        expect(wrapper.findDropdown()?.findOpenDropdown()).toBeTruthy();

        act(() => wrapper.findNativeInput().keydown(KeyCode.down));
        act(() => wrapper.findNativeInput().keydown(KeyCode.down));
        act(() => wrapper.findNativeInput().keydown(KeyCode.enter));
        expect(wrapper.findNativeInput().getElement()).toHaveValue('string = ');
        expect(wrapper.findDropdown()?.findOpenDropdown()).toBeTruthy();
      });
      test('creates a new token and closes the dropdown, when a value suggestion is selected', () => {
        const handleChange = jest.fn();
        const { propertyFilterWrapper: wrapper } = renderComponent({ onChange: handleChange });

        act(() => wrapper.setInputValue('string='));
        act(() => wrapper.findNativeInput().keydown(KeyCode.down));
        act(() => wrapper.findNativeInput().keydown(KeyCode.down));
        act(() => wrapper.findNativeInput().keydown(KeyCode.enter));
        expect(wrapper.findNativeInput().getElement()).toHaveValue('');
        expect(handleChange).toHaveBeenLastCalledWith(
          expect.objectContaining({
            detail: { tokens: [{ value: 'value1', operator: '=', propertyKey: 'string' }], operation: 'and' },
          })
        );
        expect(wrapper.findDropdown()?.findOpenDropdown()).toBeFalsy();
      });
      test('inserts operator when property is selected if only one operator is defined for that property', () => {
        const { propertyFilterWrapper: wrapper } = renderComponent();

        act(() => wrapper.findNativeInput().focus());
        act(() => wrapper.findNativeInput().keydown(KeyCode.down));
        act(() => wrapper.findNativeInput().keydown(KeyCode.down));
        act(() => wrapper.findNativeInput().keydown(KeyCode.down));
        act(() => wrapper.findNativeInput().keydown(KeyCode.enter));
        expect(wrapper.findNativeInput().getElement()).toHaveValue('default = ');
        expect(wrapper.findDropdown()?.findOpenDropdown()).toBeTruthy();
      });
    });
  });

  describe('count text', () => {
    test('is hidden when there are no filtering tokens', () => {
      const { propertyFilterWrapper: wrapper } = renderComponent({ countText: '5 matches' });
      expect(wrapper.findResultsCount()!.getElement()).toBeEmptyDOMElement();
    });
    test('is visible when there is at least 1 token', () => {
      const { propertyFilterWrapper: wrapper } = renderComponent({
        countText: '5 matches',
        query: { tokens: [{ propertyKey: 'string', value: 'first', operator: ':' }], operation: 'or' },
      });
      expect(wrapper.findResultsCount()!.getElement()).toHaveTextContent('5 matches');
    });
  });

  describe('filtering  tokens', () => {
    describe('content', () => {
      test('free text token', () => {
        const { propertyFilterWrapper: wrapper } = renderComponent({
          query: { tokens: [{ value: 'first', operator: ':' }], operation: 'or' },
        });
        expect(wrapper.findTokens()![0].getElement()).toHaveTextContent('first');
      });
      test('negated free text token', () => {
        const { propertyFilterWrapper: wrapper } = renderComponent({
          query: { tokens: [{ value: 'first', operator: '!:' }], operation: 'or' },
        });
        expect(wrapper.findTokens()![0].getElement()).toHaveTextContent('!: first');
      });
      test('property token', () => {
        const { propertyFilterWrapper: wrapper } = renderComponent({
          query: { tokens: [{ propertyKey: 'range', value: 'value', operator: '>' }], operation: 'or' },
        });
        expect(wrapper.findTokens()![0].getElement()).toHaveTextContent('range > value');
      });
    });
    describe('join operation control', () => {
      let wrapper: PropertyFilterWrapper;
      const handleChange = jest.fn();
      beforeEach(() => {
        wrapper = renderComponent({
          query: {
            tokens: [
              { propertyKey: 'range', value: 'value', operator: '>' },
              { propertyKey: 'string', value: 'value1', operator: ':' },
            ],
            operation: 'or',
          },
          onChange: handleChange,
        }).propertyFilterWrapper;
        handleChange.mockReset();
      });
      test('is missing on the first token', () => {
        expect(wrapper.findTokens()![0].findTokenOperation()).toBeNull();
      });
      test('can be used to change the operation', () => {
        const secondToken = wrapper.findTokens()![1];
        act(() => secondToken.findTokenOperation()!.openDropdown());
        act(() => secondToken.findTokenOperation()!.selectOption(1));
        expect(handleChange).toHaveBeenCalledWith(
          expect.objectContaining({ detail: expect.objectContaining({ operation: 'and' }) })
        );
      });
    });
    describe('dismiss button', () => {
      test('causes onChange to fire, removing the token', () => {
        const handleChange = jest.fn();
        const { propertyFilterWrapper: wrapper } = renderComponent({
          onChange: handleChange,
          query: { tokens: [{ value: 'first', operator: '!:' }], operation: 'or' },
        });
        act(() => wrapper.findTokens()![0].findRemoveButton()!.click());
        expect(handleChange).toHaveBeenCalledWith(expect.objectContaining({ detail: { tokens: [], operation: 'or' } }));
      });
      test('moves the focus to the input, when pressed', () => {
        const { propertyFilterWrapper: wrapper } = renderComponent({
          query: { tokens: [{ value: 'first', operator: '!:' }], operation: 'or' },
        });
        act(() => wrapper.findTokens()![0].findRemoveButton()!.click());
        expect(wrapper.findNativeInput().getElement()).toHaveFocus();
      });
      test('has a label from i18nStrings', () => {
        const { propertyFilterWrapper: wrapper } = renderComponent({
          query: { tokens: [{ value: 'first', operator: '!:' }], operation: 'or' },
        });
        expect(wrapper.findTokens()![0].findRemoveButton().getElement()).toHaveAttribute(
          'aria-label',
          'Remove token undefined !: first'
        );
      });
      test('disabled, when the component is disabled', () => {
        const handleChange = jest.fn();
        const { propertyFilterWrapper: wrapper } = renderComponent({
          onChange: handleChange,
          query: { tokens: [{ value: 'first', operator: '!:' }], operation: 'or' },
          disabled: true,
        });
        expect(wrapper.findTokens()![0].findRemoveButton().getElement()).toBeDisabled();
        act(() => wrapper.findTokens()![0].findRemoveButton()!.click());
        expect(handleChange).not.toHaveBeenCalled();
      });
    });
  });

  describe('token editor', () => {
    const openEditor = (wrapper: PropertyFilterWrapper) => {
      const tokenWrapper = createWrapper(wrapper.findTokens()![0].getElement());
      const popoverWrapper = tokenWrapper.findPopover()!;
      act(() => popoverWrapper.findTrigger().click());
      const contentWrapper = popoverWrapper.findContent()!;
      return [contentWrapper, popoverWrapper] as const;
    };
    test('uses i18nStrings to populate header', () => {
      const { propertyFilterWrapper: wrapper } = renderComponent({
        query: { tokens: [{ value: 'first', operator: '!:' }], operation: 'or' },
      });
      const [, popoverWrapper] = openEditor(wrapper);
      expect(popoverWrapper.findHeader()!.getElement()).toHaveTextContent(i18nStrings.editTokenHeader);
    });
    describe('form controls content', () => {
      test('default', () => {
        const { propertyFilterWrapper: wrapper } = renderComponent({
          query: { tokens: [{ propertyKey: 'string', value: 'first', operator: '!:' }], operation: 'or' },
        });
        const [contentWrapper] = openEditor(wrapper);
        expect(contentWrapper.getElement()).toHaveTextContent(
          'PropertystringOperator!:Does not containValueCancelApply'
        );
        const propertySelectWrapper = findPropertySelector(contentWrapper);
        act(() => propertySelectWrapper.openDropdown());
        expect(
          propertySelectWrapper
            .findDropdown()
            .findOptions()!
            .map(optionWrapper => optionWrapper.getElement().textContent)
        ).toEqual(['All properties', 'string', 'string-other', 'default', 'string!=', 'range']);

        const operatorSelectWrapper = findOperatorSelector(contentWrapper);
        act(() => operatorSelectWrapper.openDropdown());
        expect(
          operatorSelectWrapper
            .findDropdown()
            .findOptions()!
            .map(optionWrapper => optionWrapper.getElement().textContent)
        ).toEqual(['=Equals', '!=Does not equal', ':Contains', '!:Does not contain']);

        const valueSelectWrapper = findValueSelector(contentWrapper);
        act(() => valueSelectWrapper.focus());
        expect(
          valueSelectWrapper
            .findDropdown()
            .findOptions()!
            .map(optionWrapper => optionWrapper.getElement().textContent)
        ).toEqual(['value1', 'value2']);
      });
      test('with free text disabled', () => {
        const { propertyFilterWrapper: wrapper } = renderComponent({
          disableFreeTextFiltering: true,
          query: { tokens: [{ propertyKey: 'string', value: 'first', operator: '!:' }], operation: 'or' },
        });
        const [contentWrapper] = openEditor(wrapper);
        expect(contentWrapper.getElement()).toHaveTextContent(
          'PropertystringOperator!:Does not containValueCancelApply'
        );
        const propertySelectWrapper = findPropertySelector(contentWrapper);
        act(() => propertySelectWrapper.openDropdown());
        expect(
          propertySelectWrapper
            .findDropdown()
            .findOptions()!
            .map(optionWrapper => optionWrapper.getElement().textContent)
        ).toEqual(['string', 'string-other', 'default', 'string!=', 'range']);
      });
      test('preserves fields, when one is edited', () => {
        const { propertyFilterWrapper: wrapper } = renderComponent({
          disableFreeTextFiltering: true,
          query: { tokens: [{ propertyKey: 'string', value: 'first', operator: ':' }], operation: 'or' },
        });
        const [contentWrapper] = openEditor(wrapper);
        const propertySelectWrapper = findPropertySelector(contentWrapper);
        const operatorSelectWrapper = findOperatorSelector(contentWrapper);
        const valueSelectWrapper = findValueSelector(contentWrapper);

        act(() => propertySelectWrapper.openDropdown());
        act(() => propertySelectWrapper.selectOption(2));
        expect(propertySelectWrapper.findTrigger().getElement()).toHaveTextContent('string-other');
        expect(operatorSelectWrapper.findTrigger().getElement()).toHaveTextContent(':Contains');
        expect(valueSelectWrapper.findNativeInput().getElement()).toHaveAttribute('value', 'first');

        act(() => operatorSelectWrapper.openDropdown());
        act(() => operatorSelectWrapper.selectOption(1));
        expect(propertySelectWrapper.findTrigger().getElement()).toHaveTextContent('string-other');
        expect(operatorSelectWrapper.findTrigger().getElement()).toHaveTextContent('=Equals');
        expect(valueSelectWrapper.findNativeInput().getElement()).toHaveAttribute('value', 'first');

        act(() => valueSelectWrapper.setInputValue('123'));
        expect(propertySelectWrapper.findTrigger().getElement()).toHaveTextContent('string-other');
        expect(operatorSelectWrapper.findTrigger().getElement()).toHaveTextContent('=Equals');
        expect(valueSelectWrapper.findNativeInput().getElement()).toHaveAttribute('value', '123');
      });
      test('might change the operation if the old one is not supported, when switching the property', () => {
        const { propertyFilterWrapper: wrapper } = renderComponent({
          query: { tokens: [{ propertyKey: 'range', value: '123', operator: '>' }], operation: 'or' },
        });
        const [contentWrapper] = openEditor(wrapper);
        const propertySelectWrapper = findPropertySelector(contentWrapper);
        const operatorSelectWrapper = findOperatorSelector(contentWrapper);

        act(() => propertySelectWrapper.openDropdown());
        act(() => propertySelectWrapper.selectOption(2));
        expect(propertySelectWrapper.findTrigger().getElement()).toHaveTextContent('string');
        expect(operatorSelectWrapper.findTrigger().getElement()).toHaveTextContent('=Equals');

        act(() => propertySelectWrapper.openDropdown());
        act(() => propertySelectWrapper.selectOption(1));
        expect(propertySelectWrapper.findTrigger().getElement()).toHaveTextContent('All properties');
        expect(operatorSelectWrapper.findTrigger().getElement()).toHaveTextContent(':Contains');
      });
    });
    describe('exit actions', () => {
      let wrapper: PropertyFilterWrapper;
      let contentWrapper: ElementWrapper;
      let popoverWrapper: PopoverWrapper;
      const handleChange = jest.fn();
      beforeEach(() => {
        handleChange.mockReset();
        const { propertyFilterWrapper } = renderComponent({
          onChange: handleChange,
          query: { tokens: [{ propertyKey: 'string', value: 'first', operator: '!:' }], operation: 'or' },
        });
        wrapper = propertyFilterWrapper;
        const openResult = openEditor(wrapper);
        contentWrapper = openResult[0];
        popoverWrapper = openResult[1];
      });
      test('dismiss button closes the popover and discards the changes', () => {
        const valueAutosuggestWrapper = findValueSelector(contentWrapper);
        act(() => valueAutosuggestWrapper.setInputValue('123'));
        const operatorSelectWrapper = findOperatorSelector(contentWrapper);
        act(() => operatorSelectWrapper.openDropdown());
        act(() => operatorSelectWrapper.selectOption(1));
        const propertySelectWrapper = findPropertySelector(contentWrapper);
        act(() => propertySelectWrapper.openDropdown());
        act(() => propertySelectWrapper.selectOption(1));

        act(() => popoverWrapper.findDismissButton()!.click());
        expect(popoverWrapper.findContent()).toBeNull();
        expect(handleChange).not.toHaveBeenCalled();

        const openResult = openEditor(wrapper);
        contentWrapper = openResult[0];
        expect(contentWrapper.getElement()).toHaveTextContent(
          'PropertystringOperator!:Does not containValueCancelApply'
        );
      });
      test('cancel button closes the popover and discards the changes', () => {
        const valueAutosuggestWrapper = findValueSelector(contentWrapper);
        act(() => valueAutosuggestWrapper.setInputValue('123'));
        const operatorSelectWrapper = findOperatorSelector(contentWrapper);
        act(() => operatorSelectWrapper.openDropdown());
        act(() => operatorSelectWrapper.selectOption(1));
        const propertySelectWrapper = findPropertySelector(contentWrapper);
        act(() => propertySelectWrapper.openDropdown());
        act(() => propertySelectWrapper.selectOption(1));

        act(() => contentWrapper.findButton(`.${styles['token-editor-cancel']}`)!.click());
        popoverWrapper = wrapper.findTokens()[0]!.find('*')!.findPopover()!;
        expect(popoverWrapper.findContent()).toBeNull();
        expect(handleChange).not.toHaveBeenCalled();

        const openResult = openEditor(wrapper);
        contentWrapper = openResult[0];
        expect(contentWrapper.getElement()).toHaveTextContent(
          'PropertystringOperator!:Does not containValueCancelApply'
        );
      });
      test('submit button closes the popover and saves the changes', () => {
        const valueAutosuggestWrapper = findValueSelector(contentWrapper);
        act(() => valueAutosuggestWrapper.setInputValue('123'));
        const operatorSelectWrapper = findOperatorSelector(contentWrapper);
        act(() => operatorSelectWrapper.openDropdown());
        act(() => operatorSelectWrapper.selectOption(1));
        const propertySelectWrapper = findPropertySelector(contentWrapper);
        act(() => propertySelectWrapper.openDropdown());
        act(() => propertySelectWrapper.selectOption(1));

        act(() => contentWrapper.findButton(`.${styles['token-editor-submit']}`)!.click());
        popoverWrapper = wrapper.findTokens()[0]!.find('*')!.findPopover()!;
        expect(popoverWrapper.findContent()).toBeNull();
        expect(handleChange).toHaveBeenCalledWith(
          expect.objectContaining({
            detail: { operation: 'or', tokens: [{ operator: ':', propertyKey: undefined, value: '123' }] },
          })
        );
      });
    });
  });
  describe('tokens collapsed/expanded toggle', () => {
    test('is hidden, when there are no filtering tokens', () => {
      const { propertyFilterWrapper: wrapper } = renderComponent({ tokenLimit: 0 });
      expect(wrapper.findTokenToggle()).toBeNull();
    });
    test('is hidden, when tokenLimit is not provided', () => {
      const { propertyFilterWrapper: wrapper } = renderComponent({
        query: { tokens: [{ propertyKey: 'string', value: 'first', operator: ':' }], operation: 'or' },
      });
      expect(wrapper.findTokenToggle()).toBeNull();
    });
    test('toggles the visibility of tokens past the limit', () => {
      const { propertyFilterWrapper: wrapper } = renderComponent({
        tokenLimit: 1,
        query: {
          tokens: [
            { propertyKey: 'string', value: 'first', operator: ':' },
            { propertyKey: 'string', value: 'second', operator: ':' },
          ],
          operation: 'or',
        },
      });
      expect(wrapper.findTokenToggle()!.getElement()).toHaveTextContent(i18nStrings.tokenLimitShowMore);
      expect(wrapper.findTokens()!).toHaveLength(1);
      expect(wrapper.findTokens()![0].findLabel().getElement()).toHaveTextContent('string : first');
      // show more
      act(() => wrapper.findTokenToggle()!.find('button')!.click());
      expect(wrapper.findTokenToggle()!.getElement()).toHaveTextContent(i18nStrings.tokenLimitShowFewer);
      expect(wrapper.findTokens()!).toHaveLength(2);
      // show fewer
      act(() => wrapper.findTokenToggle()!.find('button')!.click());
      expect(wrapper.findTokenToggle()!.getElement()).toHaveTextContent(i18nStrings.tokenLimitShowMore);
      expect(wrapper.findTokens()!).toHaveLength(1);
    });
  });

  describe('"remove all tokens" button', () => {
    test('is hidden, when there are no filtering tokens', () => {
      const { propertyFilterWrapper: wrapper } = renderComponent();
      expect(wrapper.findRemoveAllButton()).toBeNull();
    });
    test('a11y label', () => {
      const { propertyFilterWrapper: wrapper } = renderComponent({
        query: { tokens: [{ propertyKey: 'string', value: 'first', operator: ':' }], operation: 'or' },
      });
      expect(wrapper.findRemoveAllButton()!.getElement()).toHaveTextContent(i18nStrings.clearFiltersText);
    });
    test('causes onChange to fire, removing all tokens', () => {
      const spy = jest.fn();
      const { propertyFilterWrapper: wrapper } = renderComponent({
        query: { tokens: [{ propertyKey: 'string', value: 'first', operator: ':' }], operation: 'or' },
        onChange: spy,
      });
      act(() => wrapper.findRemoveAllButton()!.click());
      expect(spy).toHaveBeenCalledWith(expect.objectContaining({ detail: { tokens: [], operation: 'or' } }));
    });
    test('moves focus to the input', () => {
      const { propertyFilterWrapper: wrapper } = renderComponent({
        query: { tokens: [{ propertyKey: 'string', value: 'first', operator: ':' }], operation: 'or' },
      });
      act(() => wrapper.findRemoveAllButton()!.click());
      expect(wrapper.findNativeInput()!.getElement()).toHaveFocus();
    });
    test('disabled, when the component is disabled', () => {
      const { propertyFilterWrapper: wrapper } = renderComponent({
        disabled: true,
        query: { tokens: [{ propertyKey: 'string', value: 'first', operator: ':' }], operation: 'or' },
      });
      expect(wrapper.findRemoveAllButton()!.getElement()).toBeDisabled();
    });
  });
  test('`expandToViewport` property test utils', () => {
    const { propertyFilterWrapper: wrapper } = renderComponent({
      expandToViewport: true,
      query: { tokens: [{ propertyKey: 'string', value: 'first', operator: ':' }], operation: 'or' },
      filteringStatusType: 'error',
      filteringRecoveryText: 'recovery',
      filteringErrorText: 'error',
    });
    // find dropdown returns open dropdown
    expect(wrapper.findDropdown({ expandToViewport: true })).toBeNull();
    wrapper.findNativeInput().focus();
    expect(wrapper.findDropdown({ expandToViewport: true })!.getElement()).not.toBeNull();
    expect(wrapper.findDropdown({ expandToViewport: true }).findOpenDropdown()!.getElement()).not.toBeNull();
    wrapper.setInputValue('string');
    expect(wrapper.findEnteredTextOption({ expandToViewport: true })!.getElement()).toHaveTextContent('Use: "string"');
    expect(wrapper.findErrorRecoveryButton({ expandToViewport: true })!.getElement()).toHaveTextContent('recovery');
    expect(wrapper.findStatusIndicator({ expandToViewport: true })!.getElement()).toHaveTextContent('error');
    wrapper.selectSuggestion(2, { expandToViewport: true });
    expect(wrapper.findNativeInput().getElement()).toHaveValue('string != ');
  });
});
