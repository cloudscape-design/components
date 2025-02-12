// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/* eslint simple-import-sort/imports: 0 */
import React, { useRef, useState } from 'react';
import { render } from '@testing-library/react';
import { clearVisualRefreshState } from '@cloudscape-design/component-toolkit/internal/testing';
import AppLayoutToolbar, { AppLayoutToolbarProps } from '../../../lib/components/app-layout-toolbar';
import createWrapper from '../../../lib/components/test-utils/dom';
import BreadcrumbGroup from '../../../lib/components/breadcrumb-group';

export function renderComponent(jsx: React.ReactElement) {
  const { container, rerender } = render(jsx);
  const wrapper = createWrapper(container).findAppLayoutToolbar()!;

  return { wrapper, rerender, container };
}

describe('AppLayoutToolbar component', () => {
  const globalWithFlags = globalThis as any;

  beforeEach(() => {
    globalWithFlags[Symbol.for('awsui-visual-refresh-flag')] = () => true;
  });

  afterEach(() => {
    delete globalWithFlags[Symbol.for('awsui-visual-refresh-flag')];
    clearVisualRefreshState();
  });

  test('throws an error when use in classic theme', () => {
    globalWithFlags[Symbol.for('awsui-visual-refresh-flag')] = () => false;

    expect(() => render(<AppLayoutToolbar content={<div></div>} />)).toThrowError(
      'AppLayoutToolbar component is not supported in the Classic theme. Please switch to the Refresh theme. For more details, refer to the documentation.'
    );
  });

  test('triggerless navigation', () => {
    const AppLayoutToolbarWrapper = () => {
      const [isNavigationOpen, setIsNavigationOpen] = useState(false);
      const appLayoutToolbarRef = useRef<AppLayoutToolbarProps.Ref>(null);

      return (
        <AppLayoutToolbar
          ref={appLayoutToolbarRef}
          navigationTriggerHide={true}
          navigationOpen={isNavigationOpen}
          onNavigationChange={event => setIsNavigationOpen(event.detail.open)}
          navigation={<>Mock Navigation</>}
          content={
            <div>
              Content
              <button
                data-testid="toggle-navigation"
                onClick={() => {
                  setIsNavigationOpen(current => !current);
                  appLayoutToolbarRef.current?.focusNavigation();
                }}
              >
                Toggle navigation
              </button>
            </div>
          }
        />
      );
    };
    const { wrapper } = renderComponent(<AppLayoutToolbarWrapper />);

    expect(wrapper.findNavigationToggle()).toBeFalsy();
    expect(wrapper.findOpenNavigationPanel()).toBeFalsy();

    wrapper.find(`[data-testid="toggle-navigation"]`)!.click();

    expect(wrapper.findOpenNavigationPanel()).toBeTruthy();
    expect(wrapper.findNavigationClose()!.getElement()).toHaveFocus();
  });

  test('triggerless drawers', () => {
    const drawerId = 'pro-help';
    const AppLayoutToolbarWrapper = () => {
      const [activeDrawerId, setActiveDrawerId] = useState<string | null>(null);
      const appLayoutToolbarRef = useRef<AppLayoutToolbarProps.Ref>(null);

      return (
        <AppLayoutToolbar
          ref={appLayoutToolbarRef}
          navigationTriggerHide={true}
          activeDrawerId={activeDrawerId}
          drawers={[
            {
              ariaLabels: {
                closeButton: 'ProHelp close button',
                drawerName: 'ProHelp drawer content',
                triggerButton: 'ProHelp trigger button',
                resizeHandle: 'ProHelp resize handle',
              },
              content: <div>Drawer content</div>,
              id: drawerId,
            },
          ]}
          onDrawerChange={event => {
            setActiveDrawerId(event.detail.activeDrawerId);
          }}
          content={
            <div>
              Content
              <button data-testid="open-drawer" onClick={() => setActiveDrawerId(drawerId)}>
                Open a drawer
              </button>
            </div>
          }
        />
      );
    };
    const { wrapper } = renderComponent(<AppLayoutToolbarWrapper />);

    expect(wrapper.findDrawerTriggerById(drawerId)).toBeFalsy();
    expect(wrapper.findActiveDrawer()).toBeFalsy();

    wrapper.find('[data-testid="open-drawer"]')!.click();

    expect(wrapper.findActiveDrawer()).toBeTruthy();
  });

  test('should not render the toolbar when there is no nav & drawers triggers & no breadcrumbs', () => {
    const { wrapper } = renderComponent(
      <AppLayoutToolbar
        navigationTriggerHide={true}
        navigation={<>Mock Navigation</>}
        breadcrumbs={undefined}
        drawers={[
          {
            ariaLabels: {
              closeButton: 'ProHelp close button',
              drawerName: 'ProHelp drawer content',
              triggerButton: 'ProHelp trigger button',
              resizeHandle: 'ProHelp resize handle',
            },
            content: <div>Drawer content</div>,
            id: 'pro-help',
          },
        ]}
        content={<div>Content</div>}
      />
    );

    expect(wrapper.findToolbar()).toBeFalsy();
  });

  test('should not deduplicate toolbar props in nested components', () => {
    const { container } = render(
      <AppLayoutToolbar
        navigation={<>Mock Navigation</>}
        toolsHide={true}
        breadcrumbs={<BreadcrumbGroup items={[{ text: 'HomeOuter', href: '#' }]} />}
        content={
          <AppLayoutToolbar
            navigationHide={true}
            breadcrumbs={<BreadcrumbGroup items={[{ text: 'HomeInner', href: '#' }]} />}
            content={<div>Content</div>}
          />
        }
      />
    );

    const layouts = createWrapper(container).findAllAppLayoutToolbars();
    const [outer, inner] = layouts;

    expect(layouts).toHaveLength(2);
    expect(outer.findToolbar()).toBeTruthy();
    expect(inner.findToolbar()).toBeTruthy();
    expect(outer.findBreadcrumbs()!.getElement()).toHaveTextContent('HomeOuter');
    expect(inner.findBreadcrumbs()!.getElement()).toHaveTextContent('HomeInner');
  });
});
