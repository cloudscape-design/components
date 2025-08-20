// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { waitFor } from '@testing-library/react';

import '../../__a11y__/to-validate-a11y';
import AppLayout from '../../../lib/components/app-layout';
import { AppLayoutWrapper } from '../../../lib/components/test-utils/dom';
import { describeEachAppLayout, renderComponent, testDrawer } from './utils';

import mobileStyles from '../../../lib/components/app-layout/mobile-toolbar/styles.css.js';
import sharedStyles from '../../../lib/components/app-layout/styles.css.js';

test('does not render mobile mode by default', () => {
  const { wrapper } = renderComponent(<AppLayout />);
  expect(wrapper.findByClassName(mobileStyles['mobile-bar'])).toBeFalsy();
});

test('should not create a new stacking context by default', () => {
  const { wrapper } = renderComponent(<AppLayout />);
  expect(wrapper.getElement()).not.toHaveClass(sharedStyles['root-no-scroll']);
});

test('should create a new stacking context when body scroll is disabled', () => {
  const { wrapper } = renderComponent(<AppLayout disableBodyScroll={true} />);
  expect(wrapper.getElement()).toHaveClass(sharedStyles['root-no-scroll']);
});

describeEachAppLayout({ themes: ['classic', 'refresh-toolbar'], sizes: ['desktop', 'mobile'] }, ({ theme, size }) => {
  describe.each([
    [
      'navigation',
      {
        propName: 'navigationOpen',
        handlerName: 'onNavigationChange',
        findOpenElement: (wrapper: AppLayoutWrapper) => wrapper.findOpenNavigationPanel(),
        findToggle: (wrapper: AppLayoutWrapper) => wrapper.findNavigationToggle(),
        findClose: (wrapper: AppLayoutWrapper) => wrapper.findNavigationClose(),
      },
    ],
    [
      'tools',
      {
        propName: 'toolsOpen',
        handlerName: 'onToolsChange',
        findOpenElement: (wrapper: AppLayoutWrapper) => wrapper.findOpenToolsPanel(),
        findToggle: (wrapper: AppLayoutWrapper) => wrapper.findToolsToggle(),
        findClose: (wrapper: AppLayoutWrapper) => wrapper.findToolsClose(),
      },
    ],
  ] as const)('%s', (name, { propName, handlerName, findToggle, findOpenElement, findClose }) => {
    test('property is controlled', () => {
      const onChange = jest.fn();
      const { wrapper, rerender } = renderComponent(<AppLayout {...{ [propName]: false, [handlerName]: onChange }} />);
      findToggle(wrapper).click();
      expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ detail: { open: true } }));
      expect(findOpenElement(wrapper)).toBeFalsy();

      rerender(<AppLayout {...{ [propName]: true, [handlerName]: onChange }} />);
      findClose(wrapper).click();
      expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ detail: { open: false } }));
      expect(findOpenElement(wrapper)).toBeTruthy();
    });

    (size === 'mobile' ? test : test.skip)('when property is not set, toggles the visibility without handler', () => {
      const { wrapper } = renderComponent(<AppLayout />);
      expect(findOpenElement(wrapper)).toBeFalsy();
      findToggle(wrapper).click();
      expect(findOpenElement(wrapper)).toBeTruthy();
    });
  });

  describe('drawers', () => {
    const findElement = (wrapper: AppLayoutWrapper) => wrapper.findActiveDrawer()!;
    const findToggle = (wrapper: AppLayoutWrapper) => wrapper.findDrawersTriggers()![0];
    const findClose = (wrapper: AppLayoutWrapper) => wrapper.findActiveDrawerCloseButton()!;

    test('property is controlled', () => {
      const onChange = jest.fn();
      const { wrapper, rerender } = renderComponent(
        <AppLayout activeDrawerId={null} onDrawerChange={event => onChange(event.detail)} drawers={[testDrawer]} />
      );

      expect(findElement(wrapper)).toBeNull();
      findToggle(wrapper).click();
      expect(onChange).toHaveBeenCalledWith({ activeDrawerId: 'security' });

      rerender(
        <AppLayout
          activeDrawerId={testDrawer.id}
          onDrawerChange={event => onChange(event.detail)}
          drawers={[testDrawer]}
        />
      );

      expect(findElement(wrapper)).not.toBeNull();
      findClose(wrapper).click();
      expect(onChange).toHaveBeenCalledWith({ activeDrawerId: null });
    });
  });

  describe('Content height calculation', () => {
    test('should take the full page height by default', () => {
      const { wrapper } = renderComponent(<AppLayout />);
      expect(wrapper.getElement()).toHaveStyle({ minBlockSize: 'calc(100vh - 0px)' });
    });

    test('should include header and footer in the calculation', async () => {
      const { wrapper } = renderComponent(
        <div id="b">
          <div style={{ height: 40 }} id="h" />
          <AppLayout />
          <div style={{ height: 35 }} id="f" />
        </div>
      );
      await waitFor(() => expect(wrapper.getElement()).toHaveStyle({ minBlockSize: 'calc(100vh - 75px)' }));
    });

    (theme !== 'classic' ? test : test.skip)('should set the header height to the scrolling element', () => {
      Object.defineProperty(document, 'scrollingElement', { value: document.body });
      renderComponent(
        <div id="b">
          <div style={{ height: 40 }} id="h" />
          <AppLayout />
        </div>
      );

      // Note: The toolbar height in jsdom environment is calculated as `0`.
      // For this reason both `refresh` and `refresh-toolbar` only consider the height of `#h` element which is `40px`.
      // We have covered this case with real values in integration tests.
      expect(document.scrollingElement).toHaveStyle('scroll-padding-top: 40px');
    });

    test('should use alternative header and footer selector', async () => {
      const { wrapper } = renderComponent(
        <>
          <div style={{ height: 20 }} id="header" />
          <AppLayout headerSelector="#header" footerSelector="#footer" />
          <div style={{ height: 25 }} id="footer" />
        </>
      );
      await waitFor(() => expect(wrapper.getElement()).toHaveStyle({ minBlockSize: 'calc(100vh - 45px)' }));
    });

    // disableBodyScroll is not supported in this version
    (theme === 'refresh-toolbar' ? test.skip : test)(
      'should set height instead of min-height when the body scroll is disabled',
      () => {
        const { wrapper } = renderComponent(<AppLayout disableBodyScroll={true} />);
        const { blockSize, minBlockSize } = wrapper.getElement().style;
        expect({ blockSize, minBlockSize }).toEqual({ blockSize: 'calc(100vh - 0px)', minBlockSize: '' });
      }
    );
  });

  (size === 'mobile' ? test : test.skip)('a11y', async () => {
    const { container } = renderComponent(
      <AppLayout
        navigationOpen={true}
        toolsOpen={true}
        splitPanelOpen={true}
        navigation={<div></div>}
        content={<div></div>}
        notifications={<div></div>}
        breadcrumbs={<div></div>}
        splitPanel={<div></div>}
        ariaLabels={{
          drawers: 'Drawers',
          navigationToggle: 'Open navigation',
          navigationClose: 'Close navigation',
          toolsToggle: 'Open tools',
          toolsClose: 'Close tools',
        }}
      />
    );
    await expect(container).toValidateA11y();
  });
});
