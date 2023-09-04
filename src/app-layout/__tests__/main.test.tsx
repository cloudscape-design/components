// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { waitFor } from '@testing-library/react';
import { isDrawerClosed, renderComponent, singleDrawer } from './utils';
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

describe.each([
  [
    'navigation',
    {
      propName: 'navigationOpen',
      handlerName: 'onNavigationChange',
      findElement: (wrapper: AppLayoutWrapper) => wrapper.findNavigation(),
      findToggle: (wrapper: AppLayoutWrapper) => wrapper.findNavigationToggle(),
      findClose: (wrapper: AppLayoutWrapper) => wrapper.findNavigationClose(),
    },
  ],
  [
    'tools',
    {
      propName: 'toolsOpen',
      handlerName: 'onToolsChange',
      findElement: (wrapper: AppLayoutWrapper) => wrapper.findTools(),
      findToggle: (wrapper: AppLayoutWrapper) => wrapper.findToolsToggle(),
      findClose: (wrapper: AppLayoutWrapper) => wrapper.findToolsClose(),
    },
  ],
] as const)('%s', (name, { propName, handlerName, findToggle, findElement, findClose }) => {
  test('property is controlled', () => {
    const onChange = jest.fn();
    const { wrapper, rerender } = renderComponent(<AppLayout {...{ [propName]: false, [handlerName]: onChange }} />);
    findToggle(wrapper).click();
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ detail: { open: true } }));
    expect(isDrawerClosed(findElement(wrapper))).toBe(true);

    rerender(<AppLayout {...{ [propName]: true, [handlerName]: onChange }} />);
    findClose(wrapper).click();
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ detail: { open: false } }));
    expect(isDrawerClosed(findElement(wrapper))).toBe(false);
  });

  test('when property is not set, toggles the visibility without handler', () => {
    const { wrapper } = renderComponent(<AppLayout />);
    expect(isDrawerClosed(findElement(wrapper))).toBe(true);
    findToggle(wrapper).click();
    expect(isDrawerClosed(findElement(wrapper))).toBe(false);
  });
});

describe('drawers', () => {
  const findElement = (wrapper: AppLayoutWrapper) => wrapper.findActiveDrawer()!;
  const findToggle = (wrapper: AppLayoutWrapper) => wrapper.findDrawersTriggers()![0];
  const findClose = (wrapper: AppLayoutWrapper) => wrapper.findActiveDrawerCloseButton()!;

  test('property is controlled', () => {
    const onChange = jest.fn();
    const drawers = {
      drawers: {
        onChange: onChange,
        activeDrawerId: null,
        items: singleDrawer.drawers.items,
      },
    };

    const drawersOpen = {
      drawers: {
        onChange: onChange,
        activeDrawerId: 'security',
        items: singleDrawer.drawers.items,
      },
    };

    const { wrapper, rerender } = renderComponent(<AppLayout contentType="form" {...drawers} />);

    expect(findElement(wrapper)).toBeNull();
    findToggle(wrapper).click();
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ detail: 'security' }));

    rerender(<AppLayout contentType="form" {...drawersOpen} />);

    expect(findElement(wrapper)).not.toBeNull();
    findClose(wrapper).click();
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ detail: null }));
  });
});

describe('Content height calculation', () => {
  test('should take the full page height by default', () => {
    const { contentElement } = renderComponent(<AppLayout />);
    expect(contentElement).toHaveStyle({ minHeight: 'calc(100vh - 0px)' });
  });

  test('should include header and footer in the calculation', async () => {
    const { contentElement } = renderComponent(
      <div id="b">
        <div style={{ height: 40 }} id="h" />
        <AppLayout />
        <div style={{ height: 35 }} id="f" />
      </div>
    );
    await waitFor(() => expect(contentElement).toHaveStyle({ minHeight: 'calc(100vh - 75px)' }));
  });

  test('should use alternative header and footer selector', async () => {
    const { contentElement } = renderComponent(
      <>
        <div style={{ height: 20 }} id="header" />
        <AppLayout headerSelector="#header" footerSelector="#footer" />
        <div style={{ height: 25 }} id="footer" />
      </>
    );
    await waitFor(() => expect(contentElement).toHaveStyle({ minHeight: 'calc(100vh - 45px)' }));
  });

  test('should set height instead of min-height when the body scroll is disabled', () => {
    const { contentElement } = renderComponent(<AppLayout disableBodyScroll={true} />);
    const { height, minHeight } = contentElement.style;
    expect({ height, minHeight }).toEqual({ height: 'calc(100vh - 0px)', minHeight: '' });
  });
});

test('a11y', async () => {
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

test('drawers a11y', async () => {
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
      {...singleDrawer}
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
