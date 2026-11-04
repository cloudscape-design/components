// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, render } from '@testing-library/react';

import PlainList from '../../../../../lib/components/internal/components/listbox/parts/plain-list';
import { flattenOptions } from '../../../../../lib/components/internal/components/option/utils/flatten-options';
import { HighlightType } from '../../../../../lib/components/internal/components/options-list/utils/use-highlight-option';
import type { GetOptionProps, ScrollToIndexRef } from '../interfaces';
import type { ItemProps } from '../parts/item';
import type { ListProps } from '../parts/plain-list';

const { flatOptions } = flattenOptions([
  { value: 'a', label: 'A' },
  { value: 'b', label: 'B' },
]);

const getOptionProps: GetOptionProps = (option, index) => ({ option, index, 'data-mouse-target': index }) as ItemProps;

function renderPlainList(scrollStrategy?: ListProps['scrollStrategy']) {
  const scrollToIndex = React.createRef<ScrollToIndexRef>();
  const listRef = React.createRef<HTMLDivElement>();
  render(
    <PlainList
      ref={scrollToIndex}
      listProps={{ ref: listRef, open: true, embedded: true }}
      getOptionProps={getOptionProps}
      filteredOptions={flatOptions}
      filteringValue=""
      highlightType={new HighlightType('keyboard')}
      scrollStrategy={scrollStrategy}
    />
  );
  const list = listRef.current!;
  const item = list.querySelector<HTMLElement>('[data-mouse-target="1"]')!;
  return { scrollTo: (index: number) => act(() => scrollToIndex.current!(index)), list, item };
}

describe('PlainList scrollStrategy', () => {
  const originalScrollIntoView = HTMLElement.prototype.scrollIntoView;
  let scrollIntoView: jest.Mock;

  beforeEach(() => {
    scrollIntoView = HTMLElement.prototype.scrollIntoView = jest.fn();
  });
  afterEach(() => {
    HTMLElement.prototype.scrollIntoView = originalScrollIntoView;
  });

  test('ancestors: scrolls the option into view through all scrollable ancestors', () => {
    const { scrollTo, list, item } = renderPlainList('ancestors');
    list.scrollBy = jest.fn();
    scrollTo(1);
    expect(scrollIntoView).toHaveBeenCalledTimes(1);
    expect(scrollIntoView.mock.instances[0]).toBe(item);
    expect(list.scrollBy).not.toHaveBeenCalled();
  });

  test('scrolls only the list by default', () => {
    const { scrollTo, list, item } = renderPlainList();
    // jsdom has no layout, so give the list a height and place the option below its visible area.
    Object.defineProperty(list, 'clientHeight', { value: 100 });
    list.getBoundingClientRect = () => ({ top: 0, bottom: 100, height: 100 }) as DOMRect;
    item.getBoundingClientRect = () => ({ top: 200, bottom: 250, height: 50 }) as DOMRect;
    list.scrollBy = jest.fn();
    scrollTo(1);
    expect(list.scrollBy).toHaveBeenCalledWith({ top: 150 });
    expect(scrollIntoView).not.toHaveBeenCalled();
  });
});
