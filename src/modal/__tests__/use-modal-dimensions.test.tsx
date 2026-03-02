// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useContainerQuery } from '@cloudscape-design/component-toolkit';
import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import { useModalDimensions } from '../../../lib/components/modal/use-modal-dimensions';
import { renderHook } from '../../__tests__/render-hook';
import customCssProps from '../../internal/generated/custom-css-properties';

jest.mock('@cloudscape-design/component-toolkit', () => ({
  useContainerQuery: jest.fn(),
}));

jest.mock('@cloudscape-design/component-toolkit/internal', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit/internal'),
  warnOnce: jest.fn(),
}));

describe('useModalDimensions', () => {
  const mockFooterRef = jest.fn();
  const mockHeaderRef = jest.fn();
  const defaultFooterHeight = 66;
  const defaultHeaderHeight = 52;

  const minContentHeight = 60; // MIN_CONTENT_HEIGHT from hook
  const minModalWidth = 320; // MIN_MODAL_WIDTH from hook

  beforeEach(() => {
    jest.clearAllMocks();
    jest
      .mocked(useContainerQuery)
      .mockReturnValueOnce([defaultFooterHeight, mockFooterRef])
      .mockReturnValueOnce([defaultHeaderHeight, mockHeaderRef]);
  });

  test('returns refs, boolean flags, and dialogCustomStyles', () => {
    const { result } = renderHook(useModalDimensions, {
      initialProps: { height: 500, width: 600, hasFooter: true },
    });

    expect(result.current.footerRef).toBeDefined();
    expect(result.current.headerRef).toBeDefined();
    expect(result.current.hasCustomHeight).toBe(true);
    expect(result.current.hasCustomWidth).toBe(true);
    expect(result.current.dialogCustomStyles).toEqual({
      [customCssProps.modalCustomWidth]: '600px',
      [customCssProps.modalCustomHeight]: '500px',
    });
  });

  test('returns false for hasCustomHeight/Width when undefined', () => {
    const { result } = renderHook(useModalDimensions, {
      initialProps: { hasFooter: false },
    });

    expect(result.current.hasCustomHeight).toBe(false);
    expect(result.current.hasCustomWidth).toBe(false);
  });

  test('returns false for hasCustomHeight/Width when NaN', () => {
    const { result } = renderHook(useModalDimensions, {
      initialProps: { height: NaN, width: NaN, hasFooter: false },
    });

    expect(result.current.hasCustomHeight).toBe(false);
    expect(result.current.hasCustomWidth).toBe(false);
  });

  test('calculates minimum height and width correctly', () => {
    const { result } = renderHook(useModalDimensions, {
      initialProps: { height: 10, width: 40, hasFooter: true },
    });
    const expectedMinHeight = defaultHeaderHeight + defaultFooterHeight + minContentHeight;

    expect(result.current.footerHeight).toBe(defaultFooterHeight);
    expect(result.current.hasCustomHeight).toBe(true);
    expect(result.current.hasCustomWidth).toBe(true);
    expect(result.current.dialogCustomStyles).toEqual({
      [customCssProps.modalCustomHeight]: `${expectedMinHeight}px`,
      [customCssProps.modalCustomWidth]: `${minModalWidth}px`,
    });
  });

  describe('warnings', () => {
    test('warns when height is below minimum with footer', () => {
      renderHook(useModalDimensions, {
        initialProps: { height: 100, width: 400, hasFooter: true },
      });

      expect(warnOnce).toHaveBeenCalledWith('Modal', expect.stringContaining('Height (100px) is too small'));
    });

    test('warns when height is below minimum without footer', () => {
      renderHook(useModalDimensions, {
        initialProps: { height: 80, width: 400, hasFooter: false },
      });

      expect(warnOnce).toHaveBeenCalledWith('Modal', expect.stringContaining('Height (80px) is too small'));
    });

    test('warns when width is below minimum', () => {
      renderHook(useModalDimensions, {
        initialProps: { height: 500, width: 200, hasFooter: false },
      });

      expect(warnOnce).toHaveBeenCalledWith(
        'Modal',
        'Width (200px) is below minimum (320px) and will be adjusted to 320px.'
      );
    });

    test('does not warn when dimensions are valid', () => {
      const footerHeight = 50;
      jest.mocked(useContainerQuery).mockReturnValue([footerHeight, mockFooterRef]);

      renderHook(useModalDimensions, {
        initialProps: { height: 500, width: 400, hasFooter: true },
      });

      expect(warnOnce).not.toHaveBeenCalled();
    });

    test('does not warn when dimensions are not provided', () => {
      renderHook(useModalDimensions, {
        initialProps: { hasFooter: false },
      });

      expect(warnOnce).not.toHaveBeenCalled();
    });

    test('does not warn when dimensions are NaN', () => {
      renderHook(useModalDimensions, {
        initialProps: { height: NaN, width: NaN, hasFooter: false },
      });

      expect(warnOnce).not.toHaveBeenCalled();
    });
  });
});
