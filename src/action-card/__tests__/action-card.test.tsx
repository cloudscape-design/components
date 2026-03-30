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
  describe('button element', () => {
    test('renders as a button element with type="button"', () => {
      const wrapper = renderActionCard();
      expect(wrapper.getElement().tagName).toBe('BUTTON');
      expect(wrapper.getElement()).toHaveAttribute('type', 'button');
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
      expect(wrapper.getElement()).not.toHaveAttribute('disabled');
    });

    test('applies disabled state when true', () => {
      const wrapper = renderActionCard({ disabled: true });
      expect(wrapper.isDisabled()).toBe(true);
      expect(wrapper.getElement()).not.toHaveAttribute('disabled');
      expect(wrapper.getElement()).toHaveAttribute('aria-disabled', 'true');
    });

    test('remains focusable when disabled', () => {
      const wrapper = renderActionCard({ disabled: true });
      wrapper.getElement().focus();
      expect(document.activeElement).toBe(wrapper.getElement());
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
  });

  describe('ariaLabel', () => {
    test('adds aria-label when provided', () => {
      const wrapper = renderActionCard({ ariaLabel: 'Card label' });
      expect(wrapper.getElement()).toHaveAttribute('aria-label', 'Card label');
    });

    test('does not add aria-label when not provided', () => {
      const wrapper = renderActionCard();
      expect(wrapper.getElement()).not.toHaveAttribute('aria-label');
    });

    test('does not set aria-labelledby when ariaLabel is provided', () => {
      const wrapper = renderActionCard({ ariaLabel: 'Card label', header: 'Header' });
      expect(wrapper.getElement()).not.toHaveAttribute('aria-labelledby');
    });
  });

  describe('aria-labelledby', () => {
    test('sets aria-labelledby from header id when no ariaLabel is provided', () => {
      const wrapper = renderActionCard({ header: 'Header' });
      const labelledBy = wrapper.getElement().getAttribute('aria-labelledby');
      expect(labelledBy).toBeTruthy();
      const labelEl = wrapper.getElement().querySelector(`#${labelledBy}`);
      expect(labelEl).toHaveTextContent('Header');
    });

    test('does not set aria-labelledby when no header and no ariaLabel', () => {
      const wrapper = renderActionCard();
      expect(wrapper.getElement()).not.toHaveAttribute('aria-labelledby');
    });
  });

  describe('ariaDescribedby', () => {
    test('uses provided ariaDescribedby over auto-generated description id', () => {
      const wrapper = renderActionCard({ ariaDescribedby: 'custom-id', description: 'Desc' });
      expect(wrapper.getElement()).toHaveAttribute('aria-describedby', 'custom-id');
    });

    test('auto-generates aria-describedby from description when no ariaDescribedby provided', () => {
      const wrapper = renderActionCard({ description: 'Desc' });
      const describedBy = wrapper.getElement().getAttribute('aria-describedby');
      expect(describedBy).toBeTruthy();
      const descEl = wrapper.getElement().querySelector(`#${describedBy}`);
      expect(descEl).toHaveTextContent('Desc');
    });

    test('does not set aria-describedby when neither ariaDescribedby nor description provided', () => {
      const wrapper = renderActionCard();
      expect(wrapper.getElement()).not.toHaveAttribute('aria-describedby');
    });
  });

  describe('focus management', () => {
    test('can be focused through the ref API', () => {
      let actionCard: ActionCardProps.Ref | null = null;
      const renderResult = render(<ActionCard ref={el => (actionCard = el)} />);
      const wrapper = createWrapper(renderResult.container);
      actionCard!.focus();
      expect(document.activeElement).toBe(wrapper.findActionCard()!.getElement());
    });
  });

  describe('icon', () => {
    test('renders icon with aria-hidden when provided', () => {
      const wrapper = renderActionCard({ icon: <span>icon</span> });
      const iconEl = wrapper.findIcon();
      expect(iconEl).not.toBeNull();
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
      expect(wrapper.getElement()).toHaveAttribute('data-testid', 'test-card');
      expect(wrapper.getElement()).toHaveAttribute('aria-controls', 'controlled-element');
    });

    test('concatenates className with internal classes', () => {
      const wrapper = renderActionCard({
        nativeButtonAttributes: {
          className: 'my-custom-class',
        },
      });
      expect(wrapper.getElement()).toHaveClass('my-custom-class');
    });

    test('chains event handlers', () => {
      const mainClick = jest.fn();
      const nativeClick = jest.fn();
      const wrapper = renderActionCard({
        onClick: mainClick,
        nativeButtonAttributes: {
          onClick: nativeClick,
        },
      });
      wrapper.click();
      expect(mainClick).toHaveBeenCalled();
      expect(nativeClick).toHaveBeenCalled();
    });
  });

  describe('combined ARIA attributes', () => {
    test('sets both aria-labelledby and aria-describedby when header and description are provided', () => {
      const wrapper = renderActionCard({ header: 'Header', description: 'Description' });
      const el = wrapper.getElement();

      const labelledBy = el.getAttribute('aria-labelledby');
      expect(labelledBy).toBeTruthy();
      expect(el.querySelector(`#${labelledBy}`)).toHaveTextContent('Header');

      const describedBy = el.getAttribute('aria-describedby');
      expect(describedBy).toBeTruthy();
      expect(el.querySelector(`#${describedBy}`)).toHaveTextContent('Description');

      expect(labelledBy).not.toBe(describedBy);
    });
  });

  describe('description without header', () => {
    test('renders description and sets aria-describedby when only description is provided', () => {
      const wrapper = renderActionCard({ description: 'Only description' });
      expect(wrapper.findDescription()!.getElement()).toHaveTextContent('Only description');
      expect(wrapper.findHeader()).toBeNull();

      const describedBy = wrapper.getElement().getAttribute('aria-describedby');
      expect(describedBy).toBeTruthy();
      expect(wrapper.getElement().querySelector(`#${describedBy}`)).toHaveTextContent('Only description');
    });

    test('does not set aria-labelledby when only description is provided', () => {
      const wrapper = renderActionCard({ description: 'Only description' });
      expect(wrapper.getElement()).not.toHaveAttribute('aria-labelledby');
    });
  });

  describe('variant', () => {
    test('renders with embedded variant', () => {
      const wrapper = renderActionCard({ variant: 'embedded', header: 'Header' });
      expect(wrapper.getElement()).toBeTruthy();
    });
  });

  describe('iconVerticalAlignment', () => {
    test('places icon in header row when alignment is top and header is present', () => {
      const wrapper = renderActionCard({ icon: <span>icon</span>, iconVerticalAlignment: 'top', header: 'Header' });
      expect(wrapper.findIcon()).not.toBeNull();
      expect(wrapper.findHeader()).not.toBeNull();
    });

    test('places icon outside header row when alignment is center', () => {
      const wrapper = renderActionCard({
        icon: <span>icon</span>,
        iconVerticalAlignment: 'center',
        header: 'Header',
      });
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
    test('renders with disableHeaderPaddings', () => {
      const wrapper = renderActionCard({ header: 'Header', disableHeaderPaddings: true });
      expect(wrapper.findHeader()!.getElement()).toHaveTextContent('Header');
    });

    test('renders with disableContentPaddings', () => {
      const wrapper = renderActionCard({ children: 'Content', disableContentPaddings: true });
      expect(wrapper.findContent()!.getElement()).toHaveTextContent('Content');
    });
  });

  describe('description with header', () => {
    test('renders both header and description together', () => {
      const wrapper = renderActionCard({ header: 'Header', description: 'Description' });
      expect(wrapper.findHeader()!.getElement()).toHaveTextContent('Header');
      expect(wrapper.findDescription()!.getElement()).toHaveTextContent('Description');
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
});
