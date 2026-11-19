// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, render, waitFor } from '@testing-library/react';

import { TagControl, TagControlProps } from '../../../lib/components/tag-editor/internal';
import createWrapper, { AutosuggestWrapper } from '../../../lib/components/test-utils/dom';

const i18n = {
  placeholder: 'placeholder',
  errorText: 'errorText',
  loadingText: 'loadingText',
  suggestionText: 'suggestionText',
  tooManySuggestionText: 'tooManySuggestionText',
  enteredTextLabel: () => 'enteredTextLabel',
};

const defaultProps: TagControlProps = {
  ...i18n,
  row: 0,
  value: '',
  readOnly: false,
  defaultOptions: [],
  limit: 50,
  onChange: () => {},
};

interface RenderResult {
  wrapper: AutosuggestWrapper;
  onChangeSpy: jest.Mock;
}

function renderTagControl(props: Partial<TagControlProps> = {}): RenderResult {
  const onChangeSpy = jest.fn();
  const { container } = render(<TagControl {...defaultProps} onChange={onChangeSpy} {...props} />);
  const wrapper = createWrapper(container).findAutosuggest()!;

  return { wrapper, onChangeSpy };
}

function mockPromise<T>() {
  let resolve: (data: T) => void = () => {};
  let reject = () => {};

  const promise = new Promise<T>((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });

  return { resolve, reject, promise };
}

describe('Tag Editor Control', () => {
  describe('i18n', () => {
    test('should display placeholder property', () => {
      const { wrapper } = renderTagControl();
      expect(wrapper.findNativeInput().getElement()).toHaveAttribute('placeholder', i18n.placeholder);
    });

    test('should display suggestion i18n value when the dataset is less than the display limit', () => {
      const { wrapper } = renderTagControl();
      wrapper.focus();
      expect(wrapper.findDropdown().findFooterRegion()!.getElement()).toHaveTextContent(i18n.suggestionText);
    });

    test('should display tooManyKeysSuggestion i18n value when the dataset is more than the display limit', () => {
      const { wrapper } = renderTagControl({ defaultOptions: [{ value: '1' }, { value: '2' }], limit: 1 });
      wrapper.focus();
      expect(wrapper.findDropdown().findFooterRegion()!.getElement()).toHaveTextContent(i18n.tooManySuggestionText);
    });
  });

  test('should display all the existing key options when the dataset is less than the display limit', () => {
    const { wrapper } = renderTagControl({ defaultOptions: [{ value: 'key' }] });
    wrapper.focus();
    expect(wrapper.findDropdown().findOptions()).toHaveLength(1);
  });

  test('should display an empty array when the dataset is more than the display limit', () => {
    const { wrapper } = renderTagControl({ defaultOptions: [{ value: '1' }, { value: '2' }], limit: 1 });
    wrapper.focus();
    expect(wrapper.findDropdown().findOptions()).toHaveLength(0);
  });

  test('should call onChange with current value and given row', () => {
    const { wrapper, onChangeSpy } = renderTagControl({ row: 42 });
    wrapper.setInputValue('test');
    expect(onChangeSpy).toHaveBeenCalledWith('test', 42);
  });

  describe('onRequest', () => {
    test('should call onRequest with the latest value', async () => {
      const onRequestSpy = jest.fn(() => Promise.resolve([]));
      const { wrapper, onChangeSpy } = renderTagControl({ onRequest: onRequestSpy });
      wrapper.setInputValue('value1');
      wrapper.setInputValue('value2');
      wrapper.setInputValue('value3');
      wrapper.setInputValue('value4');
      expect(onChangeSpy).toHaveBeenCalledTimes(4);

      await waitFor(() => {
        expect(onRequestSpy).toHaveBeenCalledTimes(1);
        expect(onRequestSpy).toHaveBeenCalledWith('value4');
      });
    });

    test('should set and clear loading states', async () => {
      const { resolve, promise } = mockPromise<string[]>();

      const { wrapper } = renderTagControl({ onRequest: () => promise });
      wrapper.focus();
      expect(wrapper.findDropdown().findFooterRegion()!.getElement()).toHaveTextContent(i18n.loadingText);

      act(() => resolve([]));
      await waitFor(() =>
        expect(wrapper.findDropdown().findFooterRegion()!.getElement()).toHaveTextContent(i18n.suggestionText)
      );
    });

    test('should set loading state and set an error state on fail', async () => {
      const { reject, promise } = mockPromise<string[]>();

      const { wrapper } = renderTagControl({ onRequest: () => promise });
      wrapper.focus();
      expect(wrapper.findDropdown().findFooterRegion()!.getElement()).toHaveTextContent(i18n.loadingText);

      act(() => reject());
      await waitFor(() =>
        expect(wrapper.findDropdown().findFooterRegion()!.getElement()).toHaveTextContent(i18n.errorText)
      );
    });

    test('does not set the loading state, when the value is empty and the list of options is not empty', async () => {
      const { wrapper } = renderTagControl({ onRequest: () => Promise.resolve([]) });
      wrapper.focus();
      await waitFor(() =>
        expect(wrapper.findDropdown().findFooterRegion()!.getElement()).toHaveTextContent(i18n.suggestionText)
      );
    });
  });
});
