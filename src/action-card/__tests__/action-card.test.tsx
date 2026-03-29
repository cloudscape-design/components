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

  /**
   * Preservation Property Tests
   * Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6
   *
   * These tests capture the current (correct) behavior that must be preserved after the fix.
   * They MUST PASS on the current unfixed code.
   */
  describe('Preservation: center alignment and no-icon layout unchanged', () => {
    test('center-aligned icon is a direct child of root button, not inside inner-card', () => {
      /**
       * Validates: Requirements 3.1
       */
      const wrapper = renderActionCard({
        icon: <span>icon</span>,
        iconVerticalAlignment: 'center',
        header: 'Header',
        children: 'Body',
      });

      const rootEl = wrapper.getElement();
      const innerCard = rootEl.querySelector(`.${styles['inner-card']}`);
      expect(innerCard).not.toBeNull();

      // Icon should be a direct child of root button (sibling of inner-card)
      const iconDirectChildOfRoot = Array.from(rootEl.children).find(child => child.classList.contains(styles.icon));
      expect(iconDirectChildOfRoot).toBeDefined();

      // Icon should NOT be inside inner-card
      const iconInsideInnerCard = innerCard!.querySelector(`.${styles.icon}`);
      expect(iconInsideInnerCard).toBeNull();
    });

    test('no-icon card has no icon wrapper element in the DOM', () => {
      /**
       * Validates: Requirements 3.2
       */
      const wrapper = renderActionCard({
        header: 'Header',
        children: 'Body',
      });

      const rootEl = wrapper.getElement();
      const iconEl = rootEl.querySelector(`.${styles.icon}`);
      expect(iconEl).toBeNull();
    });

    test('disabled card with icon has disabled class, aria-disabled, and disabled attribute', () => {
      /**
       * Validates: Requirements 3.3
       */
      const wrapper = renderActionCard({
        icon: <span>icon</span>,
        iconVerticalAlignment: 'center',
        header: 'Header',
        disabled: true,
      });

      const rootEl = wrapper.getElement();
      expect(rootEl).toHaveClass(styles.disabled);
      expect(rootEl).toHaveAttribute('aria-disabled', 'true');
      expect(rootEl).toHaveAttribute('disabled');
    });

    test('disableHeaderPaddings=true applies no-padding class on header', () => {
      /**
       * Validates: Requirements 3.4
       */
      const wrapper = renderActionCard({
        header: 'Header',
        children: 'Body',
        disableHeaderPaddings: true,
      });

      const rootEl = wrapper.getElement();
      const headerEl = rootEl.querySelector(`.${styles.header}`);
      expect(headerEl).not.toBeNull();
      expect(headerEl!.classList.contains(styles['no-padding'])).toBe(true);
    });

    test('disableContentPaddings=true applies no-padding class on body', () => {
      /**
       * Validates: Requirements 3.4
       */
      const wrapper = renderActionCard({
        header: 'Header',
        children: 'Body',
        disableContentPaddings: true,
      });

      const rootEl = wrapper.getElement();
      const bodyEl = rootEl.querySelector(`.${styles.body}`);
      expect(bodyEl).not.toBeNull();
      expect(bodyEl!.classList.contains(styles['no-padding'])).toBe(true);
    });

    test('variant="default" applies variant-default class on root', () => {
      /**
       * Validates: Requirements 3.5
       */
      const wrapper = renderActionCard({
        header: 'Header',
        variant: 'default',
      });

      const rootEl = wrapper.getElement();
      expect(rootEl).toHaveClass(styles['variant-default']);
    });

    test('variant="embedded" applies variant-embedded class on root', () => {
      /**
       * Validates: Requirements 3.5
       */
      const wrapper = renderActionCard({
        header: 'Header',
        variant: 'embedded',
      });

      const rootEl = wrapper.getElement();
      expect(rootEl).toHaveClass(styles['variant-embedded']);
    });
  });

  /**
   * Bug Condition Exploration Tests
   * Validates: Requirements 1.1, 1.2
   *
   * These tests encode the EXPECTED (fixed) behavior for iconVerticalAlignment='top'.
   * They are expected to FAIL on unfixed code, proving the bug exists.
   * The bug: icon is rendered as a sibling of inner-card at the root level,
   * instead of inside inner-card within a header-row wrapper.
   */
  describe('Bug Condition: icon alignment when iconVerticalAlignment="top"', () => {
    test('icon is rendered inside inner-card within a header-row wrapper, not as a direct child of root', () => {
      const wrapper = renderActionCard({
        icon: <span>icon</span>,
        iconVerticalAlignment: 'top',
        header: 'Header',
        children: 'Body',
      });

      const rootEl = wrapper.getElement();
      const innerCard = rootEl.querySelector(`.${styles['inner-card']}`);
      expect(innerCard).not.toBeNull();

      // The icon should be inside inner-card (within a header-row wrapper), NOT a direct child of root
      const iconInsideInnerCard = innerCard!.querySelector(`.${styles.icon}`);
      expect(iconInsideInnerCard).not.toBeNull();

      // The icon should NOT be a direct child of the root button
      const iconDirectChildOfRoot = Array.from(rootEl.children).find(child => child.classList.contains(styles.icon));
      expect(iconDirectChildOfRoot).toBeUndefined();
    });

    test('a header-row wrapper exists inside inner-card containing both header and icon', () => {
      const wrapper = renderActionCard({
        icon: <span>icon</span>,
        iconVerticalAlignment: 'top',
        header: 'Header',
        description: 'Description',
        children: 'Body',
      });

      const rootEl = wrapper.getElement();
      const innerCard = rootEl.querySelector(`.${styles['inner-card']}`);
      expect(innerCard).not.toBeNull();

      // A header-row wrapper should exist inside inner-card
      const headerRow = innerCard!.querySelector(`.${styles['header-row']}`);
      expect(headerRow).not.toBeNull();

      // header-row should contain both the header section and the icon
      const headerInRow = headerRow!.querySelector(`.${styles.header}`);
      const iconInRow = headerRow!.querySelector(`.${styles.icon}`);
      expect(headerInRow).not.toBeNull();
      expect(iconInRow).not.toBeNull();

      // body should be a sibling of header-row inside inner-card, not inside header-row
      const bodyEl = innerCard!.querySelector(`.${styles.body}`);
      expect(bodyEl).not.toBeNull();
      expect(headerRow!.contains(bodyEl)).toBe(false);
    });

    test('edge case: iconVerticalAlignment="top" with no header/description but with children — icon falls back to root sibling', () => {
      const wrapper = renderActionCard({
        icon: <span>icon</span>,
        iconVerticalAlignment: 'top',
        children: 'Body content',
      });

      const rootEl = wrapper.getElement();
      const innerCard = rootEl.querySelector(`.${styles['inner-card']}`);
      expect(innerCard).not.toBeNull();

      // Without a header, icon should fall back to root sibling (like center alignment)
      const iconDirectChildOfRoot = Array.from(rootEl.children).find(child => child.classList.contains(styles.icon));
      expect(iconDirectChildOfRoot).toBeDefined();

      // Icon should NOT be inside inner-card
      const iconInsideInnerCard = innerCard!.querySelector(`.${styles.icon}`);
      expect(iconInsideInnerCard).toBeNull();
    });
  });
});
