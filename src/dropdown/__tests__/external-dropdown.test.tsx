// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, screen } from '@testing-library/react';

import Dropdown from '../../../lib/components/dropdown';
import DropdownWrapper from '../../../lib/components/test-utils/dom/dropdown';

function renderDropdown(dropdown: React.ReactElement): { wrapper: DropdownWrapper; container: HTMLElement } {
  const { container } = render(dropdown);
  const dropdownElement = container.querySelector<HTMLElement>(`.${DropdownWrapper.rootSelector}`)!;
  return {
    wrapper: new DropdownWrapper(dropdownElement),
    container,
  };
}

describe('External Dropdown Component', () => {
  describe('Basic rendering', () => {
    test('renders trigger', () => {
      const { wrapper } = renderDropdown(
        <Dropdown trigger={<button>Open</button>} open={false} content={<div>Content</div>} />
      );
      expect(wrapper.findTrigger().getElement()).toHaveTextContent('Open');
    });

    test('renders header, content and footer when open', () => {
      const { wrapper } = renderDropdown(
        <Dropdown
          trigger={<button>Open</button>}
          open={true}
          header={<div>Header</div>}
          content={<div>Content</div>}
          footer={<div>Footer</div>}
        />
      );
      expect(wrapper.findHeader()?.getElement()).toHaveTextContent('Header');
      expect(wrapper.findContent()?.getElement()).toHaveTextContent('Content');
      expect(wrapper.findFooter()?.getElement()).toHaveTextContent('Footer');
    });

    test('isOpen reflects open state', () => {
      const { wrapper } = renderDropdown(
        <Dropdown trigger={<button>Open</button>} open={false} content={<div>Content</div>} />
      );
      expect(wrapper.isOpen()).toBe(false);

      const { wrapper: openWrapper } = renderDropdown(
        <Dropdown trigger={<button>Open</button>} open={true} content={<div>Content</div>} />
      );
      expect(openWrapper.isOpen()).toBe(true);
    });
  });

  describe('onDismiss callback', () => {
    test('fires when clicking outside', () => {
      const handleDismiss = jest.fn();
      render(
        <div>
          <button data-testid="outside">Outside</button>
          <Dropdown
            trigger={<button>Open</button>}
            open={true}
            content={<div>Content</div>}
            onDismiss={handleDismiss}
          />
        </div>
      );

      screen.getByTestId('outside').click();
      expect(handleDismiss).toHaveBeenCalledTimes(1);
    });

    test('does not fire when clicking inside content', () => {
      const handleDismiss = jest.fn();
      renderDropdown(
        <Dropdown
          trigger={<button>Open</button>}
          open={true}
          content={<button data-testid="inside">Inside</button>}
          onDismiss={handleDismiss}
        />
      );

      screen.getByTestId('inside').click();
      expect(handleDismiss).not.toHaveBeenCalled();
    });
  });

  describe('Width constraints', () => {
    test('applies both minWidth and maxWidth', () => {
      renderDropdown(
        <Dropdown
          trigger={<button>Open</button>}
          open={true}
          minWidth={200}
          maxWidth={500}
          content={<div data-testid="content">Content</div>}
        />
      );
      const contentParent = screen.getByTestId('content').parentElement;
      expect(contentParent).toHaveStyle({ minWidth: '200px', maxWidth: '500px' });
    });

    test('accepts "trigger" as minWidth', () => {
      const { wrapper } = renderDropdown(
        <Dropdown trigger={<button>Open</button>} open={true} minWidth="trigger" content={<div>Content</div>} />
      );
      expect(wrapper.findContent()).toBeTruthy();
    });

    test('accepts "trigger" as maxWidth', () => {
      const { wrapper } = renderDropdown(
        <Dropdown trigger={<button>Open</button>} open={true} maxWidth="trigger" content={<div>Content</div>} />
      );
      expect(wrapper.findContent()).toBeTruthy();
    });
  });

  describe('Alignment', () => {
    test('accepts "start" alignment', () => {
      const { wrapper } = renderDropdown(
        <Dropdown trigger={<button>Open</button>} open={true} preferredAlignment="start" content={<div>Content</div>} />
      );
      expect(wrapper.isOpen()).toBe(true);
    });

    test('accepts "center" alignment', () => {
      const { wrapper } = renderDropdown(
        <Dropdown
          trigger={<button>Open</button>}
          open={true}
          preferredAlignment="center"
          content={<div>Content</div>}
        />
      );
      expect(wrapper.isOpen()).toBe(true);
    });
  });

  describe('ARIA attributes', () => {
    test('applies role', () => {
      const { wrapper } = renderDropdown(
        <Dropdown trigger={<button>Open</button>} open={true} role="menu" content={<div>Content</div>} />
      );
      expect(wrapper.findOpenDropdown()?.getElement()).toHaveAttribute('role', 'menu');
    });

    test('applies ariaLabel with generated hidden label element', () => {
      const { wrapper, container } = renderDropdown(
        <Dropdown trigger={<button>Open</button>} open={true} ariaLabel="Test label" content={<div>Content</div>} />
      );
      const dropdown = wrapper.findOpenDropdown()?.getElement();
      const labelledBy = dropdown?.getAttribute('aria-labelledby');

      expect(labelledBy).toBeTruthy();
      const labelElement = container.querySelector(`#${labelledBy}`);
      expect(labelElement).toHaveTextContent('Test label');
      expect(labelElement).toHaveStyle({ display: 'none' });
    });

    test('applies ariaLabelledby', () => {
      render(<div id="custom-label">Custom Label</div>);
      const { wrapper } = renderDropdown(
        <Dropdown
          trigger={<button>Open</button>}
          open={true}
          ariaLabelledby="custom-label"
          content={<div>Content</div>}
        />
      );
      expect(wrapper.findOpenDropdown()?.getElement()).toHaveAttribute('aria-labelledby', 'custom-label');
    });

    test('applies ariaDescribedby', () => {
      render(<div id="description">Description</div>);
      const { wrapper } = renderDropdown(
        <Dropdown
          trigger={<button>Open</button>}
          open={true}
          ariaDescribedby="description"
          content={<div>Content</div>}
        />
      );
      expect(wrapper.findOpenDropdown()?.getElement()).toHaveAttribute('aria-describedby', 'description');
    });
  });

  describe('Focus events', () => {
    test('fires onFocusIn when focus enters dropdown', () => {
      const handleFocusIn = jest.fn();
      renderDropdown(
        <Dropdown
          trigger={<button>Open</button>}
          open={true}
          onFocusIn={handleFocusIn}
          content={<button data-testid="inside">Inside</button>}
        />
      );

      screen.getByTestId('inside').focus();
      expect(handleFocusIn).toHaveBeenCalledTimes(1);
    });

    test('fires onFocusOut when focus leaves dropdown', () => {
      const handleFocusOut = jest.fn();
      render(
        <div>
          <button data-testid="outside">Outside</button>
          <Dropdown
            trigger={<button>Open</button>}
            open={true}
            onFocusOut={handleFocusOut}
            content={<button data-testid="inside">Inside</button>}
          />
        </div>
      );

      screen.getByTestId('inside').focus();
      screen.getByTestId('outside').focus();
      expect(handleFocusOut).toHaveBeenCalledTimes(1);
    });
  });

  describe('expandToViewport', () => {
    test('renders content in portal when enabled', () => {
      const { wrapper } = renderDropdown(
        <Dropdown
          trigger={<button>Open</button>}
          open={true}
          expandToViewport={true}
          content={<div data-testid="content">Portal content</div>}
        />
      );
      expect(wrapper.findContent({ expandToViewport: true })).toBeTruthy();
      expect(screen.getByTestId('content')).toBeInTheDocument();
    });
  });
});
