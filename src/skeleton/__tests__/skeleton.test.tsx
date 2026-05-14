// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import Skeleton from '../../../lib/components/skeleton';
import createWrapper from '../../../lib/components/test-utils/dom';

import styles from '../../../lib/components/skeleton/styles.css.js';

function renderSkeleton(props: React.ComponentProps<typeof Skeleton> = {}) {
  const { container } = render(<Skeleton {...props} />);
  return createWrapper(container).findSkeleton()!;
}

describe('Skeleton Component', () => {
  describe('Basic rendering', () => {
    it('renders with default props', () => {
      const wrapper = renderSkeleton();
      expect(wrapper.getElement()).toBeInTheDocument();
      expect(wrapper.getElement().tagName).toBe('DIV');
      expect(wrapper.getElement()).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Width and height properties', () => {
    it('applies width prop', () => {
      const wrapper = renderSkeleton({ width: '200px' });
      expect(wrapper.getElement()).toHaveStyle({ inlineSize: '200px' });
    });

    it('applies height prop to inner element', () => {
      const wrapper = renderSkeleton({ height: '100px' });
      const innerElement = wrapper.getElement().querySelector(`.${styles.inner}`);
      expect(innerElement).toHaveStyle({ blockSize: '100px' });
    });

    it('applies both width and height', () => {
      const wrapper = renderSkeleton({ width: '50%', height: '4em' });
      expect(wrapper.getElement()).toHaveStyle({ inlineSize: '50%' });
      const innerElement = wrapper.getElement().querySelector(`.${styles.inner}`);
      expect(innerElement).toHaveStyle({ blockSize: '4em' });
    });

    it('does not set inline dimensions when props are not provided', () => {
      const wrapper = renderSkeleton();
      expect(wrapper.getElement().style.inlineSize).toBe('');
      const innerElement = wrapper.getElement().querySelector(`.${styles.inner}`) as HTMLElement;
      expect(innerElement?.style.blockSize).toBe('');
    });

    it('accepts percentage values', () => {
      const wrapper = renderSkeleton({ width: '100%' });
      expect(wrapper.getElement()).toHaveStyle({ inlineSize: '100%' });
    });

    it('accepts em values', () => {
      const wrapper = renderSkeleton({ height: '2em' });
      const innerElement = wrapper.getElement().querySelector(`.${styles.inner}`);
      expect(innerElement).toHaveStyle({ blockSize: '2em' });
    });
  });

  describe('Variant property', () => {
    it('does not apply variant class for default (dynamic)', () => {
      const wrapper = renderSkeleton();
      // Dynamic variant means no specific variant class - it adapts to surrounding font
      expect(wrapper.getElement().className).not.toContain('variant');
    });

    it('does not apply variant class for dynamic explicitly', () => {
      const wrapper = renderSkeleton({ variant: 'dynamic' });
      // Dynamic variant means no specific variant class - it adapts to surrounding font
      expect(wrapper.getElement().className).not.toContain('variant');
    });

    it('applies text-body-s variant', () => {
      const wrapper = renderSkeleton({ variant: 'text-body-s' });
      expect(wrapper.getElement()).toHaveClass(styles['variant-text-body-s']);
    });

    it('applies text-body-m variant', () => {
      const wrapper = renderSkeleton({ variant: 'text-body-m' });
      expect(wrapper.getElement()).toHaveClass(styles['variant-text-body-m']);
    });

    it('applies text-heading-xs variant', () => {
      const wrapper = renderSkeleton({ variant: 'text-heading-xs' });
      expect(wrapper.getElement()).toHaveClass(styles['variant-text-heading-xs']);
    });

    it('applies text-heading-s variant', () => {
      const wrapper = renderSkeleton({ variant: 'text-heading-s' });
      expect(wrapper.getElement()).toHaveClass(styles['variant-text-heading-s']);
    });

    it('applies text-heading-m variant', () => {
      const wrapper = renderSkeleton({ variant: 'text-heading-m' });
      expect(wrapper.getElement()).toHaveClass(styles['variant-text-heading-m']);
    });

    it('applies text-heading-l variant', () => {
      const wrapper = renderSkeleton({ variant: 'text-heading-l' });
      expect(wrapper.getElement()).toHaveClass(styles['variant-text-heading-l']);
    });

    it('applies text-heading-xl variant', () => {
      const wrapper = renderSkeleton({ variant: 'text-heading-xl' });
      expect(wrapper.getElement()).toHaveClass(styles['variant-text-heading-xl']);
    });

    it('applies text-display-l variant', () => {
      const wrapper = renderSkeleton({ variant: 'text-display-l' });
      expect(wrapper.getElement()).toHaveClass(styles['variant-text-display-l']);
    });
  });

  describe('Display property', () => {
    it('applies default display (block)', () => {
      const wrapper = renderSkeleton();
      expect(wrapper.getElement()).toHaveClass(styles['display-block']);
    });

    it('applies block display explicitly', () => {
      const wrapper = renderSkeleton({ display: 'block' });
      expect(wrapper.getElement()).toHaveClass(styles['display-block']);
    });

    it('applies inline-block display', () => {
      const wrapper = renderSkeleton({ display: 'inline-block' });
      expect(wrapper.getElement()).toHaveClass(styles['display-inline-block']);
    });

    it('applies inline display', () => {
      const wrapper = renderSkeleton({ display: 'inline' });
      expect(wrapper.getElement()).toHaveClass(styles['display-inline']);
    });
  });

  describe('TagOverride property', () => {
    it('uses div tag by default', () => {
      const wrapper = renderSkeleton();
      expect(wrapper.getElement().tagName).toBe('DIV');
      const innerElement = wrapper.getElement().querySelector(`.${styles.inner}`)!;
      expect(innerElement.tagName).toBe('DIV');
    });

    it('applies span tag when tagOverride is span', () => {
      const wrapper = renderSkeleton({ tagOverride: 'span' });
      expect(wrapper.getElement().tagName).toBe('SPAN');
      const innerElement = wrapper.getElement().querySelector(`.${styles.inner}`)!;
      expect(innerElement.tagName).toBe('SPAN');
    });

    it('applies section tag when tagOverride is section', () => {
      const wrapper = renderSkeleton({ tagOverride: 'section' });
      expect(wrapper.getElement().tagName).toBe('SECTION');
      const innerElement = wrapper.getElement().querySelector(`.${styles.inner}`)!;
      expect(innerElement.tagName).toBe('SECTION');
    });
  });
});
