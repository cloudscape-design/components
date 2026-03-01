// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import ActionCard, { ActionCardProps } from '../../../lib/components/action-card';
import createWrapper from '../../../lib/components/test-utils/dom';

import styles from '../../../lib/components/action-card/styles.css.js';

function renderActionCard(props: ActionCardProps = {}) {
  const renderResult = render(<ActionCard {...props} />);
  return createWrapper(renderResult.container).findActionCard()!;
}

describe('ActionCard Component', () => {
  describe('header property', () => {
    test('renders header when provided', () => {
      const wrapper = renderActionCard({ header: 'Test Header' });
      expect(wrapper.findHeader()!.getElement()).toHaveTextContent('Test Header');
    });

    test('does not render header element when not provided', () => {
      const wrapper = renderActionCard();
      expect(wrapper.findHeader()).toBeNull();
    });
  });

  describe('description property', () => {
    test('renders description when provided', () => {
      const wrapper = renderActionCard({ description: 'Test Description' });
      expect(wrapper.findDescription()!.getElement()).toHaveTextContent('Test Description');
    });

    test('does not render description element when not provided', () => {
      const wrapper = renderActionCard();
      expect(wrapper.findDescription()).toBeNull();
    });
  });

  describe('children property', () => {
    test('renders children content when provided', () => {
      const wrapper = renderActionCard({ children: 'Test Content' });
      expect(wrapper.findContent()!.getElement()).toHaveTextContent('Test Content');
    });

    test('does not render content element when children not provided', () => {
      const wrapper = renderActionCard();
      expect(wrapper.findContent()).toBeNull();
    });
  });

  describe('disabled property', () => {
    test('renders action card with normal styling by default', () => {
      const wrapper = renderActionCard();
      expect(wrapper.isDisabled()).toEqual(false);
      expect(wrapper.getElement()).not.toHaveAttribute('disabled');
      expect(wrapper.getElement()).not.toHaveClass(styles.disabled);
    });

    test('renders action card with disabled styling when true', () => {
      const wrapper = renderActionCard({ disabled: true });
      expect(wrapper.isDisabled()).toEqual(true);
      expect(wrapper.getElement()).toHaveClass(styles.disabled);
      expect(wrapper.getElement()).toHaveAttribute('disabled');
      expect(wrapper.getElement()).toHaveAttribute('aria-disabled', 'true');
    });

    test('does not call onClick when disabled', () => {
      const onClickSpy = jest.fn();
      const wrapper = renderActionCard({ onClick: onClickSpy, disabled: true });
      wrapper.click();
      expect(onClickSpy).not.toHaveBeenCalled();
    });
  });

  describe('onClick property', () => {
    test('calls onClick when the action card is clicked', () => {
      const onClickSpy = jest.fn();
      const wrapper = renderActionCard({ onClick: onClickSpy });
      wrapper.click();
      expect(onClickSpy).toHaveBeenCalled();
    });

    test('does not call onClick when disabled', () => {
      const onClickSpy = jest.fn();
      const wrapper = renderActionCard({ onClick: onClickSpy, disabled: true });
      wrapper.click();
      expect(onClickSpy).not.toHaveBeenCalled();
    });
  });

  describe('ariaLabel property', () => {
    test('adds aria-label attribute when provided', () => {
      const wrapper = renderActionCard({ ariaLabel: 'Test Aria Label' });
      expect(wrapper.getElement()).toHaveAttribute('aria-label', 'Test Aria Label');
    });

    test('does not add aria-label when not provided', () => {
      const wrapper = renderActionCard();
      expect(wrapper.getElement()).not.toHaveAttribute('aria-label');
    });
  });

  describe('ariaDescribedby property', () => {
    test('adds aria-describedby attribute when provided', () => {
      const wrapper = renderActionCard({ ariaDescribedby: 'description-id' });
      expect(wrapper.getElement()).toHaveAttribute('aria-describedby', 'description-id');
    });

    test('does not add aria-describedby when not provided', () => {
      const wrapper = renderActionCard();
      expect(wrapper.getElement()).not.toHaveAttribute('aria-describedby');
    });
  });

  describe('iconName property', () => {
    test('does not render icon element when no icon provided', () => {
      const wrapper = renderActionCard();
      expect(wrapper.findIcon()).toBeNull();
    });

    test('renders icon when iconName provided', () => {
      const wrapper = renderActionCard({ iconName: 'settings' });
      expect(wrapper.findIcon()).not.toBeNull();
    });
  });

  describe('iconUrl property', () => {
    const iconUrl = 'data:image/png;base64,aaaa';
    const iconAlt = 'Custom icon';

    test('renders custom icon with iconUrl', () => {
      const wrapper = renderActionCard({ iconUrl, iconAlt });
      const icon = wrapper.findIcon();
      expect(icon).not.toBeNull();
      expect(icon!.find('img')!.getElement()).toHaveAttribute('src', iconUrl);
    });

    test('renders custom icon with alt text', () => {
      const wrapper = renderActionCard({ iconUrl, iconAlt });
      const icon = wrapper.findIcon();
      expect(icon!.find('img')!.getElement()).toHaveAttribute('alt', iconAlt);
    });
  });

  describe('iconSvg property', () => {
    const iconSvg = (
      <svg className="test-svg" focusable="false">
        <circle cx="8" cy="8" r="7" />
      </svg>
    );

    test('renders custom SVG icon', () => {
      const wrapper = renderActionCard({ iconSvg });
      const icon = wrapper.findIcon();
      expect(icon).not.toBeNull();
      expect(icon!.findByClassName('test-svg')).not.toBeNull();
    });
  });

  describe('iconPosition property', () => {
    test('renders icon on the left by default', () => {
      const wrapper = renderActionCard({ iconName: 'settings', header: 'Header' });
      const icon = wrapper.findIcon();
      const header = wrapper.findHeader();
      expect(icon).not.toBeNull();
      expect(header).not.toBeNull();
      // Icon should come before the body content in DOM order
      const iconElement = icon!.getElement();
      const headerElement = header!.getElement();
      const iconPosition = iconElement.compareDocumentPosition(headerElement);
      // DOCUMENT_POSITION_FOLLOWING = 4 means header follows icon
      expect(iconPosition & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    });

    test('renders icon on the right when specified', () => {
      const wrapper = renderActionCard({ iconName: 'settings', iconPosition: 'right', header: 'Header' });
      const icon = wrapper.findIcon();
      const header = wrapper.findHeader();
      expect(icon).not.toBeNull();
      expect(header).not.toBeNull();
      // Icon should come after the body content in DOM order
      const iconElement = icon!.getElement();
      const headerElement = header!.getElement();
      const iconPosition = iconElement.compareDocumentPosition(headerElement);
      // DOCUMENT_POSITION_PRECEDING = 2 means header precedes icon
      expect(iconPosition & Node.DOCUMENT_POSITION_PRECEDING).toBeTruthy();
    });
  });

  describe('iconVerticalAlignment property', () => {
    test('has top alignment by default', () => {
      const wrapper = renderActionCard({ iconName: 'settings' });
      expect(wrapper.getElement()).toHaveClass(styles['icon-vertical-align-top']);
    });

    test('applies center alignment when specified', () => {
      const wrapper = renderActionCard({ iconName: 'settings', iconVerticalAlignment: 'center' });
      expect(wrapper.getElement()).toHaveClass(styles['icon-vertical-align-center']);
    });

    test('applies bottom alignment when specified', () => {
      const wrapper = renderActionCard({ iconName: 'settings', iconVerticalAlignment: 'bottom' });
      expect(wrapper.getElement()).toHaveClass(styles['icon-vertical-align-bottom']);
    });
  });

  describe('focus management', () => {
    test('can be focused through the API', () => {
      let actionCard: ActionCardProps.Ref | null = null;
      const renderResult = render(<ActionCard ref={el => (actionCard = el)} />);
      const wrapper = createWrapper(renderResult.container);
      actionCard!.focus();
      expect(document.activeElement).toBe(wrapper.findActionCard()!.getElement());
    });
  });

  describe('button element', () => {
    test('renders as a button element', () => {
      const wrapper = renderActionCard();
      expect(wrapper.getElement().tagName).toBe('BUTTON');
    });

    test('has type="button" attribute', () => {
      const wrapper = renderActionCard();
      expect(wrapper.getElement()).toHaveAttribute('type', 'button');
    });
  });
});
