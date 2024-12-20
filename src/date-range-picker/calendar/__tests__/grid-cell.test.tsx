// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import { GridCell } from '../../../../lib/components/date-range-picker/calendar/grids/grid-cell';
import createWrapper from '../../../../lib/components/test-utils/dom';

describe('Date range picker grid cell', () => {
  const mockOnFocus = jest.fn();
  const mockOnBlur = jest.fn();
  const mockOnMouseEnter = jest.fn();
  const mockOnMouseLeave = jest.fn();
  const mockDisabledReason = 'Mock disabled reason';

  const testProps = {
    onFocus: mockOnFocus,
    onBlur: mockOnBlur,
    onMouseEnter: mockOnMouseEnter,
    onMouseLeave: mockOnMouseLeave,
  };

  describe.each([true, false])('Events register when disabled is %s with disabledReason', isDisabled => {
    beforeEach(() => jest.resetAllMocks());

    const mockProps = {
      ...testProps,
      disabled: isDisabled,
      disabledReason: mockDisabledReason,
    };
    test('Registers a focus event', () => {
      const { container, getByTestId } = render(
        <GridCell {...mockProps}>
          <div data-testid="testitem">Test</div>
        </GridCell>
      );
      const wrapper = createWrapper(container);
      expect(wrapper).not.toBeNull();
      fireEvent.focus(getByTestId('testitem'));
      expect(mockOnFocus).toHaveBeenCalledTimes(1);
    });

    test('Registers a blur event', () => {
      const { container, getByTestId } = render(
        <GridCell {...mockProps}>
          <div data-testid="testitem">Test</div>
        </GridCell>
      );
      const wrapper = createWrapper(container);

      expect(wrapper).not.toBeNull();
      fireEvent.blur(getByTestId('testitem'));
      expect(mockOnBlur).toHaveBeenCalledTimes(1);
    });

    test('Registers a mouse enter event', () => {
      const { container, getByTestId } = render(
        <GridCell {...mockProps}>
          <div data-testid="testitem">Test</div>
        </GridCell>
      );
      const wrapper = createWrapper(container);

      expect(wrapper).not.toBeNull();
      fireEvent.mouseEnter(getByTestId('testitem'));
      expect(mockOnMouseEnter).toHaveBeenCalledTimes(1);
    });

    test('Registers a mouse leave event', () => {
      const { container, getByTestId } = render(
        <GridCell {...mockProps}>
          <div data-testid="testitem">Test</div>
        </GridCell>
      );
      const wrapper = createWrapper(container);

      expect(wrapper).not.toBeNull();
      fireEvent.mouseLeave(getByTestId('testitem'));
      expect(mockOnMouseLeave).toHaveBeenCalledTimes(1);
    });
  });
});
