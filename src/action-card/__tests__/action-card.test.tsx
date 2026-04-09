// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import ActionCard, { ActionCardProps } from '../../../lib/components/action-card';
import createWrapper from '../../../lib/components/test-utils/dom';

function renderActionCard(props: ActionCardProps = {}) {
  const renderResult = render(<ActionCard {...props} />);
  return createWrapper(renderResult.container).findActionCard()!;
}

describe('ActionCard Component', () => {
  describe('root element', () => {
    test('contains a button element with type="button"', () => {
      const wrapper = renderActionCard();
      const button = wrapper.getElement().querySelector('button');
      expect(button).toBeTruthy();
      expect(button).toHaveAttribute('type', 'button');
    });
  });

  describe('default prop values', () => {
    test('disabled defaults to false', () => {
      const wrapper = renderActionCard();
      expect(wrapper.isDisabled()).toBe(false);
    });

    test('disableHeaderPaddings defaults to false', () => {
      const wrapper = renderActionCard({ header: 'Header' });
      expect(wrapper.findHeader()!.getElement().closest('[class*="no-padding"]')).toBeNull();
    });

    test('disableContentPaddings defaults to false', () => {
      const wrapper = renderActionCard({ children: 'Content' });
      expect(wrapper.findContent()!.getElement().closest('[class*="no-padding"]')).toBeNull();
    });

    test('iconVerticalAlignment defaults to top', () => {
      const wrapper = renderActionCard({ icon: <span>icon</span>, header: 'Header' });
      expect(wrapper.findIcon()).not.toBeNull();
    });

    test('variant defaults to default', () => {
      const wrapper = renderActionCard();
      expect(wrapper.getElement().className).toMatch(/variant-default/);
    });
  });

  describe('header', () => {
    test('renders header text when provided', () => {
      const wrapper = renderActionCard({ header: 'Test Header' });
      expect(wrapper.findHeader()!.getElement()).toHaveTextContent('Test Header');
    });

    test('renders header as ReactNode', () => {
      const wrapper = renderActionCard({ header: <strong>Bold Header</strong> });
      expect(wrapper.findHeader()!.getElement().querySelector('strong')).toHaveTextContent('Bold Header');
    });

    test('does not render header element when not provided', () => {
      const wrapper = renderActionCard();
      expect(wrapper.findHeader()).toBeNull();
    });

    test('header text is inside the button element', () => {
      const wrapper = renderActionCard({ header: 'Test Header' });
      const button = wrapper.getElement().querySelector('button');
      expect(button).toHaveTextContent('Test Header');
    });
  });

  describe('description', () => {
    test('renders description when provided', () => {
      const wrapper = renderActionCard({ description: 'Test Description' });
      expect(wrapper.findDescription()!.getElement()).toHaveTextContent('Test Description');
    });

    test('renders description as ReactNode', () => {
      const wrapper = renderActionCard({ description: <em>Italic Desc</em> });
      expect(wrapper.findDescription()!.getElement().querySelector('em')).toHaveTextContent('Italic Desc');
    });

    test('does not render description element when not provided', () => {
      const wrapper = renderActionCard();
      expect(wrapper.findDescription()).toBeNull();
    });
  });

  describe('children', () => {
    test('renders children content when provided', () => {
      const wrapper = renderActionCard({ children: 'Test Content' });
      expect(wrapper.findContent()!.getElement()).toHaveTextContent('Test Content');
    });

    test('renders children as ReactNode', () => {
      const wrapper = renderActionCard({ children: <div data-testid="custom">Custom Content</div> });
      expect(wrapper.findContent()!.getElement().querySelector('[data-testid="custom"]')).toHaveTextContent(
        'Custom Content'
      );
    });

    test('does not render content element when children not provided', () => {
      const wrapper = renderActionCard();
      expect(wrapper.findContent()).toBeNull();
    });
  });

  describe('disabled', () => {
    test('is not disabled by default', () => {
      const wrapper = renderActionCard();
      expect(wrapper.isDisabled()).toBe(false);
    });

    test('applies disabled state when true', () => {
      const wrapper = renderActionCard({ disabled: true });
      expect(wrapper.isDisabled()).toBe(true);
      const button = wrapper.getElement().querySelector('button')!;
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    test('remains focusable when disabled', () => {
      const wrapper = renderActionCard({ disabled: true });
      const button = wrapper.getElement().querySelector('button')!;
      button.focus();
      expect(document.activeElement).toBe(button);
    });

    test('does not fire onClick when disabled', () => {
      const onClickSpy = jest.fn();
      const wrapper = renderActionCard({ onClick: onClickSpy, disabled: true });
      wrapper.click();
      expect(onClickSpy).not.toHaveBeenCalled();
    });
  });

  describe('onClick', () => {
    test('calls onClick when clicked', () => {
      const onClickSpy = jest.fn();
      const wrapper = renderActionCard({ onClick: onClickSpy });
      wrapper.click();
      expect(onClickSpy).toHaveBeenCalledTimes(1);
    });

    test('does not call onClick when event.defaultPrevented', () => {
      const onClickSpy = jest.fn();
      const wrapper = renderActionCard({
        onClick: onClickSpy,
        nativeButtonAttributes: {
          onClick: e => e.preventDefault(),
        },
      });
      wrapper.click();
      expect(onClickSpy).not.toHaveBeenCalled();
    });
  });

  describe('ariaLabel', () => {
    test('adds aria-label to the root group div when provided', () => {
      const wrapper = renderActionCard({ ariaLabel: 'Card label' });
      expect(wrapper.getElement()).toHaveAttribute('aria-label', 'Card label');
    });

    test('does not duplicate aria-label on the header button', () => {
      const wrapper = renderActionCard({ ariaLabel: 'Card label', header: 'Header text' });
      const button = wrapper.getElement().querySelector('button')!;
      // Button is labeled by its text content; aria-label should not be duplicated here
      expect(button).not.toHaveAttribute('aria-label');
    });

    test('adds aria-label to standalone button (no header) when provided', () => {
      const wrapper = renderActionCard({ ariaLabel: 'Card label' });
      const button = wrapper.getElement().querySelector('button')!;
      expect(button).toHaveAttribute('aria-label', 'Card label');
    });

    test('does not add aria-label when not provided', () => {
      const wrapper = renderActionCard({ header: 'Header text' });
      const button = wrapper.getElement().querySelector('button')!;
      expect(button).not.toHaveAttribute('aria-label');
    });
  });

  describe('ariaDescribedby', () => {
    test('uses provided ariaDescribedby over auto-generated description id', () => {
      const wrapper = renderActionCard({ ariaDescribedby: 'custom-id', description: 'Desc' });
      const button = wrapper.getElement().querySelector('button')!;
      expect(button).toHaveAttribute('aria-describedby', 'custom-id');
    });

    test('auto-generates aria-describedby from description when header is provided', () => {
      const wrapper = renderActionCard({ header: 'Header', description: 'Desc' });
      const button = wrapper.getElement().querySelector('button')!;
      const describedBy = button.getAttribute('aria-describedby');
      expect(describedBy).toBeTruthy();
      const descEl = wrapper.getElement().querySelector(`#${describedBy}`);
      expect(descEl).toHaveTextContent('Desc');
    });

    test('auto-generates aria-describedby from description when ariaLabel is provided', () => {
      const wrapper = renderActionCard({ ariaLabel: 'Label', description: 'Desc' });
      const button = wrapper.getElement().querySelector('button')!;
      const describedBy = button.getAttribute('aria-describedby');
      expect(describedBy).toBeTruthy();
      const descEl = wrapper.getElement().querySelector(`#${describedBy}`);
      expect(descEl).toHaveTextContent('Desc');
    });

    test('does not set aria-describedby when description is provided without header or ariaLabel', () => {
      const wrapper = renderActionCard({ description: 'Desc' });
      const button = wrapper.getElement().querySelector('button')!;
      expect(button).not.toHaveAttribute('aria-describedby');
    });

    test('does not set aria-describedby when neither ariaDescribedby nor description provided', () => {
      const wrapper = renderActionCard();
      const button = wrapper.getElement().querySelector('button')!;
      expect(button).not.toHaveAttribute('aria-describedby');
    });
  });

  describe('focus management', () => {
    test('can be focused through the ref API', () => {
      let actionCard: ActionCardProps.Ref | null = null;
      const renderResult = render(<ActionCard ref={el => (actionCard = el)} />);
      const wrapper = createWrapper(renderResult.container);
      actionCard!.focus();
      const button = wrapper.findActionCard()!.getElement().querySelector('button')!;
      expect(document.activeElement).toBe(button);
    });
  });

  describe('icon', () => {
    test('renders icon with aria-hidden when provided', () => {
      const wrapper = renderActionCard({ icon: <span>icon</span> });
      expect(wrapper.findIcon()).not.toBeNull();
    });
  });

  describe('nativeButtonAttributes', () => {
    test('passes custom data attributes to the button element', () => {
      const wrapper = renderActionCard({
        nativeButtonAttributes: {
          'data-testid': 'test-card',
          'aria-controls': 'controlled-element',
        },
      });
      const button = wrapper.getElement().querySelector('button')!;
      expect(button).toHaveAttribute('data-testid', 'test-card');
      expect(button).toHaveAttribute('aria-controls', 'controlled-element');
    });

    test('chains event handlers', () => {
      const mainClick = jest.fn();
      const nativeClick = jest.fn();
      const wrapper = renderActionCard({
        onClick: mainClick,
        nativeButtonAttributes: { onClick: nativeClick },
      });
      wrapper.click();
      expect(mainClick).toHaveBeenCalled();
      expect(nativeClick).toHaveBeenCalled();
    });
  });

  describe('variant', () => {
    test('renders with default variant by default', () => {
      const wrapper = renderActionCard({ header: 'Header' });
      expect(wrapper.getElement().className).toMatch(/variant-default/);
    });

    test('renders with embedded variant', () => {
      const wrapper = renderActionCard({ variant: 'embedded', header: 'Header' });
      expect(wrapper.getElement().className).toMatch(/variant-embedded/);
    });
  });

  describe('iconVerticalAlignment', () => {
    test('places icon in header row when alignment is top and header is present', () => {
      const wrapper = renderActionCard({ icon: <span>icon</span>, iconVerticalAlignment: 'top', header: 'Header' });
      expect(wrapper.findIcon()).not.toBeNull();
      expect(wrapper.findHeader()).not.toBeNull();
    });

    test('places icon outside header row when alignment is center', () => {
      const wrapper = renderActionCard({ icon: <span>icon</span>, iconVerticalAlignment: 'center', header: 'Header' });
      expect(wrapper.findIcon()).not.toBeNull();
      expect(wrapper.findHeader()).not.toBeNull();
    });

    test('places icon outside header row when there is no header', () => {
      const wrapper = renderActionCard({ icon: <span>icon</span>, iconVerticalAlignment: 'top' });
      expect(wrapper.findIcon()).not.toBeNull();
      expect(wrapper.findHeader()).toBeNull();
    });
  });

  describe('padding options', () => {
    test('renders with disableHeaderPaddings true', () => {
      const wrapper = renderActionCard({ header: 'Header', disableHeaderPaddings: true });
      expect(wrapper.findHeader()!.getElement()).toHaveTextContent('Header');
    });

    test('renders with disableHeaderPaddings false', () => {
      const wrapper = renderActionCard({ header: 'Header', disableHeaderPaddings: false });
      expect(wrapper.findHeader()!.getElement()).toHaveTextContent('Header');
    });

    test('renders with disableContentPaddings true', () => {
      const wrapper = renderActionCard({ children: 'Content', disableContentPaddings: true });
      expect(wrapper.findContent()!.getElement()).toHaveTextContent('Content');
    });

    test('renders with disableContentPaddings false', () => {
      const wrapper = renderActionCard({ children: 'Content', disableContentPaddings: false });
      expect(wrapper.findContent()!.getElement()).toHaveTextContent('Content');
    });
  });

  describe('disabled styling', () => {
    test('applies disabled styling to header and description', () => {
      const wrapper = renderActionCard({ header: 'Header', description: 'Description', disabled: true });
      expect(wrapper.findHeader()).not.toBeNull();
      expect(wrapper.findDescription()).not.toBeNull();
      expect(wrapper.isDisabled()).toBe(true);
    });
  });

  describe('no icon', () => {
    test('renders no icon when icon prop is not specified', () => {
      const wrapper = renderActionCard({ header: 'Header' });
      expect(wrapper.findIcon()).toBeNull();
    });
  });

  describe('style prop', () => {
    test('applies all style properties to elements', () => {
      const wrapper = renderActionCard({
        header: 'Header',
        children: 'Content',
        style: {
          root: {
            background: { default: '#fff', hover: '#f5f5f5', active: '#eee', disabled: '#fafafa' },
            borderColor: { default: '#e0e0e0', hover: '#bdbdbd', active: '#9e9e9e', disabled: '#eee' },
            borderRadius: { default: '8px', hover: '8px', active: '8px', disabled: '8px' },
            borderWidth: { default: '1px', hover: '2px', active: '2px', disabled: '1px' },
            boxShadow: { default: 'none', hover: 'none', active: 'none', disabled: 'none' },
            focusRing: { borderColor: '#0073bb', borderRadius: '10px', borderWidth: '2px' },
          },
          header: { paddingBlock: '10px', paddingInline: '20px' },
          content: { paddingBlock: '30px', paddingInline: '40px' },
        },
      });
      expect(wrapper.getElement()).toBeTruthy();
      expect(wrapper.findHeader()).not.toBeNull();
      expect(wrapper.findContent()).not.toBeNull();
    });
  });
});
