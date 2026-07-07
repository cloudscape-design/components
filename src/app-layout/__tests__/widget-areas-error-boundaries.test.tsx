// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, render } from '@testing-library/react';

import AppLayout from '../../../lib/components/app-layout';
import ErrorBoundary from '../../../lib/components/error-boundary';
import { metrics } from '../../../lib/components/internal/metrics';
import awsuiPlugins from '../../../lib/components/internal/plugins';
import { DrawerConfig } from '../../../lib/components/internal/plugins/controllers/drawers';
import * as awsuiWidgetPlugins from '../../../lib/components/internal/plugins/widget';
import * as awsuiWidgetInternal from '../../../lib/components/internal/plugins/widget/core';
import createWrapper, { ErrorBoundaryWrapper } from '../../../lib/components/test-utils/dom';
import { describeEachAppLayout, getGlobalDrawersTestUtils } from './utils';

const drawerDefaults: DrawerConfig = {
  id: 'test',
  ariaLabels: {},
  trigger: { iconSvg: 'icon placeholder' },
  mountContent: container => (container.textContent = 'runtime drawer content'),
  unmountContent: () => {},
};

function delay() {
  return act(() => new Promise(resolve => setTimeout(resolve)));
}

function renderComponent(jsx: React.ReactElement) {
  const { container, rerender, getByTestId, ...rest } = render(jsx);
  const wrapper = createWrapper(container).findAppLayout()!;
  const errorBoundaryWrapper = createWrapper(container).findErrorBoundary()!;
  const globalDrawersWrapper = getGlobalDrawersTestUtils(wrapper);
  return {
    wrapper,
    errorBoundaryWrapper,
    globalDrawersWrapper,
    rerender,
    getByTestId,
    container,
    ...rest,
  };
}

// Drawers registered through the runtime plugin API (awsuiPlugins.appLayout.registerDrawer) are
// delivered asynchronously via the message bus, so they only mount after the microtask/timer queue
// is flushed. This helper renders, awaits that flush, and then resolves the wrappers so that a
// fallback rendered by a runtime drawer error is captured.
async function renderComponentAsync(jsx: React.ReactElement) {
  const { container, ...rest } = renderComponent(jsx);
  await delay();
  const wrapper = createWrapper(container).findAppLayout()!;
  return {
    ...rest,
    container,
    wrapper,
    errorBoundaryWrapper: createWrapper(container).findErrorBoundary()!,
    globalDrawersWrapper: getGlobalDrawersTestUtils(wrapper),
  };
}

let sendPanoramaMetricSpy: jest.SpyInstance;
beforeEach(() => {
  jest.resetAllMocks();
  // Runtime drawers are registered on a shared controller that persists across tests. Without an
  // explicit reset, drawers (and their thrown errors) leak into subsequent tests, which previously
  // masked the exact appLayoutPart values asserted below.
  awsuiPlugins.appLayout.clearRegisteredDrawersForTesting();
  awsuiWidgetInternal.clearInitialMessages();
  sendPanoramaMetricSpy = jest.spyOn(metrics, 'sendOpsMetricObject').mockImplementation(() => {});
});

