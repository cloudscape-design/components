// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/* eslint simple-import-sort/imports: 0 */
import * as React from 'react';
import { waitFor } from '@testing-library/react';
import { describeEachAppLayout, renderComponent, testDrawer } from './utils';
import AppLayout from '../../../lib/components/app-layout';
import { AppLayoutWrapper } from '../../../lib/components/test-utils/dom';
import mobileStyles from '../../../lib/components/app-layout/mobile-toolbar/styles.css.js';
import sharedStyles from '../../../lib/components/app-layout/styles.css.js';
import '../../__a11y__/to-validate-a11y';

jest.mock('@cloudscape-design/component-toolkit/internal', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit/internal'),
  isMotionDisabled: jest.fn().mockReturnValue(true),
}));

// in our ResizeObserver mock resolves into mobile mode
test('should render mobile mode by default', () => {
  const { wrapper } = renderComponent(<AppLayout />);
  expect(wrapper.findByClassName(mobileStyles['mobile-bar'])).toBeTruthy();
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
    // TODO: enable after fixing 'tools controlled property'
    (theme === 'refresh-toolbar' && name === 'tools' ? test.skip : test)('property is controlled', () => {
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

    // TODO Enable after fixing disableBodyScroll
    (theme === 'refresh-toolbar' ? test.skip : test)(
      'should set height instead of min-height when the body scroll is disabled',
      () => {
        const { wrapper } = renderComponent(<AppLayout disableBodyScroll={true} />);
        const { blockSize, minBlockSize } = wrapper.getElement().style;
        expect({ blockSize, minBlockSize }).toEqual({ blockSize: 'calc(100vh - 0px)', minBlockSize: '' });
      }
    );
  });

  // TODO Enable after fixing 'Distinguish landmarks on page'
  (size === 'mobile' && theme !== 'refresh-toolbar' ? test : test.skip)('a11y', async () => {
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
          // notifications?: string;
          // navigation?: string;
          navigationToggle: 'Open navigation',
          navigationClose: 'Close navigation',
          // tools?: string;
          toolsToggle: 'Open tools',
          toolsClose: 'Close tools',
        }}
      />
    );
    await expect(container).toValidateA11y();
  });
});
