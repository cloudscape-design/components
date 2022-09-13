// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, render, fireEvent } from '@testing-library/react';
import Dropdown from '../../../../../lib/components/internal/components/dropdown';
import { calculatePosition } from '../../../../../lib/components/internal/components/dropdown/dropdown-fit-handler';
import DropdownWrapper from '../../../../../lib/components/test-utils/dom/internal/dropdown';

const outsideId = 'outside';

function renderDropdown(dropdown: React.ReactNode): [DropdownWrapper, HTMLElement] {
  const renderResult = render(
    <div>
      <button data-testid={outsideId} />
      {dropdown}
    </div>
  );
  const outsideElement = renderResult.getByTestId(outsideId);
  const dropdownElement = renderResult.container.querySelector<HTMLElement>(`.${DropdownWrapper.rootSelector}`)!;
  return [new DropdownWrapper(dropdownElement), outsideElement];
}

jest.mock('../../../../../lib/components/internal/components/dropdown/dropdown-fit-handler', () => {
  const originalModule = jest.requireActual(
    '../../../../../lib/components/internal/components/dropdown/dropdown-fit-handler'
  );
  return {
    ...originalModule,
    calculatePosition: jest.fn(originalModule.calculatePosition),
  };
});

describe('Dropdown Component', () => {
  describe('Properties', () => {
    test('closed by default', () => {
      const [wrapper] = renderDropdown(
        <Dropdown trigger={<button />}>
          <div id="content" />
        </Dropdown>
      );
      expect(wrapper.findOpenDropdown()).not.toBeTruthy();
    });
    test('opens with the prop', () => {
      const [wrapper] = renderDropdown(<Dropdown trigger={<button />} open={true} />);
      expect(wrapper.findOpenDropdown()).toBeTruthy();
    });
    test('renders the trigger', () => {
      const id = 'trigger';
      const [wrapper] = renderDropdown(<Dropdown trigger={<button id={id} />} />);
      expect(wrapper.find(`#${id}`)).toBeTruthy();
    });
  });
  describe('"DropdownClose" Event', () => {
    test('fires close event on outside click', async () => {
      const handleCloseDropdown = jest.fn();
      const [, outsideElement] = renderDropdown(
        <Dropdown trigger={<button />} onDropdownClose={handleCloseDropdown} open={true} />
      );
      await runPendingEvents();

      act(() => outsideElement.click());
      expect(handleCloseDropdown).toBeCalled();
    });
  });
  describe('dropdown recalculate position on scroll', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });
    afterAll(() => {
      jest.useRealTimers();
    });
    test('dropdown position is calculated on window scroll when dropdown is open', () => {
      render(<Dropdown trigger={<button />} open={true} />);
      (calculatePosition as jest.Mock).mockClear();
      fireEvent.scroll(window, { target: { scrollY: 100 } });
      expect(calculatePosition).toHaveBeenCalledTimes(1);
    });
    test('dropdown position is not calculated when dropdown not open', () => {
      render(<Dropdown trigger={<button />} open={false} />);
      (calculatePosition as jest.Mock).mockClear();
      fireEvent.scroll(window, { target: { scrollY: 100 } });
      expect(calculatePosition).toHaveBeenCalledTimes(0);
    });
    test('dropdown position is not calculated when dropdown closes ', () => {
      const renderResult = render(<Dropdown trigger={<button />} open={true} />);
      renderResult.rerender(<Dropdown trigger={<button />} open={false} />);
      (calculatePosition as jest.Mock).mockClear();
      fireEvent.scroll(window, { target: { scrollY: 100 } });
      expect(calculatePosition).toHaveBeenCalledTimes(0);
    });
    test('dropdown handler is not calculated on window scroll after timeout when dropdown is open', () => {
      render(<Dropdown trigger={<button />} open={true} />);
      jest.runAllTimers();
      (calculatePosition as jest.Mock).mockClear();
      fireEvent.scroll(window, { target: { scrollY: 100 } });
      expect(calculatePosition).toHaveBeenCalledTimes(0);
    });
  });
});

/**
 * This function causes a zero-time delay in order
 * to allow events that are queued in the event loop
 * (such as setTimeout calls in components) to run.
 */
async function runPendingEvents() {
  await act(() => new Promise(r => setTimeout(r, 0)));
}
