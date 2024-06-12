// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { updatePosition } from '../../../../lib/components/table/sticky-scrollbar/use-sticky-scrollbar';
import globalVars from '../../../../lib/components/internal/styles/global-vars';

describe('updatePosition', () => {
  function setupElements() {
    const scrollbar = document.createElement('div');
    const scrollbarContent = document.createElement('div');
    const table = document.createElement('table');
    table.getBoundingClientRect = jest.fn().mockReturnValue({ width: 800 });
    const wrapper = document.createElement('div');
    wrapper.getBoundingClientRect = jest.fn().mockReturnValue({ width: 600 });
    return { scrollbar, scrollbarContent, table, wrapper };
  }

  test('syncs sizes between elements in scrollable container', () => {
    const { scrollbar, scrollbarContent, table, wrapper } = setupElements();
    updatePosition(table, wrapper, scrollbar, scrollbarContent, true);
    expect(scrollbar.style.insetBlockEnd).toBe('0px');
    expect(scrollbar.style.inlineSize).toBe('600px');
    expect(scrollbarContent.style.inlineSize).toBe('800px');
  });

  test('syncs sizes between elements outside scrollable container', () => {
    const { scrollbar, scrollbarContent, table, wrapper } = setupElements();
    updatePosition(table, wrapper, scrollbar, scrollbarContent, false);
    expect(scrollbar.style.insetBlockEnd).toBe(`var(${globalVars.stickyVerticalBottomOffset}, 0px)`);
    expect(scrollbar.style.inlineSize).toBe('600px');
    expect(scrollbarContent.style.inlineSize).toBe('800px');
  });
});
