// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';

import { KeyCode } from '@cloudscape-design/test-utils-core/utils';

import { AutosuggestProps } from '../../../lib/components/autosuggest/interfaces';
import PropertyFilterAutosuggest from '../../../lib/components/property-filter/property-filter-autosuggest';
import createWrapper from '../../../lib/components/test-utils/dom';
import AutosuggestWrapper from '../../../lib/components/test-utils/dom/autosuggest';

const options: AutosuggestProps.Options = [
  { value: '123', label: '123' },
  { value: 'abc', label: 'abc' },
];

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
        statusType="finished"
        disableBrowserAutocorrect={false}
      />
    ).wrapper;
    wrapper.focus();
    expect(wrapper.findEnteredTextOption()).toBeNull();
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

  test('focuses first focusable custom form element when down arrow is pressed', () => {
    const { wrapper } = renderAutosuggest(
      <PropertyFilterAutosuggest
        options={[]}
        enteredTextLabel={() => ''}
        value=""
        onChange={() => {}}
        customForm={
          <div>
            <button id="first-focusable">first focusable</button>
            <button id="second-focusable">second focusable</button>
          </div>
        }
      />
    );
    wrapper.focus();

    wrapper.findNativeInput().keydown(KeyCode.up);
    expect(wrapper.find('#first-focusable')!.getElement()).not.toHaveFocus();

    wrapper.findNativeInput().keydown(KeyCode.down);
    expect(wrapper.find('#first-focusable')!.getElement()).toHaveFocus();
  });
});
