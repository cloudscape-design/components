// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';
import ContentLayout, { ContentLayoutProps } from '../../../lib/components/content-layout';
import createWrapper from '../../../lib/components/test-utils/dom';
import styles from '../../../lib/components/content-layout/styles.selectors.js';

function renderContentLayout(props: ContentLayoutProps = {}) {
  const { container, rerender } = render(<ContentLayout {...props} />);
  const wrapper = createWrapper(container).findContentLayout()!;

  return {
    wrapper,
    isOverlapEnabled() {
      const backgroundElement = wrapper.findByClassName(styles.background)!.getElement();
      const classes = backgroundElement.getAttribute('class')!;
      return !classes.includes(styles['is-overlap-disabled']);
    },
    rerender: (props: ContentLayoutProps) => rerender(<ContentLayout {...props} />),
  };
}
afterEach(() => {
  delete (window as any)[Symbol.for('awsui-global-flags')];
});

describe('ContentLayout component', () => {
  describe('slots', () => {
    test('renders the header slot', () => {
      const { wrapper } = renderContentLayout({
        header: <>Header text</>,
      });

      expect(wrapper.findHeader()!.getElement()).toHaveTextContent('Header text');
      expect(wrapper.findByClassName('awsui-context-content-header')).toBeTruthy();
    });

    test('renders the content slot', () => {
      const { wrapper } = renderContentLayout({
        children: <>Content text</>,
      });

      expect(wrapper.findHeader()).toBeNull();
      expect(wrapper.findContent()!.getElement()).toHaveTextContent('Content text');
    });

    test('renders the header and content slots', () => {
      const { wrapper } = renderContentLayout({
        children: <>Content text</>,
        header: <>Header text</>,
      });

      expect(wrapper.findHeader()!.getElement()).toHaveTextContent('Header text');
      expect(wrapper.findContent()!.getElement()).toHaveTextContent('Content text');
    });
  });

  describe('overlap', () => {
    test('renders the overlap by default', () => {
      const { isOverlapEnabled } = renderContentLayout({ children: <>Content text</>, header: <>Header text</> });
      expect(isOverlapEnabled()).toBe(true);
    });

    test('does not render the overlap if disableOverlap is set', () => {
      const { isOverlapEnabled } = renderContentLayout({
        children: <>Content text</>,
        header: <>Header text</>,
        disableOverlap: true,
      });
      expect(isOverlapEnabled()).toBe(false);
    });

    test('does not render the overlap if the content is empty', () => {
      const { isOverlapEnabled } = renderContentLayout({
        header: <>Header text</>,
      });
      expect(isOverlapEnabled()).toBe(false);
    });

    test('renders the overlap if the header is empty', () => {
      const { isOverlapEnabled } = renderContentLayout({
        children: <>Content text</>,
      });
      expect(isOverlapEnabled()).toBe(true);
    });

    test('does not render the overlap if the content is toggled', () => {
      const { isOverlapEnabled, rerender } = renderContentLayout({
        children: <>Content text</>,
        header: <>Header text</>,
      });
      expect(isOverlapEnabled()).toBe(true);

      rerender({
        header: <>Header text</>,
      });
      expect(isOverlapEnabled()).toBe(false);

      rerender({
        children: <>Content text</>,
        header: <>Header text</>,
      });
      expect(isOverlapEnabled()).toBe(true);
    });

    test('hides dark header when global flag is set', () => {
      (window as any)[Symbol.for('awsui-global-flags')] = { removeHighContrastHeader: true };
      const { wrapper } = renderContentLayout({
        children: <>Content text</>,
        header: <>Header text</>,
      });
      expect(wrapper.findByClassName('awsui-context-content-header')).toBeFalsy();
    });
  });
});
