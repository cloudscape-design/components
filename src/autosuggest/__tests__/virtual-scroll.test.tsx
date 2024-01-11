// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect } from 'react';
import { render } from '@testing-library/react';
import Autosuggest, { AutosuggestProps } from '../../../lib/components/autosuggest';
import createWrapper from '../../../lib/components/test-utils/dom';
import { KeyCode } from '@cloudscape-design/test-utils-core/utils';
import { range } from 'lodash';

export const scrollToIndex = jest.fn();
export const measureElement = jest.fn();

jest.mock('../../../lib/components/internal/hooks/use-virtualizer', () => ({
  useVirtualizer({
    count,
    getScrollElement,
    estimateSize,
  }: {
    count: number;
    getScrollElement: () => Element;
    estimateSize: () => number;
  }) {
    useEffect(() => {
      const element = getScrollElement();
      if (!element) {
        throw new Error('Scroll element is missing');
      }
      const size = estimateSize ? estimateSize() : 0;
      if (isNaN(size)) {
        throw new Error('Invalid estimated size');
      }
    });
    return {
      getVirtualItems: () =>
        range(0, count)
          .slice(0, 10)
          .map((_, index) => ({ key: index, index, start: index, end: index + 1, size: 1, lane: 0 })),
      getTotalSize: () => 10,
      scrollToIndex,
      measureElement,
    };
  },
}));

const defaultProps: AutosuggestProps = {
  options: [
    { value: '1', label: 'One' },
    { value: '2', lang: 'Two' },
    { value: '3', lang: 'Three' },
  ],
  virtualScroll: true,
  enteredTextLabel: () => 'Use value',
  value: '',
  onChange: () => {},
};

function renderWithWrapper(ui: React.ReactElement) {
  const { container } = render(ui);
  return createWrapper(container).findAutosuggest()!;
}

describe('Virtual scroll support', () => {
  beforeEach(() => {
    scrollToIndex.mockReset();
  });

  test('should render plain virtual list', () => {
    const wrapper = renderWithWrapper(<Autosuggest {...defaultProps} />);
    wrapper.findNativeInput().focus();
    expect(wrapper.findDropdown().findOptions()).toHaveLength(3);
  });

  test('should render a subset of items in virtual list', () => {
    const wrapper = renderWithWrapper(
      <Autosuggest
        {...defaultProps}
        options={Array.from({ length: 100 }, (_, index) => ({ value: `Option ${index}` }))}
      />
    );
    wrapper.findNativeInput().focus();
    expect(wrapper.findDropdown().findOptions().length).toBeLessThan(100);
  });

  test('should render virtual list with groups', () => {
    const wrapper = renderWithWrapper(
      <Autosuggest
        {...defaultProps}
        options={[
          { label: 'Group 1', options: [{ value: '1' }, { value: '2' }] },
          { label: 'Group 2', options: [{ value: '3' }] },
        ]}
      />
    );
    wrapper.findNativeInput().focus();
    expect(wrapper.findDropdown().findOptions()).toHaveLength(3);
    expect(wrapper.findDropdown().findOptionInGroup(1, 1)).toBeTruthy();
    expect(wrapper.findDropdown().findOptionInGroup(2, 1)).toBeTruthy();
  });

  test('should select an option in virtual list', () => {
    const onChange = jest.fn();
    const wrapper = renderWithWrapper(<Autosuggest {...defaultProps} onChange={event => onChange(event.detail)} />);
    wrapper.findNativeInput().focus();
    wrapper.selectSuggestionByValue('2');
    expect(onChange).toHaveBeenCalledWith({ value: '2' });
  });

  test('should scroll to index', () => {
    const wrapper = renderWithWrapper(<Autosuggest {...defaultProps} />);
    expect(scrollToIndex).not.toHaveBeenCalled();

    wrapper.findNativeInput().keydown(KeyCode.down);
    expect(scrollToIndex).toHaveBeenCalledWith(0);

    wrapper.findNativeInput().keydown(KeyCode.down);
    expect(scrollToIndex).toHaveBeenCalledWith(1);
  });
});
