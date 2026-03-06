// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import AppLayout from '../../../lib/components/app-layout';
import ErrorBoundary from '../../../lib/components/error-boundary';
import awsuiPlugins from '../../../lib/components/internal/plugins';
import { DrawerConfig } from '../../../lib/components/internal/plugins/controllers/drawers';
import * as awsuiWidgetPlugins from '../../../lib/components/internal/plugins/widget';
import createWrapper, { ErrorBoundaryWrapper } from '../../../lib/components/test-utils/dom';
import { describeEachAppLayout, getGlobalDrawersTestUtils } from './utils';

const drawerDefaults: DrawerConfig = {
  id: 'test',
  ariaLabels: {},
  trigger: { iconSvg: 'icon placeholder' },
  mountContent: container => (container.textContent = 'runtime drawer content'),
  unmountContent: () => {},
};

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

beforeEach(() => {
  jest.resetAllMocks();
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

  describeEachAppLayout({ themes: ['refresh-toolbar'] }, () => {
    describe.each([true, false])(
      'entire AppLayout wrapped with error boundary component : %p',
      (wrappedWithErrorBoundary: boolean) => {
        const onError = jest.fn();
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        const AppLayoutWrapper = wrappedWithErrorBoundary ? ErrorBoundary : 'div';
        const appLayoutWrapperProps = wrappedWithErrorBoundary ? { onError } : {};
        const content = <div>content</div>;

        const expectErrorCallbacksToBeCalled = () => {
          if (wrappedWithErrorBoundary) {
            expect(onError).toHaveBeenCalled();
          }
          expect(consoleSpy).toHaveBeenCalled();
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
          expectErrorCallbacksToBeCalled();
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
          expectErrorCallbacksToBeCalled();
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
          expectErrorCallbacksToBeCalled();
        });

        test('breadcrumbs', () => {
          const { errorBoundaryWrapper, wrapper } = renderComponent(
            <AppLayoutWrapper {...(appLayoutWrapperProps as any)}>
              <AppLayout content={content} breadcrumbs={<ThrowError message="Breadcrumbs error" />} />
            </AppLayoutWrapper>
          );

          expect(wrapper.findContentRegion().getElement()).toHaveTextContent('content');
          expectInvisibleErrorBoundary(errorBoundaryWrapper);
          expectErrorCallbacksToBeCalled();
        });

        test('local drawer trigger', () => {
          awsuiPlugins.appLayout.registerDrawer({
            ...drawerDefaults,
            type: 'local',
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
          expectErrorCallbacksToBeCalled();
        });

        test('global drawer trigger', () => {
          awsuiPlugins.appLayout.registerDrawer({
            ...drawerDefaults,
            type: 'global',
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
          expectErrorCallbacksToBeCalled();
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
          expectErrorCallbacksToBeCalled();
        });

        test('local drawer content', () => {
          awsuiPlugins.appLayout.registerDrawer({
            ...drawerDefaults,
            type: 'local',
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
          expectErrorCallbacksToBeCalled();
        });

        test('global drawer content', () => {
          awsuiPlugins.appLayout.registerDrawer({
            ...drawerDefaults,
            type: 'global',
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
          expectErrorCallbacksToBeCalled();
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
          expectErrorCallbacksToBeCalled();
        });

        test('content area error are not caught by app layout error boundaries', () => {
          if (wrappedWithErrorBoundary) {
            const { errorBoundaryWrapper } = renderComponent(
              <AppLayoutWrapper {...(appLayoutWrapperProps as any)}>
                <AppLayout content={<ThrowError />} />
              </AppLayoutWrapper>
            );

            expectInvisibleErrorBoundary(errorBoundaryWrapper);
            expectErrorCallbacksToBeCalled();
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
