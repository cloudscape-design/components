// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/* eslint simple-import-sort/imports: 0 */
import React, { useRef, useState } from 'react';
import { render } from '@testing-library/react';
import PageLayout, { PageLayoutProps } from '../../../lib/components/page-layout';
import createWrapper from '../../../lib/components/test-utils/dom';

export function renderComponent(jsx: React.ReactElement) {
  const { container, rerender } = render(jsx);
  const wrapper = createWrapper(container).findPageLayout()!;

  return { wrapper, rerender, container };
}

describe('PageLayout', () => {
  test('triggerless navigation', () => {
    const PageLayoutWrapper = () => {
      const [isNavigationOpen, setIsNavigationOpen] = useState(false);

      return (
        <PageLayout
          navigationTriggerHide={true}
          navigationOpen={isNavigationOpen}
          onNavigationChange={event => setIsNavigationOpen(event.detail.open)}
          navigation={<>Mock Navigation</>}
          content={
            <div>
              Content
              <button data-testid="toggle-navigation" onClick={() => setIsNavigationOpen(current => !current)}>
                Toggle navigation
              </button>
            </div>
          }
        />
      );
    };
    const { wrapper } = renderComponent(<PageLayoutWrapper />);

    expect(wrapper.findNavigationToggle()).toBeFalsy();
    expect(wrapper.findOpenNavigationPanel()).toBeFalsy();

    wrapper.find(`[data-testid="toggle-navigation"]`)!.click();

    expect(wrapper.findOpenNavigationPanel()).toBeTruthy();
  });

  test('triggerless drawers', () => {
    const drawerId = 'pro-help';
    const PageLayoutWrapper = () => {
      const [activeDrawerId, setActiveDrawerId] = useState<string | null>(null);
      const appLayoutRef = useRef<PageLayoutProps.Ref>(null);

      return (
        <PageLayout
          ref={appLayoutRef}
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
    const { wrapper } = renderComponent(<PageLayoutWrapper />);

    expect(wrapper.findDrawerTriggerById(drawerId)).toBeFalsy();
    expect(wrapper.findActiveDrawer()).toBeFalsy();

    wrapper.find('[data-testid="open-drawer"]')!.click();

    expect(wrapper.findActiveDrawer()).toBeTruthy();
  });
});