describe('AppLayout error boundaries: errors in different areas does not crash the entire app layout', () => {
  const ThrowError = ({ message = 'Test error' }: { message?: string }) => {
    throw new Error(message);
  };

  const expectInvisibleErrorBoundary = (errorBoundaryWrapper: ErrorBoundaryWrapper) => {
    expect(errorBoundaryWrapper.getElement()).toBeInTheDocument();
    expect(errorBoundaryWrapper.findHeader()).toBeFalsy();
    expect(errorBoundaryWrapper.findDescription()).toBeFalsy();
    expect(errorBoundaryWrapper.findAction()).toBeFalsy();
  };

  describeEachAppLayout({ themes: ['refresh-toolbar'] }, ({ size }) => {
    describe.each([true, false])(
      'entire AppLayout wrapped with error boundary component : %p',
      (wrappedWithErrorBoundary: boolean) => {
        const onError = jest.fn();
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        const AppLayoutWrapper = wrappedWithErrorBoundary ? ErrorBoundary : 'div';
        const appLayoutWrapperProps = wrappedWithErrorBoundary ? { onError } : {};
        const content = <div>content</div>;

        // Asserts the ops metric was reported for the given app layout part(s). Pass every expected
        // appLayoutPart in the order they fire — this pins down the exact area the error boundary
        // attributed the failure to, rather than accepting any string.
        const expectErrorCallbacksToBeCalled = (...appLayoutParts: Array<string>) => {
          if (wrappedWithErrorBoundary) {
            expect(onError).toHaveBeenCalled();
          }
          expect(consoleSpy).toHaveBeenCalled();
          for (const appLayoutPart of appLayoutParts) {
            expect(sendPanoramaMetricSpy).toHaveBeenCalledWith('awsui-app-layout-error-boundary-fired', {
              appLayoutPart,
              errorMessage: expect.any(String),
            });
          }
          const reportedParts = sendPanoramaMetricSpy.mock.calls
            .filter(call => call[0] === 'awsui-app-layout-error-boundary-fired')
            .map(call => call[1].appLayoutPart);
          expect(reportedParts).toEqual(appLayoutParts);
        };

        test('left drawer content', () => {
          awsuiWidgetPlugins.registerLeftDrawer({
            defaultActive: true,
            ...drawerDefaults,
            id: '1',
            trigger: undefined,
            mountContent: () => {
              throw new Error('Mount error in drawer content');
            },
          });
          const { errorBoundaryWrapper, wrapper } = renderComponent(
            <AppLayoutWrapper {...(appLayoutWrapperProps as any)}>
              <AppLayout content={content} />
            </AppLayoutWrapper>
          );

          expect(wrapper.findContentRegion().getElement()).toHaveTextContent('content');
          expectInvisibleErrorBoundary(errorBoundaryWrapper);
          expectErrorCallbacksToBeCalled('left-drawer-content');
        });

        test('left drawer header', () => {
          awsuiWidgetPlugins.registerLeftDrawer({
            ...drawerDefaults,
            id: '2',
            defaultActive: true,
            trigger: undefined,
            mountHeader: () => {
              throw new Error('Mount error in drawer content');
            },
          });
          const { errorBoundaryWrapper, wrapper } = renderComponent(
            <AppLayoutWrapper {...(appLayoutWrapperProps as any)}>
              <AppLayout content={content} />
            </AppLayoutWrapper>
          );

          expect(wrapper.findContentRegion().getElement()).toHaveTextContent('content');
          expectInvisibleErrorBoundary(errorBoundaryWrapper);
          expectErrorCallbacksToBeCalled('left-drawer-header');
        });

        test('left drawer trigger', () => {
          awsuiWidgetPlugins.registerLeftDrawer({
            ...drawerDefaults,
            id: '3',
            trigger: {
              iconSvg: Symbol() as any,
            },
          });
          const { errorBoundaryWrapper, wrapper } = renderComponent(
            <AppLayoutWrapper {...(appLayoutWrapperProps as any)}>
              <AppLayout content={content} />
            </AppLayoutWrapper>
          );

          expect(wrapper.findContentRegion().getElement()).toHaveTextContent('content');
          expectInvisibleErrorBoundary(errorBoundaryWrapper);
          expectErrorCallbacksToBeCalled('left-drawer-trigger');
        });

        test('breadcrumbs', () => {
          const { errorBoundaryWrapper, wrapper } = renderComponent(
            <AppLayoutWrapper {...(appLayoutWrapperProps as any)}>
              <AppLayout content={content} breadcrumbs={<ThrowError message="Breadcrumbs error" />} />
            </AppLayoutWrapper>
          );

          expect(wrapper.findContentRegion().getElement()).toHaveTextContent('content');
          expectInvisibleErrorBoundary(errorBoundaryWrapper);
          // Breadcrumbs are rendered in two places: a screenreader-only copy and the visible toolbar
          // section, so the failure is reported for both boundaries.
          expectErrorCallbacksToBeCalled('screenreader-only-breadcrumbs', 'breadcrumbs');
        });

        // Runtime drawer triggers are only rendered inline in the toolbar on mobile. On desktop a
        // single runtime trigger is collapsed into the overflow menu, where the invalid iconSvg is
        // never written to the DOM, so no render error is thrown. These tests therefore only run on
        // mobile, where the toolbar trigger boundary catches the error.
        (size === 'mobile' ? test : test.skip)('local drawer trigger', async () => {
          awsuiPlugins.appLayout.registerDrawer({
            ...drawerDefaults,
            type: 'local',
            trigger: {
              iconSvg: Symbol() as any,
            },
          });

          const { errorBoundaryWrapper, wrapper } = await renderComponentAsync(
            <AppLayoutWrapper {...(appLayoutWrapperProps as any)}>
              <AppLayout content={content} />
            </AppLayoutWrapper>
          );

          expect(wrapper.findContentRegion().getElement()).toHaveTextContent('content');
          expectInvisibleErrorBoundary(errorBoundaryWrapper);
          expectErrorCallbacksToBeCalled('toolbar-trigger-drawer');
        });

        (size === 'mobile' ? test : test.skip)('global drawer trigger', async () => {
          awsuiPlugins.appLayout.registerDrawer({
            ...drawerDefaults,
            type: 'global',
            trigger: {
              iconSvg: Symbol() as any,
            },
          });

          const { errorBoundaryWrapper, wrapper } = await renderComponentAsync(
            <AppLayoutWrapper {...(appLayoutWrapperProps as any)}>
              <AppLayout content={content} />
            </AppLayoutWrapper>
          );

          expect(wrapper.findContentRegion().getElement()).toHaveTextContent('content');
          expectInvisibleErrorBoundary(errorBoundaryWrapper);
          expectErrorCallbacksToBeCalled('toolbar-trigger-drawer');
        });

        test('nav panel', () => {
          const { errorBoundaryWrapper, wrapper } = renderComponent(
            <AppLayoutWrapper {...(appLayoutWrapperProps as any)}>
              <AppLayout
                content={content}
                navigation={<ThrowError message="Breadcrumbs error" />}
                navigationOpen={true}
              />
            </AppLayoutWrapper>
          );

          expect(wrapper.findContentRegion().getElement()).toHaveTextContent('content');
          expectInvisibleErrorBoundary(errorBoundaryWrapper);
          expectErrorCallbacksToBeCalled('before-main-slot');
        });

        test('local drawer content', async () => {
          awsuiPlugins.appLayout.registerDrawer({
            ...drawerDefaults,
            type: 'local',
            defaultActive: true,
            mountContent: () => {
              throw new Error('Mount error in drawer content');
            },
          });

          const { errorBoundaryWrapper, wrapper } = await renderComponentAsync(
            <AppLayoutWrapper {...(appLayoutWrapperProps as any)}>
              <AppLayout content={content} />
            </AppLayoutWrapper>
          );

          expect(wrapper.findContentRegion().getElement()).toHaveTextContent('content');
          expectInvisibleErrorBoundary(errorBoundaryWrapper);
          // Local runtime drawers mount into the tools slot.
          expectErrorCallbacksToBeCalled('tools');
        });

        test('global drawer content', async () => {
          awsuiPlugins.appLayout.registerDrawer({
            ...drawerDefaults,
            type: 'global',
            defaultActive: true,
            mountContent: () => {
              throw new Error('Mount error in drawer content');
            },
          });

          const { errorBoundaryWrapper, wrapper } = await renderComponentAsync(
            <AppLayoutWrapper {...(appLayoutWrapperProps as any)}>
              <AppLayout content={content} />
            </AppLayoutWrapper>
          );

          expect(wrapper.findContentRegion().getElement()).toHaveTextContent('content');
          expectInvisibleErrorBoundary(errorBoundaryWrapper);
          expectErrorCallbacksToBeCalled('global-drawer');
        });

        test('bottom drawer content', () => {
          awsuiWidgetPlugins.registerBottomDrawer({
            defaultActive: true,
            ...drawerDefaults,
            id: '4',
            mountContent: () => {
              throw new Error('Mount error in drawer content');
            },
          });

          const { errorBoundaryWrapper, wrapper } = renderComponent(
            <AppLayoutWrapper {...(appLayoutWrapperProps as any)}>
              <AppLayout content={content} />
            </AppLayoutWrapper>
          );

          expect(wrapper.findContentRegion().getElement()).toHaveTextContent('content');
          expectInvisibleErrorBoundary(errorBoundaryWrapper);
          expectErrorCallbacksToBeCalled('bottom-drawer');
        });

        test('content area error are not caught by app layout error boundaries', () => {
          if (wrappedWithErrorBoundary) {
            const { errorBoundaryWrapper } = renderComponent(
              <AppLayoutWrapper {...(appLayoutWrapperProps as any)}>
                <AppLayout content={<ThrowError />} />
              </AppLayoutWrapper>
            );

            // The content area is not wrapped by an app layout error boundary, so the error bubbles
            // up to the outer ErrorBoundary which renders its visible fallback (unlike the invisible
            // app-layout fallbacks) and no app-layout ops metric is reported.
            expect(errorBoundaryWrapper.getElement()).toBeInTheDocument();
            expect(errorBoundaryWrapper.findHeader()).toBeTruthy();
            expect(sendPanoramaMetricSpy).not.toHaveBeenCalledWith(
              'awsui-app-layout-error-boundary-fired',
              expect.anything()
            );
            expect(consoleSpy).toHaveBeenCalled();
            expect(onError).toHaveBeenCalled();
          } else {
            expect(() =>
              render(
                <AppLayoutWrapper {...(appLayoutWrapperProps as any)}>
                  <AppLayout content={<ThrowError />} />
                </AppLayoutWrapper>
              )
            ).toThrow('Test error');
          }
        });
      }
    );
  });
});

