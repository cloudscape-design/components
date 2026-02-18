// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';

import Dropdown from '../../../../../lib/components/internal/components/dropdown';
import { calculatePosition } from '../../../../../lib/components/internal/components/dropdown/dropdown-fit-handler';
import customCssProps from '../../../../../lib/components/internal/generated/custom-css-properties';
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
      const [wrapper] = renderDropdown(<Dropdown trigger={<button />} content={<div id="content" />} />);
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
  describe('"OutsideClick" Event', () => {
    test('fires event on outside click', async () => {
      const handleOutsideClick = jest.fn();
      const [, outsideElement] = renderDropdown(
        <Dropdown trigger={<button />} onOutsideClick={handleOutsideClick} open={true} />
      );
      await runPendingEvents();

      act(() => outsideElement.click());
      expect(handleOutsideClick).toHaveBeenCalled();
    });

    test('does not fire event when a portaled element inside dropdown is clicked', async () => {
      const handleOutsideClick = jest.fn();
      renderDropdown(
        <Dropdown
          trigger={<button />}
          onOutsideClick={handleOutsideClick}
          open={true}
          content={
            <Dropdown
              trigger={<button />}
              open={true}
              expandToViewport={true}
              content={<button data-testid="inside">inside</button>}
            />
          }
        />
      );
      await runPendingEvents();

      act(() => screen.getByTestId('inside').click());
      expect(handleOutsideClick).not.toHaveBeenCalled();
    });

    test('does not fire event when a self-destructible element inside dropdown was clicked', async () => {
      function SelfDestructible() {
        const [visible, setVisible] = useState(true);
        return visible ? (
          <button data-testid="dismiss" onClick={() => setVisible(false)}>
            Dismiss
          </button>
        ) : (
          <span data-testid="after-dismiss">Gone!</span>
        );
      }
      const handleOutsideClick = jest.fn();
      const [wrapper] = renderDropdown(
        <Dropdown trigger={<button />} onOutsideClick={handleOutsideClick} open={true} content={<SelfDestructible />} />
      );
      await runPendingEvents();

      // NB: this should NOT be wrapped into act or React re-render will happen too late to reproduce the issue
      wrapper.find('[data-testid="dismiss"]')!.click();

      expect(handleOutsideClick).not.toHaveBeenCalled();
      expect(screen.getByTestId('after-dismiss')).toBeTruthy();
    });
  });

  describe('dropdown focus events', () => {
    test('fires focus and blur events when focus transitions from and to an outside element', async () => {
      const handleFocus = jest.fn();
      const handleBlur = jest.fn();
      const [, outsideElement] = renderDropdown(
        <Dropdown trigger={<button data-testid="trigger" />} onFocus={handleFocus} onBlur={handleBlur} open={true} />
      );
      await runPendingEvents();

      screen.getByTestId('trigger').focus();
      expect(handleFocus).toHaveBeenCalled();
      outsideElement.focus();
      expect(handleBlur).toHaveBeenCalled();
    });

    test('does not fire focus and event when focus transitions from and to a element in the dropdown, even if portaled', async () => {
      const handleFocus = jest.fn();
      const handleBlur = jest.fn();
      renderDropdown(
        <Dropdown
          trigger={<button data-testid="trigger" />}
          onFocus={handleFocus}
          onBlur={handleBlur}
          open={true}
          content={
            <Dropdown
              trigger={<button />}
              open={true}
              expandToViewport={true}
              content={<button data-testid="inside">inside</button>}
            />
          }
        />
      );
      await runPendingEvents();

      screen.getByTestId('trigger').focus();
      // handleFocus has been called once by the previous line to set up the test, so we clear it.
      handleFocus.mockClear();
      screen.getByTestId('inside').focus();
      screen.getByTestId('trigger').focus();
      expect(handleFocus).not.toHaveBeenCalled();
      expect(handleBlur).not.toHaveBeenCalled();
    });
  });

  describe('dropdown content focus events (onFocusIn/onFocusOut)', () => {
    test('fires onFocusIn when any element inside dropdown content gains focus', async () => {
      const handleFocusIn = jest.fn();
      const [, outsideElement] = renderDropdown(
        <Dropdown
          trigger={<button data-testid="trigger" />}
          onFocusIn={handleFocusIn}
          open={true}
          content={
            <>
              <button data-testid="button1">Button 1</button>
              <button data-testid="button2">Button 2</button>
            </>
          }
        />
      );
      await runPendingEvents();

      // Focus on first button in dropdown content
      screen.getByTestId('button1').focus();
      expect(handleFocusIn).toHaveBeenCalledTimes(1);

      // Focus on second button in dropdown content - onFocusIn fires again
      screen.getByTestId('button2').focus();
      expect(handleFocusIn).toHaveBeenCalledTimes(2);

      // Focus outside - onFocusIn should not fire
      outsideElement.focus();
      expect(handleFocusIn).toHaveBeenCalledTimes(2);
    });

    test('fires onFocusOut when focus leaves dropdown content entirely', async () => {
      const handleFocusOut = jest.fn();
      const [, outsideElement] = renderDropdown(
        <Dropdown
          trigger={<button data-testid="trigger" />}
          onFocusOut={handleFocusOut}
          open={true}
          content={
            <>
              <button data-testid="button1">Button 1</button>
              <button data-testid="button2">Button 2</button>
            </>
          }
        />
      );
      await runPendingEvents();

      // Focus on first button in dropdown content
      screen.getByTestId('button1').focus();
      expect(handleFocusOut).not.toHaveBeenCalled();

      // Move focus between elements in dropdown - onFocusOut should not fire
      screen.getByTestId('button2').focus();
      expect(handleFocusOut).not.toHaveBeenCalled();

      // Focus outside dropdown content - onFocusOut should fire
      outsideElement.focus();
      expect(handleFocusOut).toHaveBeenCalledTimes(1);
    });

    test('fires onFocusOut when focus moves from dropdown content to trigger', async () => {
      const handleFocusOut = jest.fn();
      renderDropdown(
        <Dropdown
          trigger={<button data-testid="trigger" />}
          onFocusOut={handleFocusOut}
          open={true}
          content={<button data-testid="button1">Button 1</button>}
        />
      );
      await runPendingEvents();

      // Focus on button in dropdown content
      screen.getByTestId('button1').focus();
      expect(handleFocusOut).not.toHaveBeenCalled();

      // Move focus to trigger - onFocusOut SHOULD fire because trigger is outside dropdown content
      screen.getByTestId('trigger').focus();
      expect(handleFocusOut).toHaveBeenCalledTimes(1);
    });

    test('onFocusIn fires for each focus event on nested interactive elements', async () => {
      const handleFocusIn = jest.fn();
      const handleFocusOut = jest.fn();
      const [, outsideElement] = renderDropdown(
        <Dropdown
          trigger={<button data-testid="trigger" />}
          onFocusIn={handleFocusIn}
          onFocusOut={handleFocusOut}
          open={true}
          content={
            <div>
              <input data-testid="input" />
              <a href="#" data-testid="link">
                Link
              </a>
            </div>
          }
        />
      );
      await runPendingEvents();

      // Focus on input - onFocusIn fires
      screen.getByTestId('input').focus();
      expect(handleFocusIn).toHaveBeenCalledTimes(1);
      expect(handleFocusOut).not.toHaveBeenCalled();

      // Move to link - onFocusIn fires again, onFocusOut does not
      screen.getByTestId('link').focus();
      expect(handleFocusIn).toHaveBeenCalledTimes(2);
      expect(handleFocusOut).not.toHaveBeenCalled();

      // Move outside - onFocusOut fires
      outsideElement.focus();
      expect(handleFocusIn).toHaveBeenCalledTimes(2);
      expect(handleFocusOut).toHaveBeenCalledTimes(1);
    });

    test('works correctly with expandToViewport (portaled content)', async () => {
      const handleFocusIn = jest.fn();
      const handleFocusOut = jest.fn();
      const [, outsideElement] = renderDropdown(
        <Dropdown
          trigger={<button data-testid="trigger" />}
          onFocusIn={handleFocusIn}
          onFocusOut={handleFocusOut}
          open={true}
          expandToViewport={true}
          content={<button data-testid="inside">inside</button>}
        />
      );
      await runPendingEvents();

      // Focus on portaled content - onFocusIn fires
      screen.getByTestId('inside').focus();
      expect(handleFocusIn).toHaveBeenCalledTimes(1);
      expect(handleFocusOut).not.toHaveBeenCalled();

      // Move focus outside - onFocusOut fires
      outsideElement.focus();
      expect(handleFocusIn).toHaveBeenCalledTimes(1);
      expect(handleFocusOut).toHaveBeenCalledTimes(1);
    });

    test('onFocusIn does not fire when trigger gains focus', async () => {
      const handleFocusIn = jest.fn();
      renderDropdown(
        <Dropdown
          trigger={<button data-testid="trigger" />}
          onFocusIn={handleFocusIn}
          open={true}
          content={<button data-testid="button1">Button 1</button>}
        />
      );
      await runPendingEvents();

      // Focus on trigger - onFocusIn should not fire (trigger is not part of dropdown content)
      screen.getByTestId('trigger').focus();
      expect(handleFocusIn).not.toHaveBeenCalled();

      // Focus on dropdown content - onFocusIn should fire
      screen.getByTestId('button1').focus();
      expect(handleFocusIn).toHaveBeenCalledTimes(1);
    });
  });

  describe('Escape key event', () => {
    test('fires onEscape when Escape key is pressed while dropdown is open', async () => {
      const handleEscape = jest.fn();
      renderDropdown(<Dropdown trigger={<button data-testid="trigger" />} onEscape={handleEscape} open={true} />);
      await runPendingEvents();

      fireEvent.keyDown(window, { key: 'Escape' });
      expect(handleEscape).toHaveBeenCalledTimes(1);
    });

    test('does not fire onEscape when dropdown is closed', async () => {
      const handleEscape = jest.fn();
      renderDropdown(<Dropdown trigger={<button data-testid="trigger" />} onEscape={handleEscape} open={false} />);
      await runPendingEvents();

      fireEvent.keyDown(window, { key: 'Escape' });
      expect(handleEscape).not.toHaveBeenCalled();
    });

    test('stops propagation to prevent parent handlers from catching the event', async () => {
      const handleEscape = jest.fn();
      const parentHandler = jest.fn();

      render(
        <div onKeyDown={parentHandler}>
          <button data-testid={outsideId} />
          <Dropdown trigger={<button data-testid="trigger" />} onEscape={handleEscape} open={true} />
        </div>
      );
      await runPendingEvents();

      const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
      const stopPropagationSpy = jest.spyOn(event, 'stopPropagation');

      window.dispatchEvent(event);

      expect(handleEscape).toHaveBeenCalledTimes(1);
      expect(stopPropagationSpy).toHaveBeenCalled();
    });

    test('works with expandToViewport (portaled content)', async () => {
      const handleEscape = jest.fn();
      renderDropdown(
        <Dropdown
          trigger={<button data-testid="trigger" />}
          onEscape={handleEscape}
          open={true}
          expandToViewport={true}
          content={<button data-testid="inside">inside</button>}
        />
      );
      await runPendingEvents();

      fireEvent.keyDown(window, { key: 'Escape' });
      expect(handleEscape).toHaveBeenCalledTimes(1);
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
    test('dropdown position is not calculated when dropdown closes', () => {
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

  describe('width CSS variables', () => {
    test('applies numeric minWidth value as pixels', () => {
      const [wrapper] = renderDropdown(<Dropdown trigger={<button />} open={true} minWidth={300} />);
      const dropdown = wrapper.findOpenDropdown()!.getElement();
      expect(dropdown.style.getPropertyValue(customCssProps.dropdownDefaultMinWidth)).toBe('300px');
    });

    test('applies numeric maxWidth value as pixels', () => {
      const [wrapper] = renderDropdown(<Dropdown trigger={<button />} open={true} maxWidth={250} />);
      const dropdown = wrapper.findOpenDropdown()!.getElement();
      expect(dropdown.style.getPropertyValue(customCssProps.dropdownDefaultMaxWidth)).toBe('250px');
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
