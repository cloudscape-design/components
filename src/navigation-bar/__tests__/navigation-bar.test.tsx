// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import { getVisualContextClassname } from '../../../lib/components/internal/components/visual-context';
import NavigationBar, { NavigationBarProps } from '../../../lib/components/navigation-bar';
import NavigationBarWrapper from '../__test-utils__';

import styles from '../../../lib/components/navigation-bar/styles.selectors.js';

function renderNavigationBar(props: Partial<NavigationBarProps> = {}) {
  const { container } = render(<NavigationBar {...props} />);
  return new NavigationBarWrapper(container.querySelector(`.${NavigationBarWrapper.rootSelector}`)!);
}

describe('NavigationBar', () => {
  test('renders as a section element by default', () => {
    const wrapper = renderNavigationBar();
    expect(wrapper.getElement().tagName).toBe('SECTION');
  });

  test('renders empty when no content provided', () => {
    const wrapper = renderNavigationBar();
    expect(wrapper.findContent()).toBeNull();
  });

  test('renders content', () => {
    const wrapper = renderNavigationBar({ content: <span>Hello</span> });
    expect(wrapper.findContent()!.getElement()).toHaveTextContent('Hello');
  });

  test('applies ariaLabel to root element', () => {
    const wrapper = renderNavigationBar({ ariaLabel: 'Main navigation' });
    expect(wrapper.getElement()).toHaveAttribute('aria-label', 'Main navigation');
  });

  test('i18nStrings.ariaLabel overrides ariaLabel prop', () => {
    const wrapper = renderNavigationBar({
      ariaLabel: 'Prop label',
      i18nStrings: { ariaLabel: 'I18n label' },
    });
    expect(wrapper.getElement()).toHaveAttribute('aria-label', 'I18n label');
  });

  test('no aria-label when neither prop is provided', () => {
    const wrapper = renderNavigationBar();
    expect(wrapper.getElement()).not.toHaveAttribute('aria-label');
  });

  test('passes data attributes to root element', () => {
    const { container } = render(<NavigationBar data-testid="my-nav" />);
    expect(container.querySelector('[data-testid="my-nav"]')).toBeTruthy();
  });

  describe('role prop', () => {
    test('renders <section role="region"> by default', () => {
      const { container } = render(<NavigationBar content="test" ariaLabel="Tools" />);
      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
      expect(section).toHaveAttribute('role', 'region');
    });

    test('renders <nav> element when role="navigation"', () => {
      const { container } = render(<NavigationBar role="navigation" content="test" ariaLabel="Main nav" />);
      expect(container.querySelector('nav')).toBeInTheDocument();
      expect(container.querySelector('section')).not.toBeInTheDocument();
    });

    test('renders <header> element when role="banner"', () => {
      const { container } = render(<NavigationBar role="banner" content="test" ariaLabel="Site header" />);
      expect(container.querySelector('header')).toBeInTheDocument();
      expect(container.querySelector('section')).not.toBeInTheDocument();
    });

    test('does not add explicit role attribute to <nav>', () => {
      const { container } = render(<NavigationBar role="navigation" content="test" />);
      expect(container.querySelector('nav')).not.toHaveAttribute('role');
    });

    test('does not add explicit role attribute to <header>', () => {
      const { container } = render(<NavigationBar role="banner" content="test" ariaLabel="Header" />);
      expect(container.querySelector('header')).not.toHaveAttribute('role');
    });
  });

  describe('ariaLabelledBy', () => {
    test('applies aria-labelledby when no aria-label is provided', () => {
      const { container } = render(<NavigationBar ariaLabelledBy="heading-id" content="test" />);
      expect(container.querySelector('section')).toHaveAttribute('aria-labelledby', 'heading-id');
    });

    test('does not apply aria-labelledby when aria-label is provided', () => {
      const { container } = render(<NavigationBar ariaLabel="Main nav" ariaLabelledBy="heading-id" content="test" />);
      const el = container.querySelector('section');
      expect(el).toHaveAttribute('aria-label', 'Main nav');
      expect(el).not.toHaveAttribute('aria-labelledby');
    });

    test('i18nStrings.ariaLabel takes precedence over ariaLabelledBy', () => {
      const { container } = render(
        <NavigationBar ariaLabelledBy="heading-id" i18nStrings={{ ariaLabel: 'i18n label' }} content="test" />
      );
      const el = container.querySelector('section');
      expect(el).toHaveAttribute('aria-label', 'i18n label');
      expect(el).not.toHaveAttribute('aria-labelledby');
    });
  });

  describe('visual context', () => {
    test('applies visual context class only for primary-accent variant', () => {
      const contextClass = getVisualContextClassname('navigation-bar');
      expect(renderNavigationBar({ variant: 'primary-accent' }).getElement()).toHaveClass(contextClass);
    });

    test('does not apply visual context for primary variant', () => {
      const contextClass = getVisualContextClassname('navigation-bar');
      expect(renderNavigationBar({ variant: 'primary' }).getElement()).not.toHaveClass(contextClass);
    });

    test('does not apply visual context for secondary variant', () => {
      const contextClass = getVisualContextClassname('navigation-bar');
      expect(renderNavigationBar({ variant: 'secondary' }).getElement()).not.toHaveClass(contextClass);
    });
  });

  describe('variant', () => {
    test('defaults to primary variant', () => {
      const wrapper = renderNavigationBar();
      expect(wrapper.getElement()).toHaveClass(styles['variant-primary']);
    });

    test.each(['primary', 'primary-accent', 'secondary'] as const)('applies %s variant class', variant => {
      const wrapper = renderNavigationBar({ variant });
      expect(wrapper.getElement()).toHaveClass(styles[`variant-${variant}`]);
    });
  });

  describe('placement', () => {
    test('defaults to top placement', () => {
      const wrapper = renderNavigationBar();
      expect(wrapper.getElement()).toHaveClass(styles['placement-top']);
    });

    test.each(['top', 'bottom', 'start', 'end'] as const)('applies %s placement class', placement => {
      const wrapper = renderNavigationBar({ placement });
      expect(wrapper.getElement()).toHaveClass(styles[`placement-${placement}`]);
    });
  });
});
