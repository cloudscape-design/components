// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';
import createWrapper from '../../../lib/components/test-utils/dom';
import AutosuggestWrapper from '../../../lib/components/test-utils/dom/autosuggest';
import { KeyCode } from '@cloudscape-design/test-utils-core/utils';
import { AutosuggestProps } from '../../../lib/components/autosuggest/interfaces';

import PropertyFilterAutosuggest from '../../../lib/components/property-filter/property-filter-autosuggest';

const options: AutosuggestProps.Options = [{ value: '123' }, { value: 'abc' }];

function renderAutosuggest(jsx: React.ReactElement) {
  const { container, rerender } = render(jsx);
  const wrapper = createWrapper(container).findAutosuggest()!;
  return { wrapper, rerender };
}

describe('Property filter autosuggest', () => {
  describe('filterText', () => {
    let wrapper: AutosuggestWrapper;
    beforeEach(() => {
      wrapper = renderAutosuggest(
        <PropertyFilterAutosuggest
          options={options}
          enteredTextLabel={value => value}
          value={'123'}
          onChange={() => {}}
          filterText={'abc'}
        />
      ).wrapper;
      wrapper.focus();
      wrapper.setInputValue('123');
    });
    test('is used for filtering', () => {
      expect(wrapper.findDropdown().findOptions()).toHaveLength(1);
      expect(wrapper.findDropdown().findOption(1)!.getElement()).toHaveTextContent('abc');
    });
    test('is used for highlighting', () => {
      expect(wrapper.findDropdown().findHighlightedMatches()[0].getElement()).toHaveTextContent('abc');
    });
    test('is not used for the enteredText- option', () => {
      expect(wrapper.findEnteredTextOption()!.getElement()).toHaveTextContent('123');
    });
  });
  describe('onOptionClick', () => {
    const handleSelectedSpy = jest.fn();
    let wrapper: AutosuggestWrapper;
    beforeEach(() => {
      handleSelectedSpy.mockReset();
      wrapper = renderAutosuggest(
        <PropertyFilterAutosuggest
          options={options}
          enteredTextLabel={() => ''}
          onOptionClick={handleSelectedSpy}
          value=""
          onChange={() => {}}
          filteringType="auto"
          statusType="finished"
          disableBrowserAutocorrect={false}
        />
      ).wrapper;
      wrapper.focus();
    });
    test('called when selecting an item with a mouse', () => {
      wrapper.selectSuggestion(1);
      expect(handleSelectedSpy).toHaveBeenCalledWith(
        expect.objectContaining({ detail: { ...options[0], option: options[0] } })
      );
    });
    test('called when selecting an item with a keyboard', () => {
      wrapper.findNativeInput().keydown(KeyCode.down);
      wrapper.findNativeInput().keydown(KeyCode.enter);
      expect(handleSelectedSpy).toHaveBeenCalledWith(
        expect.objectContaining({ detail: { ...options[0], option: options[0] } })
      );
    });
    test('could be prevented to stop dropdown from closing', () => {
      handleSelectedSpy.mockImplementation(e => {
        e.preventDefault();
      });
      wrapper.selectSuggestion(1);
      expect(handleSelectedSpy).toHaveBeenCalled();
      expect(wrapper.findDropdown().findOpenDropdown()).toBeTruthy();
    });
    test('highlight gets reset when selecting an option, even if the dropdown did not close', () => {
      handleSelectedSpy.mockImplementation(e => {
        e.preventDefault();
      });
      wrapper.findNativeInput().keydown(KeyCode.down);
      expect(wrapper.findDropdown().findHighlightedOption()!.getElement()).toHaveTextContent('123');
      wrapper.findNativeInput().keydown(KeyCode.enter);
      expect(wrapper.findDropdown().findOpenDropdown()).toBeTruthy();
      expect(wrapper.findDropdown().findHighlightedOption()).toBeNull();
    });
  });
  test('the list of suggestions to be filtered, when the input is focused', () => {
    const wrapper: AutosuggestWrapper = renderAutosuggest(
      <PropertyFilterAutosuggest
        options={options}
        enteredTextLabel={() => ''}
        value="123"
        onChange={() => {}}
        filteringType="auto"
        statusType="finished"
        disableBrowserAutocorrect={false}
      />
    ).wrapper;
    wrapper.focus();
    expect(wrapper.findDropdown().findOptions()).toHaveLength(1);
  });
  test('hideEnteredTextOption: stops "entered text" option from being created', () => {
    const wrapper: AutosuggestWrapper = renderAutosuggest(
      <PropertyFilterAutosuggest
        options={options}
        enteredTextLabel={() => ''}
        hideEnteredTextOption={true}
        value="123"
        onChange={() => {}}
        filteringType="auto"
        statusType="finished"
        disableBrowserAutocorrect={false}
      />
    ).wrapper;
    wrapper.focus();
    expect(wrapper.findEnteredTextOption()).toBeNull();
  });
  describe('onOpen', () => {
    let wrapper: AutosuggestWrapper;
    beforeEach(() => {
      wrapper = renderAutosuggest(
        <PropertyFilterAutosuggest
          options={options}
          enteredTextLabel={() => ''}
          onOpen={e => e.preventDefault()}
          value="123"
          onChange={() => {}}
          filteringType="auto"
          statusType="finished"
          disableBrowserAutocorrect={false}
        />
      ).wrapper;
      wrapper.focus();
    });
    test('stops the dropdown from opening, if prevented', () => {
      expect(wrapper.findDropdown().findOpenDropdown()).toBeNull();
    });
    test('the dropdown can be reopened by clicking on the input', () => {
      wrapper.findNativeInput().click();
      expect(wrapper.findDropdown().findOpenDropdown()).not.toBeNull();
    });
  });
  describe('disabled option', () => {
    let wrapper: AutosuggestWrapper;
    const handleSelectedSpy = jest.fn();
    const withDisabledOptions = [
      { value: 'Option 0' },
      {
        label: 'Group 1',
        options: [{ value: 'Option 1', disabled: true }, { value: 'Option 2' }],
      },
    ];
    beforeEach(() => {
      wrapper = renderAutosuggest(
        <PropertyFilterAutosuggest
          options={withDisabledOptions}
          enteredTextLabel={() => ''}
          onSelect={handleSelectedSpy}
          value=""
          onChange={() => {}}
        />
      ).wrapper;
      wrapper.focus();
    });
    test('should highlight disabled option', () => {
      wrapper.findNativeInput().keydown(KeyCode.down);
      wrapper.findNativeInput().keydown(KeyCode.down);
      expect(wrapper.findDropdown().findHighlightedOption()!.getElement()).toHaveTextContent('Option 1');
    });
    test('should not select disabled option', () => {
      wrapper.findNativeInput().keydown(KeyCode.down);
      wrapper.findNativeInput().keydown(KeyCode.down);
      wrapper.findNativeInput().keydown(KeyCode.enter);
      expect(handleSelectedSpy).not.toHaveBeenCalled();
    });
  });
  describe('keyboard interactions', () => {
    test('selects option on enter', () => {
      const onChange = jest.fn();
      const onOptionClick = jest.fn();
      const { wrapper } = renderAutosuggest(
        <PropertyFilterAutosuggest
          value=""
          options={options}
          onChange={onChange}
          onOptionClick={onOptionClick}
          enteredTextLabel={value => value}
        />
      );
      wrapper.findNativeInput().keydown(KeyCode.down);
      wrapper.findNativeInput().keydown(KeyCode.enter);
      expect(onChange).toBeCalledWith(expect.objectContaining({ detail: { value: '123' } }));
      expect(onOptionClick).toBeCalledWith(
        expect.objectContaining({ detail: { option: { value: '123' }, value: '123' } })
      );
    });

    test('closes dropdown on enter and opens it on arrow keys', () => {
      const { wrapper } = renderAutosuggest(
        <PropertyFilterAutosuggest
          value=""
          options={options}
          onChange={() => undefined}
          enteredTextLabel={value => value}
        />
      );
      expect(wrapper.findDropdown()!.findOpenDropdown()).toBe(null);

      wrapper.findNativeInput().keydown(KeyCode.down);
      expect(wrapper.findDropdown()!.findOpenDropdown()).not.toBe(null);

      wrapper.findNativeInput().keydown(KeyCode.enter);
      expect(wrapper.findDropdown()!.findOpenDropdown()).toBe(null);

      wrapper.findNativeInput().keydown(KeyCode.up);
      expect(wrapper.findDropdown()!.findOpenDropdown()).not.toBe(null);
    });

    test('onOptionClick can prevent dropdown from closing', () => {
      const onChange = jest.fn();
      const { wrapper } = renderAutosuggest(
        <PropertyFilterAutosuggest
          value=""
          options={options}
          onChange={onChange}
          onOptionClick={event => event.preventDefault()}
          enteredTextLabel={value => value}
        />
      );
      expect(wrapper.findDropdown()!.findOpenDropdown()).toBe(null);

      wrapper.findNativeInput().keydown(KeyCode.down);
      expect(wrapper.findDropdown()!.findOpenDropdown()).not.toBe(null);

      wrapper.findNativeInput().keydown(KeyCode.enter);
      expect(onChange).toBeCalledWith(expect.objectContaining({ detail: { value: '123' } }));
      expect(wrapper.findDropdown()!.findOpenDropdown()).not.toBe(null);
    });

    test('closes dropdown and clears input on esc', () => {
      const onChange = jest.fn();
      const { wrapper, rerender } = renderAutosuggest(
        <PropertyFilterAutosuggest
          value="123"
          options={options}
          onChange={onChange}
          enteredTextLabel={value => value}
        />
      );
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

      rerender(
        <PropertyFilterAutosuggest value="" options={options} onChange={onChange} enteredTextLabel={value => value} />
      );

      wrapper.findNativeInput().keydown(KeyCode.escape);
      expect(wrapper.findDropdown()!.findOpenDropdown()).toBe(null);
      expect(onChange).toBeCalledTimes(1);
    });
  });
});
