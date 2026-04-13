// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import { getVisualContextClassname } from '../../../lib/components/internal/components/visual-context';
import NavigationBar, { NavigationBarProps } from '../../../lib/components/navigation-bar';
import createWrapper from '../../../lib/components/test-utils/dom';

jest.mock('@cloudscape-design/component-toolkit/internal', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit/internal'),
  warnOnce: jest.fn(),
}));

afterEach(() => {
  (warnOnce as jest.Mock).mockReset();
});

function renderNavigationBar(props: Partial<NavigationBarProps> = {}) {
  const { container } = render(<NavigationBar {...props} />);
  return createWrapper(container).findNavigationBar()!;
}

describe('NavigationBar', () => {
  describe('Basic rendering', () => {
    test('renders as a nav element', () => {
      const wrapper = renderNavigationBar();
      expect(wrapper.getElement().tagName).toBe('NAV');
    });

    test('renders empty bar when no slots provided', () => {
      const wrapper = renderNavigationBar();
      expect(wrapper.findStartContent()).toBeNull();
      expect(wrapper.findCenterContent()).toBeNull();
      expect(wrapper.findEndContent()).toBeNull();
    });

    test('renders startContent', () => {
      const wrapper = renderNavigationBar({ startContent: <span>Start</span> });
      expect(wrapper.findStartContent()!.getElement()).toHaveTextContent('Start');
    });

    test('renders centerContent in horizontal placement', () => {
      const wrapper = renderNavigationBar({ centerContent: <span>Center</span> });
      expect(wrapper.findCenterContent()!.getElement()).toHaveTextContent('Center');
    });

    test('renders endContent', () => {
      const wrapper = renderNavigationBar({ endContent: <span>End</span> });
      expect(wrapper.findEndContent()!.getElement()).toHaveTextContent('End');
    });

    test('renders all three slots together', () => {
      const wrapper = renderNavigationBar({
        startContent: <span>Start</span>,
        centerContent: <span>Center</span>,
        endContent: <span>End</span>,
      });
      expect(wrapper.findStartContent()!.getElement()).toHaveTextContent('Start');
      expect(wrapper.findCenterContent()!.getElement()).toHaveTextContent('Center');
      expect(wrapper.findEndContent()!.getElement()).toHaveTextContent('End');
    });
  });

  describe('Variants', () => {
    test('defaults to primary variant', () => {
      const wrapper = renderNavigationBar();
      expect(wrapper.getElement()).toHaveClass(expect.stringContaining('variant-primary'));
    });

    test('applies primary variant class', () => {
      const wrapper = renderNavigationBar({ variant: 'primary' });
      expect(wrapper.getElement()).toHaveClass(expect.stringContaining('variant-primary'));
    });

    test('applies secondary variant class', () => {
      const wrapper = renderNavigationBar({ variant: 'secondary' });
      expect(wrapper.getElement()).toHaveClass(expect.stringContaining('variant-secondary'));
    });

    test('primary variant applies top-navigation visual context', () => {
      const wrapper = renderNavigationBar({ variant: 'primary' });
      expect(wrapper.getElement()).toHaveClass(getVisualContextClassname('top-navigation'));
    });

    test('secondary variant does not apply top-navigation visual context', () => {
      const wrapper = renderNavigationBar({ variant: 'secondary' });
      expect(wrapper.getElement()).not.toHaveClass(getVisualContextClassname('top-navigation'));
    });

    test('secondary variant applies app-layout-toolbar visual context', () => {
      const wrapper = renderNavigationBar({ variant: 'secondary' });
      expect(wrapper.getElement()).toHaveClass(getVisualContextClassname('app-layout-toolbar'));
    });
  });

  describe('Placement', () => {
    test('defaults to block-start placement', () => {
      const wrapper = renderNavigationBar();
      expect(wrapper.getElement()).toHaveClass(expect.stringContaining('placement-block-start'));
    });

    test.each(['block-start', 'block-end', 'inline-start', 'inline-end'] as const)(
      'applies %s placement class',
      placement => {
        const wrapper = renderNavigationBar({ placement });
        expect(wrapper.getElement()).toHaveClass(expect.stringContaining(`placement-${placement}`));
      }
    );

    test('does not render centerContent in vertical placement (inline-start)', () => {
      const wrapper = renderNavigationBar({
        placement: 'inline-start',
        centerContent: <span>Center</span>,
      });
      expect(wrapper.findCenterContent()).toBeNull();
    });

    test('does not render centerContent in vertical placement (inline-end)', () => {
      const wrapper = renderNavigationBar({
        placement: 'inline-end',
        centerContent: <span>Center</span>,
      });
      expect(wrapper.findCenterContent()).toBeNull();
    });

    test('renders centerContent in block-end placement', () => {
      const wrapper = renderNavigationBar({
        placement: 'block-end',
        centerContent: <span>Center</span>,
      });
      expect(wrapper.findCenterContent()!.getElement()).toHaveTextContent('Center');
    });

    test('warns when centerContent is used with vertical placement', () => {
      renderNavigationBar({
        placement: 'inline-start',
        centerContent: <span>Center</span>,
      });
      expect(warnOnce).toHaveBeenCalledWith('NavigationBar', expect.stringContaining('centerContent'));
    });

    test('does not warn when centerContent is used with horizontal placement', () => {
      renderNavigationBar({
        placement: 'block-start',
        centerContent: <span>Center</span>,
      });
      expect(warnOnce).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    test('applies ariaLabel to nav element', () => {
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
  });

  describe('Slot combinations', () => {
    test('renders only startContent when others are absent', () => {
      const wrapper = renderNavigationBar({ startContent: <span>Start</span> });
      expect(wrapper.findStartContent()!.getElement()).toHaveTextContent('Start');
      expect(wrapper.findCenterContent()).toBeNull();
      expect(wrapper.findEndContent()).toBeNull();
    });

    test('renders only centerContent when others are absent', () => {
      const wrapper = renderNavigationBar({ centerContent: <span>Center</span> });
      expect(wrapper.findStartContent()).toBeNull();
      expect(wrapper.findCenterContent()!.getElement()).toHaveTextContent('Center');
      expect(wrapper.findEndContent()).toBeNull();
    });

    test('renders only endContent when others are absent', () => {
      const wrapper = renderNavigationBar({ endContent: <span>End</span> });
      expect(wrapper.findStartContent()).toBeNull();
      expect(wrapper.findCenterContent()).toBeNull();
      expect(wrapper.findEndContent()!.getElement()).toHaveTextContent('End');
    });

    test('renders startContent and endContent without centerContent', () => {
      const wrapper = renderNavigationBar({
        startContent: <span>Start</span>,
        endContent: <span>End</span>,
      });
      expect(wrapper.findStartContent()!.getElement()).toHaveTextContent('Start');
      expect(wrapper.findCenterContent()).toBeNull();
      expect(wrapper.findEndContent()!.getElement()).toHaveTextContent('End');
    });

    test('renders startContent and centerContent without endContent', () => {
      const wrapper = renderNavigationBar({
        startContent: <span>Start</span>,
        centerContent: <span>Center</span>,
      });
      expect(wrapper.findStartContent()!.getElement()).toHaveTextContent('Start');
      expect(wrapper.findCenterContent()!.getElement()).toHaveTextContent('Center');
      expect(wrapper.findEndContent()).toBeNull();
    });

    test('renders centerContent and endContent without startContent', () => {
      const wrapper = renderNavigationBar({
        centerContent: <span>Center</span>,
        endContent: <span>End</span>,
      });
      expect(wrapper.findStartContent()).toBeNull();
      expect(wrapper.findCenterContent()!.getElement()).toHaveTextContent('Center');
      expect(wrapper.findEndContent()!.getElement()).toHaveTextContent('End');
    });
  });

  describe('Custom properties', () => {
    test('passes data attributes to root element', () => {
      const { container } = render(<NavigationBar data-testid="my-nav" />);
      expect(container.querySelector('[data-testid="my-nav"]')).toBeTruthy();
    });

    test('passes className to root element', () => {
      const { container } = render(<NavigationBar className="custom-class" />);
      expect(container.querySelector('.custom-class')).toBeTruthy();
    });

    test('passes id to root element', () => {
      const { container } = render(<NavigationBar id="my-nav-id" />);
      expect(container.querySelector('#my-nav-id')).toBeTruthy();
    });
  });
});
