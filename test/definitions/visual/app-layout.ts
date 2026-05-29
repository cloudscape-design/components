// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import createWrapper from '../../../lib/components/test-utils/selectors';
import { TestDefinition, TestSuite } from '../types';

const wrapper = createWrapper();

function responsiveTests(width: number): TestSuite {
  return {
    description: `width ${width}px`,
    componentName: 'app-layout',
    tests: [
      {
        description: 'default',
        path: 'app-layout/default',
        screenshotType: 'screenshotArea',
        configuration: { width },
      },
      {
        description: 'navigation drawer is open',
        path: 'app-layout/with-wizard',
        screenshotType: 'screenshotArea',
        configuration: { width },
        setup: async page => {
          await page.click('[aria-label="Open navigation"]');
        },
      },
      {
        description: 'wizard',
        path: 'app-layout/with-wizard',
        screenshotType: 'screenshotArea',
        configuration: { width },
      },
      {
        description: 'with wizard and table',
        path: 'app-layout/with-wizard-and-table',
        screenshotType: 'screenshotArea',
        configuration: { width },
      },
      {
        description: 'with wizard, table, and breadcrumbs',
        path: 'app-layout/with-wizard-and-table',
        screenshotType: 'screenshotArea',
        configuration: { width },
        queryParams: { hasBreadcrumbs: 'true' },
      },
      {
        description: 'notifications',
        path: 'app-layout/with-notifications',
        screenshotType: 'screenshotArea',
        configuration: { width },
      },
      {
        description: 'breadcrumbs',
        path: 'app-layout/with-breadcrumbs',
        screenshotType: 'screenshotArea',
        configuration: { width },
      },
      {
        description: 'notifications and breadcrumbs',
        path: 'app-layout/with-breadcrumbs-notifications',
        screenshotType: 'screenshotArea',
        configuration: { width },
      },
      {
        description: 'dashboard content type',
        path: 'app-layout/dashboard-content-type',
        screenshotType: 'screenshotArea',
        configuration: { width },
      },
      {
        description: 'fixed header and footer',
        path: 'app-layout/with-fixed-header-footer',
        screenshotType: 'screenshotArea',
        configuration: { width },
      },
      {
        description: 'disableBodyScroll - empty',
        path: 'app-layout/legacy-nav-empty',
        screenshotType: 'screenshotArea',
        configuration: { width },
      },
      {
        description: 'disableBodyScroll - with content',
        path: 'app-layout/legacy-nav-scrollable',
        screenshotType: 'screenshotArea',
        configuration: { width },
      },
      {
        description: 'disableBodyScroll - with split panel',
        path: 'app-layout/legacy-nav-scrollable-with-split-panel',
        screenshotType: 'screenshotArea',
        configuration: { width },
      },
      {
        description: 'disable paddings',
        path: 'app-layout/disable-paddings',
        screenshotType: 'screenshotArea',
        configuration: { width },
      },
      {
        description: 'disable paddings with breadcrumbs',
        path: 'app-layout/disable-paddings-breadcrumbs',
        screenshotType: 'screenshotArea',
        configuration: { width },
      },
      {
        description: 'sticky notifications',
        path: 'app-layout/with-sticky-notifications',
        screenshotType: 'screenshotArea',
        configuration: { width },
      },
      {
        description: 'sticky notifications scrolled down',
        path: 'app-layout/with-sticky-notifications',
        screenshotType: 'screenshotArea',
        configuration: { width },
        setup: async page => {
          await page.windowScrollTo({ top: 2000 });
        },
      },
      {
        description: 'layout without panels',
        path: 'app-layout/no-panels',
        screenshotType: 'screenshotArea',
        configuration: { width },
      },
      {
        description: 'layout without panels but with notifications',
        path: 'app-layout/no-panels-with-notifications',
        screenshotType: 'screenshotArea',
        configuration: { width },
      },
      {
        description: 'with drawers',
        path: 'app-layout/with-drawers',
        screenshotType: 'screenshotArea',
        configuration: { width },
      },
      {
        description: 'with empty drawers',
        path: 'app-layout/with-drawers-empty',
        screenshotType: 'screenshotArea',
        configuration: { width },
      },
      {
        description: 'with open drawer',
        path: 'app-layout/with-drawers',
        screenshotType: 'screenshotArea',
        configuration: { width },
        setup: async page => {
          await page.click('[aria-label="Security trigger button"]');
        },
      },
    ],
  };
}

