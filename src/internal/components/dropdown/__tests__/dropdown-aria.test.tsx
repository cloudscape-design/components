// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import Dropdown from '../../../../../lib/components/internal/components/dropdown';
import DropdownWrapper from '../../../../../lib/components/test-utils/dom/internal/dropdown';

function renderDropdown(jsx: React.ReactElement) {
  const { container } = render(jsx);
  const dropdownElement = container.querySelector<HTMLElement>(`.${DropdownWrapper.rootSelector}`)!;
  return new DropdownWrapper(dropdownElement);
}

describe('Dropdown ARIA attributes', () => {
  describe('ariaRole', () => {
    test('applies role attribute when ariaRole is provided', () => {
      const wrapper = renderDropdown(
        <Dropdown trigger={<button />} open={true} ariaRole="dialog" content={<div>Content</div>} />
      );
      const dropdown = wrapper.findOpenDropdown()!.getElement();
      expect(dropdown).toHaveAttribute('role', 'dialog');
    });
  });

  describe('ariaLabel', () => {
    test('applies aria-label attribute when ariaLabel is provided', () => {
      const wrapper = renderDropdown(
        <Dropdown trigger={<button />} open={true} ariaLabel="Select options" content={<div>Content</div>} />
      );
      const dropdown = wrapper.findOpenDropdown()!.getElement();
      expect(dropdown).toHaveAttribute('aria-label', 'Select options');
    });
  });

  describe('ariaLabelledby', () => {
    test('applies aria-labelledby attribute when ariaLabelledby is provided', () => {
      const wrapper = renderDropdown(
        <Dropdown trigger={<button />} open={true} ariaLabelledby="label-id" content={<div>Content</div>} />
      );
      const dropdown = wrapper.findOpenDropdown()!.getElement();
      expect(dropdown).toHaveAttribute('aria-labelledby', 'label-id');
    });
  });

  describe('ariaDescribedby', () => {
    test('applies aria-describedby attribute when ariaDescribedby is provided', () => {
      const wrapper = renderDropdown(
        <Dropdown trigger={<button />} open={true} ariaDescribedby="description-id" content={<div>Content</div>} />
      );
      const dropdown = wrapper.findOpenDropdown()!.getElement();
      expect(dropdown).toHaveAttribute('aria-describedby', 'description-id');
    });
  });

  describe('dropdownContentId', () => {
    test('applies id attribute when dropdownContentId is provided', () => {
      const wrapper = renderDropdown(
        <Dropdown
          trigger={<button />}
          open={true}
          dropdownContentId="custom-dropdown-id"
          content={<div>Content</div>}
        />
      );
      const dropdown = wrapper.findOpenDropdown()!.getElement();
      expect(dropdown).toHaveAttribute('id', 'custom-dropdown-id');
    });
  });

  describe('aria-hidden', () => {
    test('sets aria-hidden to true when dropdown is closed', () => {
      const wrapper = renderDropdown(
        <Dropdown trigger={<button />} open={false} ariaRole="dialog" content={<div>Content</div>} />
      );
      // Dropdown content exists in DOM even when closed (for transitions)
      const dropdownContainer = wrapper.getElement().querySelector('[aria-hidden]');
      expect(dropdownContainer).toHaveAttribute('aria-hidden', 'true');
    });

    test('sets aria-hidden to false when dropdown is open', () => {
      const wrapper = renderDropdown(
        <Dropdown trigger={<button />} open={true} ariaRole="dialog" content={<div>Content</div>} />
      );
      const dropdown = wrapper.findOpenDropdown()!.getElement();
      expect(dropdown).toHaveAttribute('aria-hidden', 'false');
    });
  });
});
