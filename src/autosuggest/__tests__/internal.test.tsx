// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';
import createWrapper from '../../../lib/components/test-utils/dom';
import InternalAutosuggest from '../../../lib/components/autosuggest/internal';
import AutosuggestWrapper from '../../../lib/components/test-utils/dom/autosuggest';
import { KeyCode } from '@cloudscape-design/test-utils-core/utils';
import { AutosuggestProps } from '../../../lib/components/autosuggest/interfaces';

const options: AutosuggestProps.Options = [{ value: '123' }, { value: 'abc' }];

function renderAutosuggest(jsx: React.ReactElement) {
  const { container, rerender } = render(jsx);
  const wrapper = createWrapper(container).findAutosuggest()!;
  return { wrapper, rerender };
}

describe('Internal autosuggest features', () => {
  describe('`__filterText`', () => {
    let wrapper: AutosuggestWrapper;
    beforeEach(() => {
      wrapper = renderAutosuggest(
        <InternalAutosuggest
          options={options}
          enteredTextLabel={value => value}
          value={'123'}
          onChange={() => {}}
          __filterText={'abc'}
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
    test('is not used for the `enteredText-` option', () => {
      expect(wrapper.findEnteredTextOption()!.getElement()).toHaveTextContent('123');
    });
  });

  test('`__disableShowAll`: forces the list of suggestions to be filtered, when the input is focused', () => {
    const wrapper: AutosuggestWrapper = renderAutosuggest(
      <InternalAutosuggest
        options={options}
        enteredTextLabel={() => ''}
        __disableShowAll={true}
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
  test('`__hideEnteredTextOption`: stops "entered text" option from being created', () => {
    const wrapper: AutosuggestWrapper = renderAutosuggest(
      <InternalAutosuggest
        options={options}
        enteredTextLabel={() => ''}
        __hideEnteredTextOption={true}
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
  describe('`__onOpen`', () => {
    let wrapper: AutosuggestWrapper;
    beforeEach(() => {
      wrapper = renderAutosuggest(
        <InternalAutosuggest
          options={options}
          enteredTextLabel={() => ''}
          __onOpen={e => e.preventDefault()}
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
  describe('`_disabled option`', () => {
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
        <InternalAutosuggest
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
});
