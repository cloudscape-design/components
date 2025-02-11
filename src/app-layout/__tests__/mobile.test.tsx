// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { act, within } from '@testing-library/react';

import { findUpUntil } from '@cloudscape-design/component-toolkit/dom';

import AppLayout, { AppLayoutProps } from '../../../lib/components/app-layout';
import SideNavigation from '../../../lib/components/side-navigation';
import SplitPanel from '../../../lib/components/split-panel';
import { AppLayoutWrapper } from '../../../lib/components/test-utils/dom';
import {
  describeEachAppLayout,
  manyDrawers,
  renderComponent,
  splitPanelI18nStrings,
  testDrawer,
  testDrawerWithoutLabels,
} from './utils';

import drawersMobileStyles from '../../../lib/components/app-layout/mobile-toolbar/styles.css.js';
import mobileToolbarStyles from '../../../lib/components/app-layout/mobile-toolbar/styles.css.js';
import styles from '../../../lib/components/app-layout/styles.css.js';
import testUtilsStyles from '../../../lib/components/app-layout/test-classes/styles.css.js';
import visualRefreshRefactoredStyles from '../../../lib/components/app-layout/visual-refresh/styles.css.js';
import toolbarNotificationsStyles from '../../../lib/components/app-layout/visual-refresh-toolbar/notifications/styles.css.js';
import toolbarSkeletonStyles from '../../../lib/components/app-layout/visual-refresh-toolbar/skeleton/styles.css.js';
import toolbarStyles from '../../../lib/components/app-layout/visual-refresh-toolbar/toolbar/styles.css.js';
import toolbarTriggerButtonStyles from '../../../lib/components/app-layout/visual-refresh-toolbar/toolbar/trigger-button/styles.css.js';
import iconStyles from '../../../lib/components/icon/styles.css.js';

function AppLayoutWithControlledNavigation({
  initialNavigationOpen,
  navigation,
}: {
  initialNavigationOpen: boolean;
  navigation: React.ReactNode;
}) {
  const [navigationOpen, setNavigationOpen] = useState(initialNavigationOpen);

  return (
    <AppLayout
      navigationOpen={navigationOpen}
      onNavigationChange={({ detail }) => {
        setNavigationOpen(detail.open);
      }}
      navigation={navigation}
    />
  );
}

