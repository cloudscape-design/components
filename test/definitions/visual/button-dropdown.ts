// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TestDefinition, TestSuite } from '../types';

const suite: TestSuite = {
  description: 'ButtonDropdown',
  componentName: 'button-dropdown',
  tests: [
    // ── Positioning ───────────────────────────────────────────────────────
    ...[500, 800].flatMap<TestDefinition>(width =>
      ['.bd-top-left', '.bd-top-right', '.bd-bottom-left', '.bd-bottom-right'].map(selector => ({
        description: `opening ${selector.replace('.bd-', '')} at ${width}`,
        path: 'button-dropdown/scenarios-positioning',
        screenshotType: 'viewport' as const,
        configuration: { width },
        setup: async ({ page }) => {
          await page.click(selector);
        },
      }))
    ),
    {
      description: 'opening top left, width maximum truncated',
      path: 'button-dropdown/scenarios-positioning',
      screenshotType: 'viewport',
      configuration: { width: 230, height: 400 },
      setup: async ({ page }) => {
        await page.click('.bd-top-left');
      },
    },
    {
      description: 'opening bottom left, width maximum truncated',
      path: 'button-dropdown/scenarios-positioning',
      screenshotType: 'viewport',
      configuration: { width: 230, height: 400 },
      setup: async ({ page }) => {
        await page.click('.bd-bottom-left');
      },
    },
    // ── Expandable groups ─────────────────────────────────────────────────
    ...[500, 1200].flatMap<TestDefinition>(width =>
      ['.bd-top-left', '.bd-top-right', '.bd-bottom-left', '.bd-bottom-right'].map(selector => ({
        description: `with expandable groups opening ${selector.replace('.bd-', '')} at ${width}`,
        path: 'button-dropdown/scenarios-expandable',
        screenshotType: 'viewport' as const,
        configuration: { width },
        setup: async ({ page }) => {
          await page.click(selector);
          await page.click('[data-testid="category1"]');
        },
      }))
    ),
    // ── Scrollable / overflow containers ──────────────────────────────────
    {
      description: 'in scrollable container',
      path: 'button-dropdown/scenarios-container',
      screenshotType: 'viewport',
      configuration: { width: 600 },
      setup: async ({ page }) => {
        await page.waitForVisible('#scrollable-container');
        const containerBBox = await page.getBoundingBox('#scrollable-container');
        const buttonBBox = await page.getBoundingBox('#ButtonDropdown button');
        await page.elementScrollTo('#scrollable-container', {
          top: (containerBBox.height + buttonBBox.width) / 2,
          left: (containerBBox.width + buttonBBox.width) / 2,
        });
        await page.click('#ButtonDropdown');
      },
    },
    {
      description: 'with expandToViewport overflowing a scroll container',
      path: 'button-dropdown/scenarios-overflow-container',
      screenshotType: 'viewport',
      configuration: { width: 1000 },
      setup: async ({ page }) => {
        await page.waitForVisible('#scroll-container');
        const containerBBox = await page.getBoundingBox('#scroll-container');
        const buttonBBox = await page.getBoundingBox('#button-dropdown-scroll button');
        await page.elementScrollTo('#scroll-container', {
          top: (containerBBox.height + buttonBBox.width) / 2,
          left: (containerBBox.width + buttonBBox.width) / 2,
        });
        await page.click('#button-dropdown-scroll');
        await page.click('[data-testid="category1"]');
      },
    },
    {
      description: 'with expandToViewport overflowing a hidden container',
      path: 'button-dropdown/scenarios-overflow-container',
      screenshotType: 'viewport',
      configuration: { width: 1000 },
      setup: async ({ page }) => {
        await page.waitForVisible('#hidden-container');
        await page.click('#button-dropdown-hidden');
        await page.click('[data-testid="category1"]');
      },
    },
    {
      description: 'with expandToViewport overflowing an auto container',
      path: 'button-dropdown/scenarios-overflow-container',
      screenshotType: 'viewport',
      configuration: { width: 1000 },
      setup: async ({ page }) => {
        await page.waitForVisible('#auto-container');
        const containerBBox = await page.getBoundingBox('#auto-container');
        const buttonBBox = await page.getBoundingBox('#button-dropdown-auto button');
        await page.elementScrollTo('#auto-container', {
          top: (containerBBox.height + buttonBBox.width) / 2,
          left: (containerBBox.width + buttonBBox.width) / 2,
        });
        await page.click('#button-dropdown-auto');
        await page.click('[data-testid="category1"]');
      },
    },
    // ── Permutations ──────────────────────────────────────────────────────
    {
      description: 'permutations',
      path: 'button-dropdown/permutations',
      screenshotType: 'permutations',
    },
    {
      description: 'item element permutations',
      path: 'button-dropdown/item-element.permutations',
      screenshotType: 'permutations',
    },
    {
      description: 'main action permutations',
      path: 'button-dropdown/permutations-main-action',
      screenshotType: 'permutations',
    },
    // ── Dimmed category group ─────────────────────────────────────────────
    ...[500, 800].map<TestDefinition>(width => ({
      description: `dimmed category group at width ${width}`,
      path: 'button-dropdown/simple',
      screenshotType: 'screenshotArea' as const,
      configuration: { width },
      setup: async ({ page }) => {
        await page.click('#ButtonDropdown8');
        await page.keys(['ArrowDown', 'ArrowDown', 'Enter']);
      },
    })),
    // ── Disabled reason ───────────────────────────────────────────────────
    ...[500, 800].flatMap<TestDefinition>(width => [
      {
        description: `with disabled reason at width ${width}`,
        path: 'button-dropdown/disabled-reason',
        screenshotType: 'screenshotArea' as const,
        configuration: { width },
        setup: async ({ page }) => {
          await page.click('[data-testid="buttonDropdown"]');
          await page.keys(['ArrowDown', 'ArrowDown', 'ArrowDown']);
        },
      },
      {
        description: `with disabled reason for selectable item at width ${width}`,
        path: 'button-dropdown/disabled-reason',
        screenshotType: 'screenshotArea' as const,
        configuration: { width },
        setup: async ({ page }) => {
          await page.click('[data-testid="buttonDropdownSelectableItems"]');
        },
      },
    ]),
    // ── Icons in groups ───────────────────────────────────────────────────
    ...[500, 800].flatMap<TestDefinition>(width =>
      [true, false].map(expandableGroups => ({
        description: `${expandableGroups ? 'expandable' : 'non-expandable'} groups show icons at width ${width}`,
        path: 'button-dropdown/icon-expandable',
        screenshotType: 'screenshotArea' as const,
        configuration: { width },
        queryParams: { expandableGroups: String(expandableGroups) },
        setup: async ({ page, wrapper }) => {
          await page.click(wrapper.findButtonDropdown().toSelector());
          if (expandableGroups) {
            await page.click('[data-testid="category1"]');
          }
        },
      }))
    ),
    // ── Custom renderItem ─────────────────────────────────────────────────
    ...[500, 1000].flatMap<TestDefinition>(width =>
      [true, false].map(expandableGroups => ({
        description: `${expandableGroups ? 'expandable' : 'non-expandable'} groups with custom renderItem width ${width}`,
        path: 'button-dropdown/custom-render-item',
        screenshotType: 'screenshotArea' as const,
        configuration: { width },
        queryParams: { expandableGroups: String(expandableGroups) },
        pixelDiffTolerance: 10,
        setup: async ({ page, wrapper }) => {
          await page.click(wrapper.findButtonDropdown().toSelector());
          if (expandableGroups) {
            await page.click('[data-testid="group"]');
          }
        },
      }))
    ),
  ],
};

export default suite;
