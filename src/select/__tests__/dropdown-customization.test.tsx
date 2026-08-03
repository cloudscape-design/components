// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { act, render } from '@testing-library/react';

import { KeyCode } from '@cloudscape-design/test-utils-core/utils';

import Select, { SelectProps } from '../../../lib/components/select';
import createWrapper from '../../../lib/components/test-utils/dom';
import { defaultProps } from './common';

function renderSelect(props?: Partial<SelectProps>) {
  const { container } = render(<Select {...defaultProps} filteringType="auto" {...props} />);
  return createWrapper(container).findSelect()!;
}

describe('Select dropdown customization', () => {
  test('renders custom header, footer, and filtering actions', () => {
    const wrapper = renderSelect({
      renderDropdownHeader: () => <div>custom-header</div>,
      renderDropdownFooter: () => <div>custom-footer</div>,
      renderFilteringActions: () => <div>custom-actions</div>,
    });
    wrapper.openDropdown();

    expect(wrapper.findDropdownHeader()!.getElement()).toHaveTextContent('custom-header');
    expect(wrapper.findDropdownFooter()!.getElement()).toHaveTextContent('custom-footer');
    expect(wrapper.findFilteringActions()!.getElement()).toHaveTextContent('custom-actions');
  });

  test('render functions receive the current filterText', () => {
    const renderDropdownHeader = jest.fn(() => null);
    const wrapper = renderSelect({ renderDropdownHeader });
    wrapper.openDropdown();

    expect(renderDropdownHeader).toHaveBeenCalledWith(expect.objectContaining({ filterText: '' }));

    wrapper.findFilteringInput()!.setInputValue('Sec');
    expect(renderDropdownHeader).toHaveBeenLastCalledWith(expect.objectContaining({ filterText: 'Sec' }));
  });

  test('closeDropdown closes the dropdown', () => {
    const wrapper = renderSelect({
      renderDropdownFooter: ({ closeDropdown }) => <button onClick={closeDropdown}>Done</button>,
    });
    wrapper.openDropdown();
    expect(wrapper.findDropdown().findOpenDropdown()).not.toBeNull();

    const done = wrapper.findDropdownFooter()!.find('button')!;
    act(() => {
      (done.getElement() as HTMLButtonElement).click();
    });
    expect(wrapper.findDropdown().findOpenDropdown()).toBeNull();
  });

  test('omitting all three props preserves current behavior', () => {
    const wrapper = renderSelect();
    wrapper.openDropdown();

    expect(wrapper.findDropdownHeader()).toBeNull();
    expect(wrapper.findDropdownFooter()).toBeNull();
    expect(wrapper.findFilteringActions()).toBeNull();
    // The built-in filter input is still rendered in the header.
    expect(wrapper.findFilteringInput()).not.toBeNull();
  });

  test('closeDropdown returns focus to the trigger', () => {
    const wrapper = renderSelect({
      renderDropdownFooter: ({ closeDropdown }) => <button onClick={closeDropdown}>Done</button>,
    });
    wrapper.openDropdown();

    const done = wrapper.findDropdownFooter()!.find('button')!;
    act(() => {
      (done.getElement() as HTMLButtonElement).click();
    });
    expect(wrapper.findDropdown().findOpenDropdown()).toBeNull();
    expect(wrapper.findTrigger().getElement()).toHaveFocus();
  });

  describe('filteringType="none"', () => {
    function renderNoFilter(props?: Partial<SelectProps>) {
      const { container } = render(<Select {...defaultProps} filteringType="none" {...props} />);
      return createWrapper(container).findSelect()!;
    }

    test('renders the custom header but gates out filtering actions and the filter input', () => {
      const wrapper = renderNoFilter({
        renderDropdownHeader: () => <div>custom-header</div>,
        renderFilteringActions: () => <div>custom-actions</div>,
      });
      wrapper.openDropdown();

      expect(wrapper.findDropdownHeader()!.getElement()).toHaveTextContent('custom-header');
      expect(wrapper.findFilteringActions()).toBeNull();
      expect(wrapper.findFilteringInput()).toBeNull();
    });

    test('interactive footer control is keyboard-reachable and Tab does not trap or close the dropdown', () => {
      const wrapper = renderNoFilter({
        renderDropdownFooter: () => <button>Footer action</button>,
      });
      wrapper.openDropdown();

      const footerButton = wrapper.findDropdownFooter()!.find('button')!;
      const buttonElement = footerButton.getElement() as HTMLButtonElement;

      // filteringType="none" renders a listbox. A footer control must be genuinely in the native
      // tab order (not merely programmatically focusable): a real focusable element with a
      // non-negative tabindex and no aria-hidden/inert/disabled ancestor.
      expect(buttonElement.tabIndex).toBeGreaterThanOrEqual(0);
      expect(buttonElement.closest('[aria-hidden="true"]')).toBeNull();
      expect(buttonElement.closest('[inert]')).toBeNull();
      expect(buttonElement.disabled).toBe(false);

      // Tabbing from the footer control must not trap focus or close the listbox dropdown: the
      // dropdown stays open and focus is not returned to the trigger.
      act(() => {
        buttonElement.focus();
      });
      footerButton.keydown(KeyCode.tab);
      expect(buttonElement).toHaveFocus();
      expect(wrapper.findTrigger().getElement()).not.toHaveFocus();
      expect(wrapper.findDropdown().findOpenDropdown()).not.toBeNull();
    });
  });

  describe('dropdownRole', () => {
    test('defaults to listbox semantics without a filter', () => {
      const { container } = render(<Select {...defaultProps} filteringType="none" />);
      const wrapper = createWrapper(container).findSelect()!;
      expect(wrapper.findTrigger().getElement().getAttribute('aria-haspopup')).toBe('listbox');
    });

    test('dropdownRole="dialog" forces dialog semantics without a filter', () => {
      const { container } = render(<Select {...defaultProps} filteringType="none" dropdownRole="dialog" />);
      const wrapper = createWrapper(container).findSelect()!;
      expect(wrapper.findTrigger().getElement().getAttribute('aria-haspopup')).toBe('dialog');
      wrapper.openDropdown();
      const controlledId = wrapper.findTrigger().getElement().getAttribute('aria-controls');
      expect(controlledId).toBeTruthy();
      expect(
        wrapper.findDropdown().getElement().parentNode!.querySelector(`#${controlledId}`)!.getAttribute('role')
      ).toBe('dialog');
    });
  });

  describe('dropdownAriaDescribedby', () => {
    test('is applied to the listbox and joined with the built-in status id', () => {
      const { container } = render(
        <Select
          {...defaultProps}
          filteringType="none"
          statusType="loading"
          loadingText="Loading"
          dropdownAriaDescribedby="my-description"
        />
      );
      const wrapper = createWrapper(container).findSelect()!;
      wrapper.openDropdown();
      const listbox = wrapper.findDropdown().getElement().querySelector('[role=listbox]')!;
      const describedby = listbox.getAttribute('aria-describedby')!;
      expect(describedby).toContain('my-description');
      // The built-in status id is preserved alongside the consumer id, not replaced.
      expect(describedby.split(' ').length).toBeGreaterThan(1);
    });

    test('is applied to the dialog and joined with the built-in status id', () => {
      const wrapper = renderSelect({
        statusType: 'loading',
        loadingText: 'Loading',
        dropdownAriaDescribedby: 'my-description',
      });
      wrapper.openDropdown();
      const controlledId = wrapper.findTrigger().getElement().getAttribute('aria-controls')!;
      const dialog = wrapper.findDropdown().getElement().parentNode!.querySelector(`#${controlledId}`)!;
      const describedby = dialog.getAttribute('aria-describedby')!;
      expect(describedby).toContain('my-description');
      expect(describedby.split(' ').length).toBeGreaterThan(1);
    });
  });

  test('composes the custom header before the filter row, and the status before the custom footer', () => {
    const wrapper = renderSelect({
      statusType: 'loading',
      loadingText: 'Loading',
      renderDropdownHeader: () => <div>custom-header</div>,
      renderDropdownFooter: () => <div>custom-footer</div>,
    });
    wrapper.openDropdown();

    const filterInput = wrapper.findFilteringInput()!.getElement();
    const header = wrapper.findDropdownHeader()!.getElement();
    expect(header.compareDocumentPosition(filterInput) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();

    const statusIndicator = wrapper.findStatusIndicator()!.getElement();
    const customFooter = wrapper.findDropdownFooter()!.getElement();
    expect(statusIndicator.compareDocumentPosition(customFooter) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  test('find utils resolve the custom regions with expandToViewport', () => {
    const wrapper = renderSelect({
      expandToViewport: true,
      renderDropdownHeader: () => <div>custom-header</div>,
      renderDropdownFooter: () => <div>custom-footer</div>,
      renderFilteringActions: () => <div>custom-actions</div>,
    });
    wrapper.openDropdown();

    expect(wrapper.findDropdownHeader({ expandToViewport: true })!.getElement()).toHaveTextContent('custom-header');
    expect(wrapper.findDropdownFooter({ expandToViewport: true })!.getElement()).toHaveTextContent('custom-footer');
    expect(wrapper.findFilteringActions({ expandToViewport: true })!.getElement()).toHaveTextContent('custom-actions');
  });
});