describe('AppLayout error boundary detection hooks exposed on the app layout root', () => {
  const ThrowError = ({ message }: { message: string }) => {
    throw new Error(message);
  };

  const getAppLayoutRoot = (container: HTMLElement) => {
    const root = container.querySelector<HTMLElement>('[data-awsui-app-layout-widget-loaded]');
    if (!root) {
      throw new Error('App layout root element not found');
    }
    return root;
  };

  describeEachAppLayout({ themes: ['refresh-toolbar'] }, () => {
    let consoleSpy: jest.SpyInstance;
    beforeEach(() => {
      consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    });
    afterEach(() => {
      consoleSpy.mockRestore();
    });

    test('a real boundary catch is recorded and readable via getAppLayoutErrors on the app layout root', () => {
      const message = `nav failure ${Math.random()}`;
      const { container } = renderComponent(
        <AppLayout content={<div>content</div>} navigation={<ThrowError message={message} />} navigationOpen={true} />
      );

      const root = getAppLayoutRoot(container);
      expect(typeof root.__awsui__?.getAppLayoutErrors).toBe('function');
      expect(root.__awsui__!.getAppLayoutErrors!()).toContainEqual({ appLayoutPart: 'before-main-slot', message });
    });

    test('throwInAppLayoutPart drives a real boundary catch that lands in the registry', () => {
      const { container } = renderComponent(<AppLayout content={<div>content</div>} />);

      const root = getAppLayoutRoot(container);
      root.__awsui__!.clearAppLayoutErrors!();
      act(() => root.__awsui__!.throwInAppLayoutPart!('before-main-slot'));

      expect(root.__awsui__!.getAppLayoutErrors!()).toContainEqual({
        appLayoutPart: 'before-main-slot',
        message: '[AwsUiAppLayout] forced test error',
      });
    });
  });
});
