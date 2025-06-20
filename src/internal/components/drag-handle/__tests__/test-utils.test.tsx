// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { render } from '@testing-library/react';

import InternalDragHandle from '../../../../../lib/components/internal/components/drag-handle/index.js';
import InternalDragHandleWrapper from '../../../../../lib/components/test-utils/dom/internal/drag-handle.js';

describe('test util selectors', () => {
  function renderTestComponent(showUapActions = true, props?: React.ComponentProps<typeof InternalDragHandle>) {
    const onDirectionClickMock = jest.fn();
    const { container } = render(
      <InternalDragHandle
        directions={{
          'block-start': 'active',
          'block-end': 'active',
          'inline-start': 'active',
          'inline-end': 'active',
        }}
        onDirectionClick={onDirectionClickMock}
        {...props}
      />
    );
    const handle = container.querySelector<HTMLButtonElement>(`.${InternalDragHandleWrapper.rootSelector}`)!;

    if (showUapActions) {
      document.body.dataset.awsuiFocusVisible = 'true';
      handle.focus();
    }

    return {
      resizeHandleWrapper: new InternalDragHandleWrapper(document.body),
      handle,
      onDirectionClickMock,
    };
  }

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('findAllVisibleDirectionButtons', () => {
    const { resizeHandleWrapper } = renderTestComponent();
    expect(resizeHandleWrapper.findAllVisibleDirectionButtons()).toHaveLength(4);
  });

  test('findAllVisibleDirectionButtons - empty when not shown', () => {
    const { resizeHandleWrapper } = renderTestComponent(false);
    expect(resizeHandleWrapper.findAllVisibleDirectionButtons()).toHaveLength(0);
  });

  test('click on findVisibleDirectionButtonBlockStart calls onDirectionClick mock', () => {
    const { resizeHandleWrapper, onDirectionClickMock } = renderTestComponent();
    const handleButton = resizeHandleWrapper.findVisibleDirectionButtonBlockStart()!;
    expect(handleButton).not.toBeNull();

    handleButton.click();
    expect(onDirectionClickMock).toHaveBeenCalledTimes(1);
    expect(onDirectionClickMock).toHaveBeenCalledWith('block-start');
  });

  test('findVisibleDirectionButtonBlockStart - empty when not shown', () => {
    const { resizeHandleWrapper } = renderTestComponent(false);
    expect(resizeHandleWrapper.findVisibleDirectionButtonBlockStart()!).toBeNull();
  });

  test('findVisibleDirectionButtonBlockEnd', () => {
    const { resizeHandleWrapper, onDirectionClickMock } = renderTestComponent();
    const handleButton = resizeHandleWrapper.findVisibleDirectionButtonBlockEnd()!;
    expect(handleButton).not.toBeNull();

    handleButton.click();
    expect(onDirectionClickMock).toHaveBeenCalledTimes(1);
    expect(onDirectionClickMock).toHaveBeenCalledWith('block-end');
  });

  test('findVisibleDirectionButtonBlockEnd - empty when not shown', () => {
    const { resizeHandleWrapper } = renderTestComponent(false);
    expect(resizeHandleWrapper.findVisibleDirectionButtonBlockEnd()!).toBeNull();
  });

  test('findVisibleDirectionButtonInlineStart', () => {
    const { resizeHandleWrapper, onDirectionClickMock } = renderTestComponent();
    const handleButton = resizeHandleWrapper.findVisibleDirectionButtonInlineStart()!;
    expect(handleButton).not.toBeNull();

    handleButton.click();
    expect(onDirectionClickMock).toHaveBeenCalledTimes(1);
    expect(onDirectionClickMock).toHaveBeenCalledWith('inline-start');
  });

  test('findVisibleDirectionButtonInlineStart - empty when not shown', () => {
    const { resizeHandleWrapper } = renderTestComponent(false);
    expect(resizeHandleWrapper.findVisibleDirectionButtonInlineStart()!).toBeNull();
  });

  test('findVisibleDirectionButtonInlineEnd', () => {
    const { resizeHandleWrapper, onDirectionClickMock } = renderTestComponent();
    const handleButton = resizeHandleWrapper.findVisibleDirectionButtonInlineEnd()!;
    expect(handleButton).not.toBeNull();

    handleButton.click();
    expect(onDirectionClickMock).toHaveBeenCalledTimes(1);
    expect(onDirectionClickMock).toHaveBeenCalledWith('inline-end');
  });

  test('findVisibleDirectionButtonInlineEnd - empty when not shown', () => {
    const { resizeHandleWrapper } = renderTestComponent(false);
    expect(resizeHandleWrapper.findVisibleDirectionButtonInlineEnd()!).toBeNull();
  });
});
