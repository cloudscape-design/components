// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';
import Link, { LinkProps } from '../../../lib/components/link';
import styles from '../../../lib/components/link/styles.css.js';
import createWrapper from '../../../lib/components/test-utils/dom';
import { linkRelExpectations, linkTargetExpectations } from '../../__tests__/target-rel-test-helper';
import TestI18nProvider from '../../../lib/components/i18n/testing';
import FormField from '../../../lib/components/form-field';
import Header from '../../../lib/components/header';

import { AnalyticsFunnel } from '../../../lib/components/internal/analytics/components/analytics-funnel';
import { FunnelMetrics } from '../../../lib/components/internal/analytics';

import { mockedFunnelInteractionId, mockFunnelMetrics } from '../../internal/analytics/__tests__/mocks';

function renderLink(props: LinkProps = {}) {
  const renderResult = render(<Link {...props} />);
  return createWrapper(renderResult.container).findLink()!;
}

describe('Link component', () => {
  test('content is rendered correctly', () => {
    const wrapper = renderLink({ href: '#', children: 'I am a link!' });
    expect(wrapper.getElement()).toHaveTextContent('I am a link!');
  });

  test('ariaLabel is applied', () => {
    const wrapper = renderLink({ ariaLabel: 'Learn more about S3' });
    expect(wrapper.getElement()).toHaveAttribute('aria-label', 'Learn more about S3');
  });

  test('externalIconAriaLabel is applied', () => {
    const wrapper = renderLink({ externalIconAriaLabel: 'External link', external: true });
    expect(createWrapper(wrapper.getElement()).find('[aria-label="External link"]')).toBeTruthy();
  });

  describe('i18n', () => {
    test('supports providing externalIconAriaLabel through i18n provider', () => {
      const { container } = render(
        <TestI18nProvider messages={{ link: { externalIconAriaLabel: 'Custom aria label' } }}>
          <Link href="#" external={true}>
            Link
          </Link>
        </TestI18nProvider>
      );
      const wrapper = createWrapper(container).findLink()!;
      expect(createWrapper(wrapper.getElement()).find('[aria-label="Custom aria label"]')).toBeTruthy();
    });
  });

  describe('"info" variant', () => {
    test('negates fontSize and color', () => {
      const wrapper = renderLink({ variant: 'info', fontSize: 'heading-xl', color: 'inverted' });
      expect(wrapper.getElement()).not.toHaveClass(styles['font-size-heading-xl']);
      expect(wrapper.getElement()).not.toHaveClass(styles['color-inverted']);
    });
    test('can get additional label from form field', () => {
      const { container } = render(<FormField label="Testing label" info={<Link variant="info">Info</Link>} />);
      const wrapper = createWrapper(container);
      const infoLinkElement = wrapper.findFormField()!.findInfo()!.findLink()?.getElement();

      // @testing-library/dom doesn't respect aria-labelledby referencing hidden child elements, so the ":" is missing
      // https://github.com/eps1lon/dom-accessibility-api/issues/939
      // expect(infoLinkElement).toHaveAccessibleName('Info : Testing label');
      expect(infoLinkElement).toHaveAccessibleName('Info Testing label');
      // therefore, we also check the length to ensure 3 elements are references
      expect(infoLinkElement?.getAttribute('aria-labelledby')?.split(' ').length).toBe(3);
    });
    test('can get additional label from header', () => {
      const { container } = render(<Header info={<Link variant="info">Info</Link>}>Testing header</Header>);
      const wrapper = createWrapper(container);
      const infoLinkElement = wrapper.findHeader()!.findInfo()!.findLink()?.getElement();

      // (see above)
      // expect(infoLinkElement).toHaveAccessibleName('Info : Testing header');
      expect(infoLinkElement).toHaveAccessibleName('Info Testing header');
      expect(infoLinkElement?.getAttribute('aria-labelledby')?.split(' ').length).toBe(3);
    });
    test('can override the automatic label', () => {
      const { container } = render(
        <Header
          info={
            <Link variant="info" ariaLabel="Info about something">
              Info
            </Link>
          }
        >
          Testing header
        </Header>
      );
      const wrapper = createWrapper(container);
      expect(wrapper.findHeader()?.findInfo()?.findLink()?.getElement()).toHaveAccessibleName('Info about something');
    });
  });

  describe('"awsui-value-large" variant', () => {
    test('negates fontSize but not color', () => {
      const wrapper = renderLink({ variant: 'awsui-value-large', fontSize: 'body-s', color: 'inverted' });
      expect(wrapper.getElement()).toHaveClass(styles['font-size-display-l']);
      expect(wrapper.getElement()).toHaveClass(styles['color-inverted']);
    });
  });

  describe('"external" property', () => {
    test('renders an icon', () => {
      const wrapper = renderLink({ external: true });
      expect(createWrapper(wrapper.getElement()).findIcon()).not.toBeNull();
    });
  });

  test.each(linkTargetExpectations)('"target" property %s', (props, expectation) => {
    const wrapper = renderLink({ ...props });
    expectation
      ? expect(wrapper.getElement()).toHaveAttribute('target', expectation)
      : expect(wrapper.getElement()).not.toHaveAttribute('target');
  });

  test.each(linkRelExpectations)('"rel" property %s', (props, expectation) => {
    const wrapper = renderLink({ ...props });
    expectation
      ? expect(wrapper.getElement()).toHaveAttribute('rel', expectation)
      : expect(wrapper.getElement()).not.toHaveAttribute('rel');
  });

  describe('"href" property', () => {
    test('passes the "href" attribute to the anchor', () => {
      const url = 'https://github.com';
      const wrapper = renderLink({ href: url });
      expect(wrapper.getElement()).toHaveAttribute('href', url);
    });

    describe('if "href" is provided', () => {
      test('renders an anchor', () => {
        const wrapper = renderLink({ href: '#' });
        expect(wrapper.getElement().tagName).toBe('A');
      });

      test('passes the "target" attribute to the anchor', () => {
        const wrapper = renderLink({ href: '#', target: '_blank' });
        expect(wrapper.getElement()).toHaveAttribute('target', '_blank');
      });
    });

    describe('if "href" is not provided', () => {
      test('renders a link with role="button"', () => {
        const wrapper = renderLink({ variant: 'info' });
        expect(wrapper.getElement().getAttribute('role')).toBe('button');
      });
    });
  });

  describe('"onFollow" event', () => {
    test('triggers when clicked', () => {
      const onFollow = jest.fn();
      const wrapper = renderLink({ href: '#', onFollow: event => onFollow(event.detail) });
      wrapper.click();
      expect(onFollow).toHaveBeenCalledWith({ href: '#', external: false, target: undefined });
    });

    test('provides additional details for external links', () => {
      const onFollow = jest.fn();
      const wrapper = renderLink({ href: '#', external: true, onFollow: event => onFollow(event.detail) });
      wrapper.click();
      expect(onFollow).toHaveBeenCalledWith({ href: '#', external: true, target: '_blank' });
    });

    test('does not trigger when type is anchor and modifier is pressed while clicking', () => {
      const onFollow = jest.fn();
      const wrapper = renderLink({ href: '#', onFollow });
      wrapper.click({ button: 0, ctrlKey: true, shiftKey: false, altKey: false, metaKey: false });
      expect(onFollow).not.toHaveBeenCalled();
    });

    test('triggers for buttons even when modifiers are pressed', () => {
      const onFollow = jest.fn();
      const wrapper = renderLink({ onFollow });
      wrapper.click({ button: 0, ctrlKey: true, shiftKey: true, altKey: true, metaKey: true });
      expect(onFollow).toHaveBeenCalled();
    });
  });

  test('can be focused through the API', () => {
    let link: LinkProps.Ref | null = null;
    const renderResult = render(<Link ref={el => (link = el)} />);
    const wrapper = createWrapper(renderResult.container);
    link!.focus();
    expect(document.activeElement).toBe(wrapper.findLink()!.getElement());
  });

  describe('URL sanitization', () => {
    let consoleWarnSpy: jest.SpyInstance;
    let consoleErrorSpy: jest.SpyInstance;
    beforeEach(() => {
      consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    });
    afterEach(() => {
      consoleWarnSpy?.mockRestore();
      consoleErrorSpy?.mockRestore();
    });

    test('does not throw an error when a safe javascript: URL is passed', () => {
      const element = renderLink({ href: 'javascript:void(0)' }).getElement();
      expect(element.href).toBe('javascript:void(0)');
      expect(console.warn).toHaveBeenCalledTimes(0);
    });
    test('throws an error when a dangerous javascript: URL is passed', () => {
      expect(() => renderLink({ href: "javascript:alert('Hello!')" })).toThrow(
        'A javascript: URL was blocked as a security precaution.'
      );

      expect(console.warn).toHaveBeenCalledTimes(1);
      expect(console.warn).toHaveBeenCalledWith(
        `[AwsUi] [Link] A javascript: URL was blocked as a security precaution. The URL was "javascript:alert('Hello!')".`
      );
    });
  });

  describe('Analytics', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      mockFunnelMetrics();
    });

    test('does not send any metrics when not in a funnel context', () => {
      const wrapper = renderLink({ href: '#', external: true });
      wrapper.click();

      expect(FunnelMetrics.externalLinkInteracted).not.toHaveBeenCalled();
    });

    test('sends a externalLinkInteracted metric when an external link is clicked within a Funnel Context', () => {
      const { container } = render(
        <AnalyticsFunnel funnelType="single-page" optionalStepNumbers={[]} totalFunnelSteps={1}>
          <Link href="#" external={true} />
        </AnalyticsFunnel>
      );
      const wrapper = createWrapper(container).findLink()!;
      wrapper.click();

      expect(FunnelMetrics.externalLinkInteracted).toHaveBeenCalled();
      expect(FunnelMetrics.externalLinkInteracted).toHaveBeenCalledWith(
        expect.objectContaining({
          funnelInteractionId: mockedFunnelInteractionId,
          elementSelector: expect.any(String),
        })
      );
    });

    test('sends a helpPanelInteracted metric when a help panel link is clicked within a Funnel Context', () => {
      const { container } = render(
        <AnalyticsFunnel funnelType="single-page" optionalStepNumbers={[]} totalFunnelSteps={1}>
          <Link variant="info" />
        </AnalyticsFunnel>
      );
      const wrapper = createWrapper(container).findLink()!;
      wrapper.click();

      expect(FunnelMetrics.helpPanelInteracted).toHaveBeenCalledTimes(1);
      expect(FunnelMetrics.helpPanelInteracted).toHaveBeenCalledWith(
        expect.objectContaining({
          funnelInteractionId: mockedFunnelInteractionId,
          elementSelector: expect.any(String),
        })
      );
    });
  });
});