const suite: TestSuite = {
  description: 'AppLayout',
  componentName: 'app-layout',
  tests: [
    // ── Responsive tests at multiple breakpoints ──────────────────────────
    responsiveTests(600),
    responsiveTests(1280),
    responsiveTests(1400),
    responsiveTests(1920),
    responsiveTests(2540),

    // ── General tests ─────────────────────────────────────────────────────
    {
      description: 'no scrollbars at 320px',
      path: 'app-layout/default',
      screenshotType: 'screenshotArea',
      configuration: { width: 320 },
    },
    {
      description: 'drawer buttons alignment',
      path: 'app-layout/default',
      screenshotType: 'screenshotArea',
      configuration: { width: 800 },
      setup: async page => {
        await page.click('[aria-label="Open tools"]');
      },
    },
    {
      description: 'disable paddings - navigation closed',
      path: 'app-layout/disable-paddings',
      screenshotType: 'screenshotArea',
      configuration: { width: 1280 },
      setup: async page => {
        await page.click('[aria-label="Close navigation"]');
      },
    },
    {
      description: 'panels stacking on mobile',
      path: 'app-layout/all-panels-open',
      screenshotType: 'screenshotArea',
      configuration: { width: 600 },
    },
    {
      description: 'wrapping long words',
      path: 'app-layout/text-wrap',
      screenshotType: 'screenshotArea',
    },
    {
      description: 'fill content area',
      path: 'app-layout/fill-content-area',
      screenshotType: 'screenshotArea',
    },
    {
      description: 'with tools and drawers',
      path: 'app-layout/with-drawers',
      screenshotType: 'screenshotArea',
      queryParams: { hasTools: 'true' },
    },
    {
      description: 'with open drawer and open side split panel',
      path: 'app-layout/with-drawers',
      screenshotType: 'screenshotArea',
      configuration: { width: 1400 },
      queryParams: { splitPanelPosition: 'side' },
      setup: async page => {
        await page.click('[aria-label="Security trigger button"]');
        await page.click('[aria-label="Open panel"]');
      },
    },

    // ── Content paddings ──────────────────────────────────────────────────
    {
      description: 'Content paddings',
      tests: [
        ...(['true', 'false'] as const).flatMap(toolsEnabled =>
          (['true', 'false'] as const).flatMap(splitPanelEnabled =>
            (['bottom', 'side'] as const).map(splitPanelPosition => ({
              description: `toolsEnabled=${toolsEnabled} splitPanelEnabled=${splitPanelEnabled} splitPanelPosition=${splitPanelPosition}`,
              path: 'app-layout/with-split-panel',
              screenshotType: 'screenshotArea' as const,
              queryParams: { toolsEnabled, splitPanelEnabled, splitPanelPosition },
            }))
          )
        ),
        ...[1500, 600].map(width => ({
          description: `with split panel and disabled content paddings - width=${width}`,
          path: 'app-layout/disable-paddings-with-split-panel',
          screenshotType: 'screenshotArea' as const,
          configuration: { width },
          queryParams: { splitPanelOpen: 'true', splitPanelPosition: 'side' },
        })),
      ],
    },

    // ── Drawers ───────────────────────────────────────────────────────────
    {
      description: 'Drawers',
      tests: [
        {
          description: 'with split panel',
          path: 'app-layout/with-drawers',
          screenshotType: 'screenshotArea',
          setup: async page => {
            await page.click(wrapper.findAppLayout().findDrawerTriggerById('pro-help').toSelector());
          },
        },
        {
          description: 'with tooltip on hover',
          path: 'app-layout/with-drawers',
          screenshotType: 'screenshotArea',
          setup: async page => {
            await page.hoverElement(wrapper.findAppLayout().findDrawerTriggerById('pro-help').toSelector());
          },
        },
        {
          description: 'with custom scrollable drawer content',
          path: 'app-layout/with-drawers-scrollable',
          screenshotType: 'screenshotArea',
          queryParams: { sideNavFill: 'false' },
          setup: async page => {
            await page.click(wrapper.findAppLayout().findDrawerTriggerById('chat').toSelector());
          },
        },
      ],
    },

    // ── Headers ───────────────────────────────────────────────────────────
    {
      description: 'Headers',
      tests: [600, 1280].flatMap(width => [
        {
          description: `alignment with full-page table (${width}px)`,
          path: 'app-layout/with-table',
          screenshotType: 'screenshotArea' as const,
          configuration: { width },
        },
        {
          description: `alignment with full-page table in sticky state (${width}px)`,
          path: 'app-layout/with-table',
          screenshotType: 'screenshotArea' as const,
          configuration: { width },
          setup: async page => {
            await page.windowScrollTo({ top: 200 });
          },
        },
        {
          description: `alignment with full-page table in sticky state with sticky notifications (${width}px)`,
          path: 'app-layout/with-table',
          screenshotType: 'screenshotArea' as const,
          configuration: { width },
          queryParams: { stickyNotifications: 'true' },
          setup: async page => {
            await page.windowScrollTo({ top: 200 });
          },
        },
        {
          description: `high contrast header variant in landing page (${width}px)`,
          path: 'app-layout/landing-page',
          screenshotType: 'screenshotArea' as const,
          configuration: { width },
        },
      ]),
    },

    // ── High contrast header variant ──────────────────────────────────────
    {
      description: 'High contrast header variant',
      tests: [
        ...[1400, 600].flatMap(width => [
          {
            description: `with breadcrumbs and notifications at ${width}px`,
            path: 'app-layout/high-contrast-header-variant',
            screenshotType: 'screenshotArea' as const,
            configuration: { width },
            queryParams: { hasBreadcrumbs: 'true', hasNotifications: 'true', hasContainer: 'true' },
          },
          {
            description: `without overlap at ${width}px`,
            path: 'app-layout/high-contrast-header-variant',
            screenshotType: 'screenshotArea' as const,
            configuration: { width },
            queryParams: { disableOverlap: 'true' },
          },
          {
            description: `with content layout at ${width}px`,
            path: 'app-layout/high-contrast-header-variant',
            screenshotType: 'screenshotArea' as const,
            configuration: { width },
            queryParams: {
              hasBreadcrumbs: 'true',
              hasNotifications: 'true',
              hasContainer: 'true',
              hasContentLayout: 'true',
            },
          },
        ]),
      ],
    },

    // ── Multiple instances ─────────────────────────────────────────────────
    {
      description: 'Multiple instances',
      tests: [600, 1280].flatMap(width => [
        {
          description: `simple (${width}px)`,
          path: 'app-layout/multi-layout-simple',
          screenshotType: 'screenshotArea' as const,
          configuration: { width },
        },
        {
          description: `iframe (${width}px)`,
          path: 'app-layout/multi-layout-iframe',
          screenshotType: 'screenshotArea' as const,
          configuration: { width },
        },
      ]),
    },

    // ── Z-index (absolute components) ─────────────────────────────────────
    {
      description: 'Z-index',
      tests: [
        ...[600, 1280].flatMap(width => [
          {
            description: `button dropdown (${width}px)`,
            path: 'app-layout/with-absolute-components',
            screenshotType: 'screenshotArea' as const,
            configuration: { width },
            setup: async page => {
              await page.click('button=Button dropdown');
              await page.click('[data-testid="2"]');
              await page.windowScrollTo({ top: 300 });
            },
          } as TestDefinition,
          {
            description: `select (${width}px)`,
            path: 'app-layout/with-absolute-components',
            screenshotType: 'screenshotArea' as const,
            configuration: { width, height: 800 },
            setup: async page => {
              await page.click('[data-testid="select-demo"] button');
              await page.windowScrollTo({ top: 300 });
            },
          } as TestDefinition,
          {
            description: `split-panel and full-page table (${width}px)`,
            path: 'app-layout/with-full-page-table-and-split-panel',
            screenshotType: 'screenshotArea' as const,
            configuration: { width },
          },
        ]),
        {
          description: 'split-panel and full-page with open navigation (600px)',
          path: 'app-layout/with-full-page-table-and-split-panel',
          screenshotType: 'screenshotArea' as const,
          configuration: { width: 600 },
          setup: async page => {
            await page.click('button[aria-label="Open navigation"]');
          },
        },
        {
          description: 'split-panel and full-page with open tools (600px)',
          path: 'app-layout/with-full-page-table-and-split-panel',
          screenshotType: 'screenshotArea' as const,
          configuration: { width: 600 },
          setup: async page => {
            await page.click('button[aria-label="Open tools"]');
          },
        },
      ],
    },

    // ── Toolbar ───────────────────────────────────────────────────────────
    {
      description: 'Toolbar',
      tests: [
        {
          description: 'multiple nested instances (no breadcrumbs dedup)',
          path: 'app-layout-toolbar/multi-layout-with-hidden-instances',
          screenshotType: 'screenshotArea',
        },
        {
          description: 'no toolbar',
          path: 'app-layout-toolbar/without-toolbar',
          screenshotType: 'screenshotArea',
        },
      ],
    },

    // ── Max content width ─────────────────────────────────────────────────
    {
      description: 'Max content width',
      tests: [
        {
          description: 'maxContentWidth set to Number.MAX_VALUE',
          path: 'app-layout/refresh-content-width',
          screenshotType: 'screenshotArea',
          configuration: { width: 1280, height: 700 },
          setup: async page => {
            await page.click('[data-test-id="button_width-number-max_value"]');
          },
        },
      ],
    },

    // ── Sticky table header with split panel ──────────────────────────────
    {
      description: 'Sticky header with split panel',
      tests: [
        {
          description: 'scrolling to bottom with closed split panel (1 table row)',
          path: 'app-layout/with-sticky-table-and-split-panel',
          screenshotType: 'screenshotArea',
          configuration: { width: 1280, height: 900 },
          setup: async page => {
            await page.click('[data-testid="set-item-count-to-1"]');
            await page.scrollToBottom('html');
          },
        },
        {
          description: 'scrolling to bottom with closed split panel (30 table rows)',
          path: 'app-layout/with-sticky-table-and-split-panel',
          screenshotType: 'screenshotArea',
          configuration: { width: 1280, height: 900 },
          setup: async page => {
            await page.click('[data-testid="set-item-count-to-30"]');
            await page.scrollToBottom('html');
          },
        },
        {
          description: 'header stays sticky with open split panel (1 table row)',
          path: 'app-layout/with-sticky-table-and-split-panel',
          screenshotType: 'screenshotArea',
          configuration: { width: 1280, height: 900 },
          setup: async page => {
            await page.click('[data-testid="set-item-count-to-1"]');
            await page.click('aria/Open panel');
            await page.scrollToBottom('html');
          },
        },
        {
          description: 'header stays sticky with open split panel (30 table rows)',
          path: 'app-layout/with-sticky-table-and-split-panel',
          screenshotType: 'screenshotArea',
          configuration: { width: 1280, height: 900 },
          setup: async page => {
            await page.click('[data-testid="set-item-count-to-30"]');
            await page.click('aria/Open panel');
            await page.scrollToBottom('html');
          },
        },
        {
          description: 'header stays sticky when mounting and unmounting a second table',
          path: 'app-layout/with-sticky-table-and-split-panel',
          screenshotType: 'screenshotArea',
          configuration: { width: 1280, height: 900 },
          setup: async page => {
            await page.click('[data-testid="set-item-count-to-30"]');
            await page.click('aria/Open panel');
            await page.windowScrollTo({ top: 0 });
            await page.click('aria/Close panel');
            await page.scrollToBottom('html');
          },
        },
      ],
    },

    // ── Flashbar ──────────────────────────────────────────────────────────
    {
      description: 'Flashbar',
      tests: [true, false].flatMap(disableContentPaddings =>
        [true, false].flatMap(stickyNotifications =>
          [true, false].flatMap(stickyTableHeader =>
            [true, false].map(stackNotifications => ({
              description: `disableContentPaddings: ${disableContentPaddings}, stickyNotifications: ${stickyNotifications}, stickyTableHeader: ${stickyTableHeader}, stackNotifications: ${stackNotifications}`,
              path: 'app-layout/with-stacked-notifications-and-table',
              screenshotType: 'screenshotArea' as const,
              configuration: { width: 1280, height: 900 },
              setup: async (
                page: import('@cloudscape-design/browser-test-tools/page-objects').ScreenshotPageObject
              ) => {
                if (!disableContentPaddings) {
                  await page.click('[data-id="toggle-content-paddings"]');
                }
                if (stickyNotifications) {
                  await page.click('[data-id="toggle-sticky-notifications"]');
                }
                if (!stickyTableHeader) {
                  await page.click('[data-id="toggle-sticky-table-header"]');
                }
                if (!stackNotifications) {
                  await page.click('[data-id="toggle-stack-items"]');
                }
                await page.click('[data-id="add-notification"]');
                await page.click('[data-id="add-notification"]');
              },
            }))
          )
        )
      ),
    },

    // ── Transitions ───────────────────────────────────────────────────────
    {
      description: 'Transitions',
      tests: [
        {
          description: 'transition from 400px to 1800px',
          path: 'app-layout/default',
          screenshotType: 'screenshotArea',
          configuration: { width: 400, height: 400 },
          setup: async page => {
            await page.setWindowSize({ width: 1800, height: 400 });
          },
        },
        {
          description: 'transition from 1800px to 400px',
          path: 'app-layout/default',
          screenshotType: 'screenshotArea',
          configuration: { width: 1800, height: 400 },
          setup: async page => {
            await page.setWindowSize({ width: 400, height: 400 });
          },
        },
      ],
    },
  ],
};

export default suite;
