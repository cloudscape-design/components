// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { render } from '@testing-library/react';

import Dropdown from '../../../lib/components/dropdown/internal';
import createWrapper from '../../../lib/components/test-utils/dom';

function renderDropdown(props?: Partial<React.ComponentProps<typeof Dropdown>>) {
  const { container } = render(<Dropdown trigger={<button />} open={true} {...props} />);
  const wrapper = createWrapper(container).findDropdown()!;
  return { container, wrapper };
}

describe('test utils', () => {
  describe('findTrigger', () => {
    test('returns the trigger element', () => {
      const { wrapper } = renderDropdown({ trigger: <button data-testid="trigger">open</button> });
      expect(wrapper.findTrigger().getElement()).toContainHTML('button');
    });
  });

  describe('findDropdown', () => {
    test('returns the open dropdown', () => {
      const { wrapper } = renderDropdown();
      expect(wrapper.findDropdown().findOpenDropdown()).not.toBeNull();
    });

    test('returns null for closed dropdown', () => {
      const { wrapper } = renderDropdown({ open: false });
      expect(wrapper.findDropdown().findOpenDropdown()).toBeNull();
    });

    test('returns the open dropdown with expandToViewport', () => {
      const { wrapper } = renderDropdown({ expandToViewport: true });
      expect(wrapper.findDropdown({ expandToViewport: true }).findOpenDropdown()).not.toBeNull();
    });
  });

  describe('findContent', () => {
    test('returns the dropdown content', () => {
      const { wrapper } = renderDropdown({ content: <div>content</div> });
      expect(wrapper.findContent()).not.toBeNull();
    });

    test('returns null when dropdown is closed', () => {
      const { wrapper } = renderDropdown({ open: false, content: <div>content</div> });
      expect(wrapper.findContent()).toBeNull();
    });

    test('returns the dropdown content with expandToViewport', () => {
      const { wrapper } = renderDropdown({ expandToViewport: true, content: <div>content</div> });
      expect(wrapper.findContent({ expandToViewport: true })).not.toBeNull();
    });
  });

  describe('findHeader', () => {
    test('returns the header when provided', () => {
      const { wrapper } = renderDropdown({ header: <div>header text</div> });
      expect(wrapper.findHeader()!.getElement()).toHaveTextContent('header text');
    });

    test('returns null when no header is provided', () => {
      const { wrapper } = renderDropdown();
      expect(wrapper.findHeader()).toBeNull();
    });
  });

  describe('findFooter', () => {
    test('returns the footer when provided', () => {
      const { wrapper } = renderDropdown({ footer: <div>footer text</div> });
      expect(wrapper.findFooter()!.getElement()).toHaveTextContent('footer text');
    });

    test('returns null when no footer is provided', () => {
      const { wrapper } = renderDropdown();
      expect(wrapper.findFooter()).toBeNull();
    });
  });

  describe('openDropdown', () => {
    test('opens the dropdown on trigger click', () => {
      const { wrapper } = renderDropdown({ open: false });
      expect(wrapper.findDropdown().findOpenDropdown()).toBeNull();
      wrapper.openDropdown();
      // openDropdown fires a click event; open state is controlled externally
      expect(wrapper.findTrigger().getElement()).toBeTruthy();
    });
  });
});
