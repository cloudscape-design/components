// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import ActionCard, { ActionCardProps } from '../../../lib/components/action-card';
import createWrapper from '../../../lib/components/test-utils/dom';
import customCssProps from '../../internal/generated/custom-css-properties';

import styles from '../../../lib/components/action-card/styles.css.js';

function renderActionCard(props: ActionCardProps = {}) {
  const renderResult = render(<ActionCard {...props} />);
  return createWrapper(renderResult.container).findActionCard()!;
}

describe('ActionCard Component', () => {
  describe('root element', () => {
    test('contains a button element with type="button"', () => {
      // This test is used for accessibility reasons. The button acts as the interactive layer (active, hover, click).
      const wrapper = renderActionCard();
      const button = wrapper.getElement().querySelector('button');
      expect(button).toBeTruthy();
      expect(button).toHaveAttribute('type', 'button');
    });
  });

  describe('header', () => {
    test('renders header as ReactNode', () => {
      const wrapper = renderActionCard({ header: <span data-testid="custom">Custom Header</span> });
      expect(wrapper.findHeader()!.getElement().querySelector('[data-testid="custom"]')).toHaveTextContent(
        'Custom Header'
      );
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
    test('renders description as ReactNode', () => {
      const wrapper = renderActionCard({ description: <span data-testid="custom">Custom Description</span> });
      expect(wrapper.findDescription()!.getElement().querySelector('[data-testid="custom"]')).toHaveTextContent(
        'Custom Description'
      );
    });

    test('does not render description element when not provided', () => {
      const wrapper = renderActionCard();
      expect(wrapper.findDescription()).toBeNull();
    });
  });

  describe('children', () => {
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

    test('applies disabled state when disabled=true', () => {
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
    test('fires onClick exactly once per click', () => {
      const onClickSpy = jest.fn();
      const wrapper = renderActionCard({ onClick: onClickSpy });
      wrapper.click();
      expect(onClickSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('ariaLabel', () => {
    test('root always has role=group', () => {
      const withHeader = renderActionCard({ header: 'Header' });
      expect(withHeader.getElement()).toHaveAttribute('role', 'group');

      const withoutHeader = renderActionCard({ ariaLabel: 'Card label' });
      expect(withoutHeader.getElement()).toHaveAttribute('role', 'group');
    });

    test('root is labelledby the header button', () => {
      const wrapper = renderActionCard({ header: 'Header text' });
      const button = wrapper.getElement().querySelector('button')!;
      expect(wrapper.getElement()).toHaveAttribute('aria-labelledby', button.id);
    });

    test('root is labelledby the standalone button when no header', () => {
      const wrapper = renderActionCard({ ariaLabel: 'Card label' });
      const button = wrapper.getElement().querySelector('button')!;
      expect(wrapper.getElement()).toHaveAttribute('aria-labelledby', button.id);
    });

    test('standalone button carries aria-label when no header', () => {
      const wrapper = renderActionCard({ ariaLabel: 'Card label' });
      const button = wrapper.getElement().querySelector('button')!;
      expect(button).toHaveAttribute('aria-label', 'Card label');
    });

    test('header button does not get aria-label', () => {
      const wrapper = renderActionCard({ ariaLabel: 'Card label', header: 'Header text' });
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
      expect(button).toHaveFocus();
    });
  });

  describe('icon', () => {
    test('renders icon when provided', () => {
      const wrapper = renderActionCard({ icon: <span>icon</span> });
      expect(wrapper.findIcon()).not.toBeNull();
    });

    test('renders no icon when icon prop is not specified', () => {
      const wrapper = renderActionCard({ header: 'Header' });
      expect(wrapper.findIcon()).toBeNull();
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
      expect(wrapper.getElement()).toHaveClass(styles['variant-default']);
    });

    test('renders with embedded variant', () => {
      const wrapper = renderActionCard({ variant: 'embedded', header: 'Header' });
      expect(wrapper.getElement()).toHaveClass(styles['variant-embedded']);
    });
  });

  describe('padding options', () => {
    test('applies no-padding class to header when disableHeaderPaddings is true', () => {
      const wrapper = renderActionCard({ header: 'Header', disableHeaderPaddings: true });
      expect(wrapper.findByClassName(styles.header)!.getElement()).toHaveClass(styles['no-padding']);
    });

    test('does not apply no-padding class to header by default', () => {
      const wrapper = renderActionCard({ header: 'Header' });
      expect(wrapper.findByClassName(styles.header)!.getElement()).not.toHaveClass(styles['no-padding']);
    });

    test('applies no-padding class to body when disableContentPaddings is true', () => {
      const wrapper = renderActionCard({ children: 'Content', disableContentPaddings: true });
      expect(wrapper.findContent()!.getElement()).toHaveClass(styles['no-padding']);
    });

    test('does not apply no-padding class to body by default', () => {
      const wrapper = renderActionCard({ children: 'Content' });
      expect(wrapper.findContent()!.getElement()).not.toHaveClass(styles['no-padding']);
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

      const rootStyle = getComputedStyle(wrapper.getElement());

      // Root background custom properties
      expect(rootStyle.getPropertyValue(customCssProps.styleActionCardBackgroundDefault)).toBe('#fff');
      expect(rootStyle.getPropertyValue(customCssProps.styleActionCardBackgroundHover)).toBe('#f5f5f5');
      expect(rootStyle.getPropertyValue(customCssProps.styleActionCardBackgroundActive)).toBe('#eee');
      expect(rootStyle.getPropertyValue(customCssProps.styleActionCardBackgroundDisabled)).toBe('#fafafa');

      // Root borderColor custom properties
      expect(rootStyle.getPropertyValue(customCssProps.styleActionCardBorderColorDefault)).toBe('#e0e0e0');
      expect(rootStyle.getPropertyValue(customCssProps.styleActionCardBorderColorHover)).toBe('#bdbdbd');
      expect(rootStyle.getPropertyValue(customCssProps.styleActionCardBorderColorActive)).toBe('#9e9e9e');
      expect(rootStyle.getPropertyValue(customCssProps.styleActionCardBorderColorDisabled)).toBe('#eee');

      // Root borderRadius custom properties
      expect(rootStyle.getPropertyValue(customCssProps.styleActionCardBorderRadiusDefault)).toBe('8px');
      expect(rootStyle.getPropertyValue(customCssProps.styleActionCardBorderRadiusHover)).toBe('8px');
      expect(rootStyle.getPropertyValue(customCssProps.styleActionCardBorderRadiusActive)).toBe('8px');
      expect(rootStyle.getPropertyValue(customCssProps.styleActionCardBorderRadiusDisabled)).toBe('8px');

      // Root borderWidth custom properties
      expect(rootStyle.getPropertyValue(customCssProps.styleActionCardBorderWidthDefault)).toBe('1px');
      expect(rootStyle.getPropertyValue(customCssProps.styleActionCardBorderWidthHover)).toBe('2px');
      expect(rootStyle.getPropertyValue(customCssProps.styleActionCardBorderWidthActive)).toBe('2px');
      expect(rootStyle.getPropertyValue(customCssProps.styleActionCardBorderWidthDisabled)).toBe('1px');

      // Root boxShadow custom properties
      expect(rootStyle.getPropertyValue(customCssProps.styleActionCardBoxShadowDefault)).toBe('none');
      expect(rootStyle.getPropertyValue(customCssProps.styleActionCardBoxShadowHover)).toBe('none');
      expect(rootStyle.getPropertyValue(customCssProps.styleActionCardBoxShadowActive)).toBe('none');
      expect(rootStyle.getPropertyValue(customCssProps.styleActionCardBoxShadowDisabled)).toBe('none');

      // Root focusRing custom properties
      expect(rootStyle.getPropertyValue(customCssProps.styleActionCardFocusRingBorderColor)).toBe('#0073bb');
      expect(rootStyle.getPropertyValue(customCssProps.styleActionCardFocusRingBorderRadius)).toBe('10px');
      expect(rootStyle.getPropertyValue(customCssProps.styleActionCardFocusRingBorderWidth)).toBe('2px');

      // Header padding styles
      const headerWrapper = wrapper.findByClassName(styles.header)!;
      expect(getComputedStyle(headerWrapper.getElement()).getPropertyValue('padding-block')).toBe('10px');
      expect(getComputedStyle(headerWrapper.getElement()).getPropertyValue('padding-inline')).toBe('20px');

      // Content padding styles
      const body = wrapper.findContent()!;
      expect(getComputedStyle(body.getElement()).getPropertyValue('padding-block')).toBe('30px');
      expect(getComputedStyle(body.getElement()).getPropertyValue('padding-inline')).toBe('40px');
    });
  });
});