describeEachAppLayout({ sizes: ['mobile'] }, ({ theme }) => {
  // In refactored Visual Refresh different styles are used compared to Classic
  const mobileBarClassName = {
    refresh: testUtilsStyles['mobile-bar'],
    'refresh-toolbar': toolbarSkeletonStyles['toolbar-container'],
    classic: mobileToolbarStyles['mobile-bar'],
  }[theme];
  const drawerBarClassName = {
    refresh: visualRefreshRefactoredStyles['drawers-mobile-triggers-container'],
    'refresh-toolbar': toolbarStyles['drawers-trigger-content'],
    classic: drawersMobileStyles['drawers-container'],
  }[theme];
  const blockBodyScrollClassName = {
    refresh: visualRefreshRefactoredStyles['block-body-scroll'],
    'refresh-toolbar': toolbarStyles['block-body-scroll'],
    classic: mobileToolbarStyles['block-body-scroll'],
  }[theme];
  const unfocusableClassName = {
    refresh: visualRefreshRefactoredStyles.unfocusable,
    'refresh-toolbar': toolbarSkeletonStyles['unfocusable-mobile'],
    classic: styles.unfocusable,
  }[theme];
  const stickyNotificationsClassName = {
    refresh: '', // does not exist in this design
    'refresh-toolbar': toolbarNotificationsStyles['sticky-notifications'],
    classic: `.${styles['notifications-sticky']}`,
  };

  const triggerBadgeClassName =
    theme === 'refresh-toolbar' ? toolbarTriggerButtonStyles['trigger-badge-wrapper'] : iconStyles.badge;
  const isUnfocusable = (element: HTMLElement) =>
    !!findUpUntil(element, current => current.classList.contains(unfocusableClassName));

  const findMobileToolbar = (wrapper: AppLayoutWrapper) => wrapper.findByClassName(mobileBarClassName);
  const findDrawersContainer = (wrapper: AppLayoutWrapper) => wrapper.findByClassName(drawerBarClassName);

  test('Renders closed drawer state', () => {
    const { wrapper } = renderComponent(<AppLayout />);
    expect(document.body).not.toHaveClass(blockBodyScrollClassName);
    expect(wrapper.findNavigation()).toBeTruthy();
    expect(wrapper.findOpenNavigationPanel()).toBeFalsy();
    expect(wrapper.findTools()).toBeTruthy();
    expect(wrapper.findOpenToolsPanel()).toBeFalsy();
    expect(wrapper.findNavigationToggle().getElement()).toBeEnabled();
    expect(wrapper.findToolsToggle().getElement()).toBeEnabled();
  });

  test('AppLayout with controlled navigation has navigation forcely closed on initial load', () => {
    const { wrapper } = renderComponent(
      <AppLayoutWithControlledNavigation
        initialNavigationOpen={true}
        navigation={
          <>
            <h1>Navigation</h1>
            <a href="test">Link</a>
          </>
        }
      />
    );
    // AppLayout forcely closes the navigation on the first load on mobile, so the main content is visible
    expect(wrapper.findNavigation()).toBeTruthy();
    expect(wrapper.findOpenNavigationPanel()).toBeFalsy();
  });

  test('AppLayout with uncontrolled navigation has navigation forcely closed on initial load', () => {
    const { wrapper } = renderComponent(
      <AppLayout
        navigation={
          <>
            <h1>Navigation</h1>
            <a href="test">Link</a>
          </>
        }
      />
    );
    // AppLayout forcely closes the navigation on the first load on mobile, so the main content is visible
    expect(wrapper.findNavigation()).toBeTruthy();
    expect(wrapper.findOpenNavigationPanel()).toBeFalsy();
  });

  test('renders open navigation state', () => {
    const { wrapper } = renderComponent(<AppLayout navigationOpen={true} onNavigationChange={() => {}} />);
    expect(wrapper.findOpenNavigationPanel()).toBeTruthy();
    expect(wrapper.findOpenToolsPanel()).toBeFalsy();
    expect(document.body).toHaveClass(blockBodyScrollClassName);
    expect(wrapper.findNavigationToggle().getElement()).toBeDisabled();
    expect(wrapper.findToolsToggle().getElement()).toBeDisabled();
  });

  test('renders open tools state', () => {
    const { wrapper } = renderComponent(<AppLayout toolsOpen={true} onToolsChange={() => {}} />);
    expect(document.body).toHaveClass(blockBodyScrollClassName);
    expect(wrapper.findOpenNavigationPanel()).toBeFalsy();
    expect(wrapper.findOpenToolsPanel()).toBeTruthy();
    expect(wrapper.findNavigationToggle().getElement()).toBeDisabled();
    expect(wrapper.findToolsToggle().getElement()).toBeDisabled();
  });

  test('renders open drawer state', () => {
    const { wrapper } = renderComponent(
      <AppLayout activeDrawerId={testDrawer.id} drawers={[testDrawer]} onDrawerChange={() => {}} />
    );
    expect(document.body).toHaveClass(blockBodyScrollClassName);
    expect(wrapper.findOpenNavigationPanel()).toBeFalsy();
    expect(wrapper.findTools()).toBeFalsy();
    expect(wrapper.findActiveDrawer()).toBeTruthy();
  });

  test('Renders mobile toolbar when at least one of it features is defined', function () {
    const { wrapper, rerender } = renderComponent(<AppLayout toolsHide={true} />);
    expect(findMobileToolbar(wrapper)).toBeTruthy();
    rerender(<AppLayout navigationHide={true} />);
    expect(findMobileToolbar(wrapper)).toBeTruthy();
    rerender(<AppLayout navigationHide={true} toolsHide={true} breadcrumbs="test" />);
    expect(findMobileToolbar(wrapper)).toBeTruthy();
    rerender(<AppLayout navigationHide={true} toolsHide={true} />);
    expect(findMobileToolbar(wrapper)).toBeFalsy();
  });

  test('clears up body scroll class when component is destroyed', () => {
    const { rerender } = renderComponent(<AppLayout navigationOpen={true} onNavigationChange={() => {}} />);
    expect(document.body).toHaveClass(blockBodyScrollClassName);

    rerender(<div />);

    expect(document.body).not.toHaveClass(blockBodyScrollClassName);
  });

  test('closes navigation when clicking on links', () => {
    const { wrapper } = renderComponent(
      <AppLayoutWithControlledNavigation
        initialNavigationOpen={true}
        navigation={
          <>
            <h1>Navigation</h1>
            <a href="test">Link</a>
          </>
        }
      />
    );
    // AppLayout forcely closes the navigation on the first load on mobile, so the main content is visible
    expect(wrapper.findOpenNavigationPanel()).toBeFalsy();

    wrapper.findNavigationToggle().click();
    expect(wrapper.findOpenNavigationPanel()).toBeTruthy();

    wrapper.findNavigation().find('a')!.click();
    expect(wrapper.findOpenNavigationPanel()).toBeFalsy();
  });

  test('closes navigation when clicking on a link in the Side Navigation component', () => {
    const { wrapper } = renderComponent(
      <AppLayoutWithControlledNavigation
        initialNavigationOpen={true}
        navigation={
          <SideNavigation
            items={[
              {
                type: 'link',
                text: 'Page 1',
                href: '#/page1',
              },
            ]}
          />
        }
      />
    );
    // AppLayout forcely closes the navigation on the first load on mobile, so the main content is visible
    expect(wrapper.findOpenNavigationPanel()).toBeFalsy();

    wrapper.findNavigationToggle().click();
    expect(wrapper.findOpenNavigationPanel()).toBeTruthy();

    wrapper.findNavigation().find('a')!.click();
    expect(wrapper.findOpenNavigationPanel()).toBeFalsy();
  });

  test('does not close navigation when anchor without href was clicked', () => {
    const { wrapper } = renderComponent(
      <AppLayoutWithControlledNavigation
        initialNavigationOpen={true}
        navigation={
          <>
            <h1>Navigation</h1>
            <a>Link</a>
          </>
        }
      />
    );
    // AppLayout forcely closes the navigation on the first load on mobile, so the main content is visible
    expect(wrapper.findOpenNavigationPanel()).toBeFalsy();

    wrapper.findNavigationToggle().click();
    expect(wrapper.findOpenNavigationPanel()).toBeTruthy();

    wrapper.findNavigation().find('a')!.click();
    expect(wrapper.findOpenNavigationPanel()).toBeTruthy();
  });

  test('does not close navigation when other elements were clicked', () => {
    const { wrapper } = renderComponent(
      <AppLayoutWithControlledNavigation
        initialNavigationOpen={true}
        navigation={
          <>
            <h1>Navigation</h1>
            <a>Link</a>
          </>
        }
      />
    );
    // AppLayout forcely closes the navigation on the first load on mobile, so the main content is visible
    expect(wrapper.findOpenNavigationPanel()).toBeFalsy();

    wrapper.findNavigationToggle().click();
    expect(wrapper.findOpenNavigationPanel()).toBeTruthy();

    wrapper.findNavigation().find('h1')!.click();
    expect(wrapper.findOpenNavigationPanel()).toBeTruthy();
  });

  test('does not close tools when clicking on any element', () => {
    const onToolsChange = jest.fn();
    const { wrapper } = renderComponent(
      <AppLayout
        toolsOpen={true}
        onToolsChange={onToolsChange}
        tools={
          <>
            <h1>Tools</h1>
            <a href="#">Learn more</a>
          </>
        }
      />
    );
    wrapper.findTools().find('a')!.click();

    expect(onToolsChange).not.toHaveBeenCalled();
  });

  test('renders split panel in forced bottom position on mobile', () => {
    const defaultProps = {
      splitPanelOpen: true,
      onSplitPanelToggle: () => {},
      onSplitPanelPreferencesChange: () => {},
      splitPanel: (
        <SplitPanel i18nStrings={splitPanelI18nStrings} header="test header">
          test content
        </SplitPanel>
      ),
    };

    const { wrapper, rerender } = renderComponent(
      <AppLayout {...defaultProps} splitPanelPreferences={{ position: 'bottom' }} />
    );
    expect(wrapper.findSplitPanel()!.findOpenPanelBottom()).not.toBeNull();
    rerender(<AppLayout {...defaultProps} splitPanelPreferences={{ position: 'side' }} />);
    expect(wrapper.findSplitPanel()!.findOpenPanelBottom()).not.toBeNull();
  });

  test('does not render mobile app bar when __embeddedViewMode is active (private API)', () => {
    const defaultProps = {
      breadcrumbs: 'Breadcrumbs',
    };

    const { wrapper, rerender } = renderComponent(<AppLayout {...defaultProps} />);
    expect(wrapper.findByClassName(mobileBarClassName)).not.toBeNull();
    rerender(<AppLayout {...defaultProps} {...{ __embeddedViewMode: true }} />);
    expect(wrapper.findByClassName(mobileBarClassName)).toBeNull();
  });

  [
    {
      openProp: 'navigationOpen',
      hideProp: 'navigationHide',
      handler: 'onNavigationChange',
      findElement: (wrapper: AppLayoutWrapper) => wrapper.findNavigation(),
      findToggle: (wrapper: AppLayoutWrapper) => wrapper.findNavigationToggle(),
    },
    {
      openProp: 'toolsOpen',
      hideProp: 'toolsHide',
      handler: 'onToolsChange',
      findElement: (wrapper: AppLayoutWrapper) => wrapper.findTools(),
      findToggle: (wrapper: AppLayoutWrapper) => wrapper.findToolsToggle(),
    },
  ].forEach(({ openProp, handler, findToggle, findElement }) => {
    test('Toggle should be enabled when drawer is closed', () => {
      const { wrapper } = renderComponent(<AppLayout />);
      expect(findToggle(wrapper).getElement()).toBeEnabled();
    });

    test('Toggle should be disabled when drawer is open', () => {
      const props = { [openProp]: true, [handler]: () => {} };
      const { wrapper } = renderComponent(<AppLayout {...props} />);

      expect(findElement(wrapper)).toBeTruthy();
      expect(findToggle(wrapper).getElement()).toBeDisabled();
    });
  });

  test('Navigation Toggle is enabled with toolsOpen + toolsHide', () => {
    const { wrapper } = renderComponent(<AppLayout toolsHide={true} toolsOpen={true} navigation="nav content" />);
    expect(wrapper.findNavigationToggle().getElement()).toBeEnabled();
  });

  test('Tools Toggle is enabled with navigationOpen + navigationHide', () => {
    const { wrapper } = renderComponent(<AppLayout navigationHide={true} navigationOpen={true} tools="nav content" />);
    expect(wrapper.findToolsToggle().getElement()).toBeEnabled();
  });

  test('does not pass min and max width to the content', () => {
    const { wrapper } = renderComponent(<AppLayout minContentWidth={120} maxContentWidth={800} />);
    expect(wrapper.find('[style*="max-width"')).toBeNull();
    expect(wrapper.find('[style*="min-width"')).toBeNull();
  });

  test('closes navigation via ref', () => {
    let ref: AppLayoutProps.Ref | null = null;
    const { wrapper } = renderComponent(<AppLayout ref={newRef => (ref = newRef)} />);
    wrapper.findNavigationToggle().click();
    expect(wrapper.findOpenNavigationPanel()).toBeTruthy();
    expect(wrapper.findNavigationClose().getElement()).toEqual(document.activeElement);
    act(() => ref!.closeNavigationIfNecessary());
    expect(wrapper.findOpenNavigationPanel()).toBeFalsy();
    expect(wrapper.findNavigationToggle().getElement()).toEqual(document.activeElement);
  });

  // not testable in refresh, because it is implemented with media query
  (theme === 'refresh' ? test.skip : test)('Does not allow sticky notification on small screen', () => {
    const { wrapper } = renderComponent(<AppLayout notifications="Test" stickyNotifications={true} />);
    expect(wrapper.find(stickyNotificationsClassName[theme])).toBeFalsy();
  });

  describe('unfocusable content', () => {
    const props = {
      content: 'Body content',
      contentHeader: 'Content header',
      notifications: 'Notifications',
      navigation: 'Navigation',
      tools: 'Help',
      breadcrumbs: 'Breadcrumbs',
      onNavigationChange: jest.fn(),
      onToolsChange: jest.fn(),
    };

    test('everything is focusable when drawsers are closed', () => {
      const { wrapper } = renderComponent(<AppLayout {...props} />);
      expect(wrapper.findByClassName(unfocusableClassName)).toBeFalsy();
    });

    test('content and toolbar is unfocusable when navigation is open', () => {
      const { wrapper, isUsingGridLayout } = renderComponent(<AppLayout {...props} navigationOpen={true} />);

      if (theme === 'refresh-toolbar') {
        expect(wrapper.findAllByClassName(unfocusableClassName)).toHaveLength(2);
        expect(wrapper.findByClassName(toolbarSkeletonStyles.tools)!.getElement()).toHaveClass(unfocusableClassName);
        expect(wrapper.findByClassName(toolbarSkeletonStyles['main-landmark'])!.getElement()).toHaveClass(
          unfocusableClassName
        );
        expect(wrapper.findByClassName(toolbarSkeletonStyles.navigation)!.getElement()).not.toHaveClass(
          unfocusableClassName
        );
      } else if (isUsingGridLayout) {
        // In refactored Visual Refresh we make tools-container unfocusable. This is needed
        // because of CSS animations the tools-container is not set to `display: none;` anymore.
        expect(isUnfocusable(wrapper.findTools().getElement())).toBe(true);
        expect(isUnfocusable(wrapper.findNavigation().getElement())).toBe(false);
        expect(wrapper.findAllByClassName(unfocusableClassName)).toHaveLength(5);
        expect(wrapper.findByClassName(testUtilsStyles['mobile-bar'])?.getElement()).toHaveClass(unfocusableClassName);
        expect(wrapper.findByClassName(testUtilsStyles.content)?.getElement()).toHaveClass(unfocusableClassName);
        expect(wrapper.findByClassName(visualRefreshRefactoredStyles['tools-container'])?.getElement()).toHaveClass(
          unfocusableClassName
        );
      } else {
        expect(wrapper.findAllByClassName(unfocusableClassName)).toHaveLength(2);
        expect(wrapper.findByClassName(mobileToolbarStyles['mobile-bar'])?.getElement()).toHaveClass(
          unfocusableClassName
        );
        expect(wrapper.findByClassName(styles['layout-main'])?.getElement()).toHaveClass(unfocusableClassName);
      }
    });

    test('content and toolbar is unfocusable when tools is open', () => {
      const { wrapper, isUsingGridLayout } = renderComponent(<AppLayout {...props} toolsOpen={true} />);

      if (theme === 'refresh-toolbar') {
        expect(wrapper.findAllByClassName(unfocusableClassName)).toHaveLength(2);
        expect(wrapper.findByClassName(toolbarSkeletonStyles.tools)!.getElement()).not.toHaveClass(
          unfocusableClassName
        );
        expect(wrapper.findByClassName(toolbarSkeletonStyles['main-landmark'])!.getElement()).toHaveClass(
          unfocusableClassName
        );
        expect(wrapper.findByClassName(toolbarSkeletonStyles.navigation)!.getElement()).toHaveClass(
          unfocusableClassName
        );
      } else if (isUsingGridLayout) {
        // In refactored Visual Refresh we make navigation-container unfocusable. This is needed
        // because of CSS animations the tools-container is not set to `display: none;` anymore.
        expect(isUnfocusable(wrapper.findTools().getElement())).toBe(false);
        expect(isUnfocusable(wrapper.findNavigation().getElement())).toBe(true);
        expect(wrapper.findAllByClassName(unfocusableClassName)).toHaveLength(5);
        expect(wrapper.findByClassName(testUtilsStyles['mobile-bar'])?.getElement()).toHaveClass(unfocusableClassName);
        expect(wrapper.findByClassName(testUtilsStyles.content)?.getElement()).toHaveClass(unfocusableClassName);
        expect(
          wrapper.findByClassName(visualRefreshRefactoredStyles['navigation-container'])?.getElement()
        ).toHaveClass(unfocusableClassName);
      } else {
        expect(wrapper.findAllByClassName(styles.unfocusable)).toHaveLength(2);
        expect(wrapper.findByClassName(mobileToolbarStyles['mobile-bar'])?.getElement()).toHaveClass(
          unfocusableClassName
        );
        expect(wrapper.findByClassName(styles['layout-main'])?.getElement()).toHaveClass(unfocusableClassName);
      }
    });

    test('content and toolbar is unfocusable when a drawer is open', () => {
      const { wrapper, isUsingGridLayout } = renderComponent(
        <AppLayout {...props} activeDrawerId={testDrawer.id} drawers={[testDrawer]} onDrawerChange={() => {}} />
      );

      if (theme === 'refresh-toolbar') {
        expect(wrapper.findAllByClassName(unfocusableClassName)).toHaveLength(2);
        expect(wrapper.findByClassName(toolbarSkeletonStyles.tools)!.getElement()).not.toHaveClass(
          unfocusableClassName
        );
        expect(wrapper.findByClassName(toolbarSkeletonStyles['main-landmark'])!.getElement()).toHaveClass(
          unfocusableClassName
        );
        expect(wrapper.findByClassName(toolbarSkeletonStyles.navigation)!.getElement()).toHaveClass(
          unfocusableClassName
        );
      } else if (isUsingGridLayout) {
        expect(wrapper.findAllByClassName(unfocusableClassName)).toHaveLength(6);
        expect(wrapper.findByClassName(testUtilsStyles['mobile-bar'])!.getElement()).toHaveClass(unfocusableClassName);
        expect(wrapper.findByClassName(testUtilsStyles.content)!.getElement()).toHaveClass(unfocusableClassName);
        expect(
          wrapper.findByClassName(visualRefreshRefactoredStyles['navigation-container'])!.getElement()
        ).toHaveClass(unfocusableClassName);
      } else {
        expect(wrapper.findAllByClassName(styles.unfocusable)).toHaveLength(2);
        expect(wrapper.findByClassName(mobileToolbarStyles['mobile-bar'])!.getElement()).toHaveClass(
          unfocusableClassName
        );
        expect(wrapper.findByClassName(styles['layout-main'])!.getElement()).toHaveClass(unfocusableClassName);
      }
    });

    test('when both navigation and tools rendered, the tools take precedence', () => {
      const { wrapper, isUsingGridLayout } = renderComponent(
        <AppLayout {...props} navigationOpen={true} toolsOpen={true} />
      );

      if (theme === 'refresh-toolbar') {
        expect(wrapper.findAllByClassName(unfocusableClassName)).toHaveLength(2);
        expect(wrapper.findByClassName(toolbarSkeletonStyles.tools)!.getElement()).not.toHaveClass(
          unfocusableClassName
        );
        expect(wrapper.findByClassName(toolbarSkeletonStyles['main-landmark'])!.getElement()).toHaveClass(
          unfocusableClassName
        );
        expect(wrapper.findByClassName(toolbarSkeletonStyles.navigation)!.getElement()).toHaveClass(
          unfocusableClassName
        );
      } else if (isUsingGridLayout) {
        expect(isUnfocusable(wrapper.findTools().getElement())).toBe(false);
        expect(isUnfocusable(wrapper.findNavigation().getElement())).toBe(true);
      } else {
        expect(wrapper.findAllByClassName(styles.unfocusable)).toHaveLength(2);
        expect(wrapper.findByClassName(mobileToolbarStyles['mobile-bar'])?.getElement()).toHaveClass(
          unfocusableClassName
        );
        expect(wrapper.findByClassName(styles['layout-main'])?.getElement()).toHaveClass(unfocusableClassName);
      }
    });

    test('navigation can open when tools in the open+hidden state', () => {
      const { wrapper, isUsingGridLayout } = renderComponent(
        <AppLayout {...props} navigationOpen={true} toolsOpen={true} toolsHide={true} />
      );
      if (theme === 'refresh-toolbar') {
        expect(wrapper.findAllByClassName(unfocusableClassName)).toHaveLength(2);
        expect(wrapper.findByClassName(toolbarSkeletonStyles.tools)!.getElement()).toHaveClass(unfocusableClassName);
        expect(wrapper.findByClassName(toolbarSkeletonStyles['main-landmark'])!.getElement()).toHaveClass(
          unfocusableClassName
        );
        expect(wrapper.findByClassName(toolbarSkeletonStyles.navigation)!.getElement()).not.toHaveClass(
          unfocusableClassName
        );
      } else if (isUsingGridLayout) {
        expect(isUnfocusable(wrapper.findNavigation().getElement())).toBe(false);
      } else {
        expect(wrapper.findAllByClassName(styles.unfocusable)).toHaveLength(2);
        expect(wrapper.findByClassName(mobileToolbarStyles['mobile-bar'])?.getElement()).toHaveClass(
          unfocusableClassName
        );
        expect(wrapper.findByClassName(styles['layout-main'])?.getElement()).toHaveClass(unfocusableClassName);
      }
    });

    test("ignores programatically opened navigation when it's hidden", () => {
      const { wrapper } = renderComponent(<AppLayout {...props} navigationOpen={true} navigationHide={true} />);
      expect(wrapper.findNavigation()).toBeFalsy();
      if (theme !== 'refresh-toolbar') {
        expect(wrapper.findByClassName(unfocusableClassName)).toBeFalsy();
      }
    });

    test("ignores programatically opened tools when it's hidden", () => {
      const { wrapper } = renderComponent(<AppLayout {...props} toolsOpen={true} toolsHide={true} />);
      expect(wrapper.findTools()).toBeFalsy();
      if (theme !== 'refresh-toolbar') {
        expect(wrapper.findByClassName(unfocusableClassName)).toBeFalsy();
      }
    });
  });

  test('should render an active drawer', () => {
    const { wrapper } = renderComponent(
      <AppLayout activeDrawerId={testDrawer.id} drawers={[testDrawer]} onDrawerChange={() => {}} />
    );

    expect(wrapper.findActiveDrawer()).toBeTruthy();
  });

  test('should render badge when defined', () => {
    const { wrapper } = renderComponent(<AppLayout drawers={manyDrawers} />);
    expect(wrapper.findDrawerTriggerById('security')!.getElement().children[0]).toHaveClass(triggerBadgeClassName);
  });

  test('renders roles only when aria labels are not provided', () => {
    const { wrapper } = renderComponent(<AppLayout drawers={[testDrawerWithoutLabels]} />);
    const drawersAside = within(findMobileToolbar(wrapper)!.getElement()).getByRole('region');

    expect(wrapper.findDrawerTriggerById('security')!.getElement()).not.toHaveAttribute('aria-label');
    expect(drawersAside).not.toHaveAttribute('aria-label');

    const drawersToolbar = findDrawersContainer(wrapper)!.getElement();
    expect(drawersToolbar).toHaveAttribute('role', 'toolbar');
  });

  test('renders roles and aria labels when provided', () => {
    const { wrapper } = renderComponent(<AppLayout drawers={[testDrawer]} ariaLabels={{ drawers: 'Drawers' }} />);
    const drawersAside = within(findMobileToolbar(wrapper)!.getElement()).getByRole('region');

    expect(wrapper.findDrawerTriggerById('security')!.getElement()).toHaveAttribute(
      'aria-label',
      'Security trigger button'
    );
    expect(drawersAside).toHaveAttribute('aria-label', 'Drawers');

    const drawersToolbar = findDrawersContainer(wrapper)!.getElement();
    expect(drawersToolbar).toHaveAttribute('role', 'toolbar');
  });
});
