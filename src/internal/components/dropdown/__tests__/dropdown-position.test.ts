// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { applyDropdownPositionRelativeToViewport } from '../../../../../lib/components/internal/components/dropdown/dropdown-position';

describe('applyDropdownPositionRelativeToViewport', () => {
  const triggerRect = {
    blockSize: 50,
    inlineSize: 100,
    insetBlockStart: 100,
    insetInlineStart: 100,
    insetBlockEnd: 150,
    insetInlineEnd: 200,
  };

  const baseDropdownPosition = {
    blockSize: '100px',
    inlineSize: '100px',
    insetInlineStart: '100px',
    dropBlockStart: false,
    dropInlineStart: false,
  };

  test("anchored to the trigger's block start", () => {
    const dropdownElement = document.createElement('div');
    applyDropdownPositionRelativeToViewport({
      dropdownElement,
      triggerRect,
      position: { ...baseDropdownPosition, dropBlockStart: true },
      isMobile: false,
    });
    expect(dropdownElement.style.insetBlockEnd).toBeTruthy();
    expect(dropdownElement.style.insetBlockStart).toBeFalsy();
  });

  test("anchored to the trigger's block end", () => {
    const dropdownElement = document.createElement('div');
    applyDropdownPositionRelativeToViewport({
      dropdownElement,
      triggerRect,
      position: baseDropdownPosition,
      isMobile: false,
    });
    expect(dropdownElement.style.insetBlockEnd).toBeFalsy();
    expect(dropdownElement.style.insetBlockStart).toEqual(`${triggerRect.insetBlockEnd}px`);
  });

  test("anchored to the trigger's inline start", () => {
    const dropdownElement = document.createElement('div');
    applyDropdownPositionRelativeToViewport({
      dropdownElement,
      triggerRect,
      position: { ...baseDropdownPosition, dropInlineStart: true },
      isMobile: false,
    });
    expect(dropdownElement.style.insetInlineStart).toBeTruthy();
  });

  test("not anchored to the trigger's inline start", () => {
    const dropdownElement = document.createElement('div');
    applyDropdownPositionRelativeToViewport({
      dropdownElement,
      triggerRect,
      position: baseDropdownPosition,
      isMobile: false,
    });
    expect(dropdownElement.style.insetInlineStart).toEqual(`${triggerRect.insetInlineStart}px`);
  });

  test('uses fixed position on desktop', () => {
    const dropdownElement = document.createElement('div');
    applyDropdownPositionRelativeToViewport({
      dropdownElement,
      triggerRect,
      position: baseDropdownPosition,
      isMobile: false,
    });
    expect(dropdownElement.style.position).toEqual('fixed');
  });

  test('uses absolute position on mobile', () => {
    const dropdownElement = document.createElement('div');
    applyDropdownPositionRelativeToViewport({
      dropdownElement,
      triggerRect,
      position: baseDropdownPosition,
      isMobile: true,
    });
    expect(dropdownElement.style.position).toEqual('absolute');
  });
});
