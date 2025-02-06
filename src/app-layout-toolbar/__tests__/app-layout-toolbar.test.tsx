// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/* eslint simple-import-sort/imports: 0 */
import React, { useRef, useState } from 'react';
import { render } from '@testing-library/react';
import AppLayoutToolbar, { AppLayoutToolbarProps } from '../../../lib/components/app-layout-toolbar';
import createWrapper from '../../../lib/components/test-utils/dom';
import { useVisualRefresh } from '../../../lib/components/internal/hooks/use-visual-mode';

jest.mock('../../../lib/components/internal/hooks/use-visual-mode', () => ({
  useVisualRefresh: jest.fn().mockReturnValue(false),
}));

export function renderComponent(jsx: React.ReactElement) {
  const { container, rerender } = render(jsx);
  const wrapper = createWrapper(container).findAppLayoutToolbar()!;

  return { wrapper, rerender, container };
}

describe('AppLayoutToolbar component', () => {
  let consoleWarnSpy: jest.SpyInstance;

  beforeEach(() => {
    (useVisualRefresh as jest.Mock).mockReturnValue(true);
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
  });
  afterEach(() => {
    (useVisualRefresh as jest.Mock).mockReset();
    consoleWarnSpy?.mockRestore();
  });

  test('warns when use in classic theme', () => {
    (useVisualRefresh as jest.Mock).mockReturnValue(false);

    renderComponent(<AppLayoutToolbar content={<div></div>} />);

    expect(console.warn).toHaveBeenCalledTimes(1);
    expect(console.warn).toHaveBeenCalledWith(
      '[AwsUi] [AppLayoutToolbar] This component is not supported in the Classic theme. Please switch to the Refresh theme. For more details, refer to the documentation.'
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
});
