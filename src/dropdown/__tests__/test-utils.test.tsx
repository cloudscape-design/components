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
      expect(wrapper.findTrigger().getElement().querySelector('button')!.getAttribute('data-testid')).toEqual(
        'trigger'
      );
    });
  });

  describe('findOpenDropdown', () => {
    test('returns the dropdown content wrapper', () => {
      const { wrapper } = renderDropdown();
      expect(wrapper.findOpenDropdown()).not.toBeNull();
    });

    test('returns null when closed', () => {
      const { wrapper } = renderDropdown({ open: false });
      expect(wrapper.findOpenDropdown()).toBeNull();
    });

    test('returns the dropdown content wrapper with expandToViewport', () => {
      const { wrapper } = renderDropdown({ expandToViewport: true });
      expect(wrapper.findOpenDropdown({ expandToViewport: true })).not.toBeNull();
    });

    test('returns null when closed with expandToViewport', () => {
      const { wrapper } = renderDropdown({ open: false, expandToViewport: true });
      expect(wrapper.findOpenDropdown({ expandToViewport: true })).toBeNull();
    });
  });

  describe('findContent', () => {
    test('returns the dropdown content', () => {
      const { wrapper } = renderDropdown({ content: <div>content</div> });
      expect(wrapper.findOpenDropdown()!.findContent()).not.toBeNull();
    });
  });

  describe('findHeader', () => {
    test('returns the header when provided', () => {
      const { wrapper } = renderDropdown({ header: <div>header text</div> });
      expect(wrapper.findOpenDropdown()!.findHeader()!.getElement()).toHaveTextContent('header text');
    });

    test('returns null when no header is provided', () => {
      const { wrapper } = renderDropdown();
      expect(wrapper.findOpenDropdown()!.findHeader()).toBeNull();
    });
  });

  describe('findFooter', () => {
    test('returns the footer when provided', () => {
      const { wrapper } = renderDropdown({ footer: <div>footer text</div> });
      expect(wrapper.findOpenDropdown()!.findFooter()!.getElement()).toHaveTextContent('footer text');
    });

    test('returns null when no footer is provided', () => {
      const { wrapper } = renderDropdown();
      expect(wrapper.findOpenDropdown()!.findFooter()).toBeNull();
    });
  });

  describe('isOpen', () => {
    test('returns true when dropdown is open', () => {
      const { wrapper } = renderDropdown({ open: true });
      expect(wrapper.isOpen()).toBe(true);
    });

    test('returns false when dropdown is closed', () => {
      const { wrapper } = renderDropdown({ open: false });
      expect(wrapper.isOpen()).toBe(false);
    });

    test('returns true when dropdown is open with expandToViewport', () => {
      const { wrapper } = renderDropdown({ open: true, expandToViewport: true });
      expect(wrapper.isOpen({ expandToViewport: true })).toBe(true);
    });
  });
});
