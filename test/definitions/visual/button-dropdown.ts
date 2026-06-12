// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'ButtonDropdown',
  componentName: 'button-dropdown',
  tests: [
    {
      description: 'ButtonDropdown opening top left at 500',
      path: 'button-dropdown/scenarios-positioning',
      screenshotType: 'viewport',
      configuration: { width: 500 },
      setup: async page => {
        await page.click('.bd-top-left');
      },
    },
    {
      description: 'ButtonDropdown opening top right at 500',
      path: 'button-dropdown/scenarios-positioning',
      screenshotType: 'viewport',
      configuration: { width: 500 },
      setup: async page => {
        await page.click('.bd-top-right');
      },
    },
    {
      description: 'ButtonDropdown opening bottom left at 500',
      path: 'button-dropdown/scenarios-positioning',
      screenshotType: 'viewport',
      configuration: { width: 500 },
      setup: async page => {
        await page.click('.bd-bottom-left');
      },
    },
    {
      description: 'ButtonDropdown opening bottom right at 500',
      path: 'button-dropdown/scenarios-positioning',
      screenshotType: 'viewport',
      configuration: { width: 500 },
      setup: async page => {
        await page.click('.bd-bottom-right');
      },
    },
    {
      description: 'ButtonDropdown opening top left at 800',
      path: 'button-dropdown/scenarios-positioning',
      screenshotType: 'viewport',
      configuration: { width: 800 },
      setup: async page => {
        await page.click('.bd-top-left');
      },
    },
    {
      description: 'ButtonDropdown opening top right at 800',
      path: 'button-dropdown/scenarios-positioning',
      screenshotType: 'viewport',
      configuration: { width: 800 },
      setup: async page => {
        await page.click('.bd-top-right');
      },
    },
    {
      description: 'ButtonDropdown opening bottom left at 800',
      path: 'button-dropdown/scenarios-positioning',
      screenshotType: 'viewport',
      configuration: { width: 800 },
      setup: async page => {
        await page.click('.bd-bottom-left');
      },
    },
    {
      description: 'ButtonDropdown opening bottom right at 800',
      path: 'button-dropdown/scenarios-positioning',
      screenshotType: 'viewport',
      configuration: { width: 800 },
      setup: async page => {
        await page.click('.bd-bottom-right');
      },
    },
    {
      description: 'ButtonDropdown opening top left, width maximum truncated',
      path: 'button-dropdown/scenarios-positioning',
      screenshotType: 'viewport',
      configuration: { width: 230, height: 400 },
      setup: async page => {
        await page.click('.bd-top-left');
      },
    },
    {
      description: 'ButtonDropdown opening bottom left, width maximum truncated',
      path: 'button-dropdown/scenarios-positioning',
      screenshotType: 'viewport',
      configuration: { width: 230, height: 400 },
      setup: async page => {
        await page.click('.bd-bottom-left');
      },
    },
    {
      description: 'ButtonDropdown with expandable groups opening top left at 500',
      path: 'button-dropdown/scenarios-expandable',
      screenshotType: 'viewport',
      configuration: { width: 500 },
      setup: async page => {
        await page.click('.bd-top-left');
        await page.click('[data-testid="category1"]');
      },
    },
    {
      description: 'ButtonDropdown with expandable groups opening top right at 500',
      path: 'button-dropdown/scenarios-expandable',
      screenshotType: 'viewport',
      configuration: { width: 500 },
      setup: async page => {
        await page.click('.bd-top-right');
        await page.click('[data-testid="category1"]');
      },
    },
    {
      description: 'ButtonDropdown with expandable groups opening bottom left at 500',
      path: 'button-dropdown/scenarios-expandable',
      screenshotType: 'viewport',
      configuration: { width: 500 },
      setup: async page => {
        await page.click('.bd-bottom-left');
        await page.click('[data-testid="category1"]');
      },
    },
    {
      description: 'ButtonDropdown with expandable groups opening bottom right at 500',
      path: 'button-dropdown/scenarios-expandable',
      screenshotType: 'viewport',
      configuration: { width: 500 },
      setup: async page => {
        await page.click('.bd-bottom-right');
        await page.click('[data-testid="category1"]');
      },
    },
    {
      description: 'ButtonDropdown with expandable groups opening top left at 1200',
      path: 'button-dropdown/scenarios-expandable',
      screenshotType: 'viewport',
      configuration: { width: 1200 },
      setup: async page => {
        await page.click('.bd-top-left');
        await page.click('[data-testid="category1"]');
      },
    },
    {
      description: 'ButtonDropdown with expandable groups opening top right at 1200',
      path: 'button-dropdown/scenarios-expandable',
      screenshotType: 'viewport',
      configuration: { width: 1200 },
      setup: async page => {
        await page.click('.bd-top-right');
        await page.click('[data-testid="category1"]');
      },
    },
    {
      description: 'ButtonDropdown with expandable groups opening bottom left at 1200',
      path: 'button-dropdown/scenarios-expandable',
      screenshotType: 'viewport',
      configuration: { width: 1200 },
      setup: async page => {
        await page.click('.bd-bottom-left');
        await page.click('[data-testid="category1"]');
      },
    },
    {
      description: 'ButtonDropdown with expandable groups opening bottom right at 1200',
      path: 'button-dropdown/scenarios-expandable',
      screenshotType: 'viewport',
      configuration: { width: 1200 },
      setup: async page => {
        await page.click('.bd-bottom-right');
        await page.click('[data-testid="category1"]');
      },
    },
    {
      description: 'ButtonDropdown in scrollable container',
      path: 'button-dropdown/scenarios-container',
      screenshotType: 'viewport',
      configuration: { width: 600 },
      setup: async page => {
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
      description: 'ButtonDropdown with expandToViewport overflowing a scroll container',
      path: 'button-dropdown/scenarios-overflow-container',
      screenshotType: 'viewport',
      configuration: { width: 1000 },
      setup: async page => {
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
      description: 'ButtonDropdown with expandToViewport overflowing a hidden container',
      path: 'button-dropdown/scenarios-overflow-container',
      screenshotType: 'viewport',
      configuration: { width: 1000 },
      setup: async page => {
        await page.waitForVisible('#hidden-container');
        await page.click('#button-dropdown-hidden');
        await page.click('[data-testid="category1"]');
      },
    },
    {
      description: 'ButtonDropdown with expandToViewport overflowing an auto container',
      path: 'button-dropdown/scenarios-overflow-container',
      screenshotType: 'viewport',
      configuration: { width: 1000 },
      setup: async page => {
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
    {
      description: 'ButtonDropdown permutations',
      path: 'button-dropdown/permutations',
      screenshotType: 'permutations',
    },
    {
      description: 'ButtonDropdown item element permutations',
      path: 'button-dropdown/item-element.permutations',
      screenshotType: 'permutations',
    },
    {
      description: 'ButtonDropdown main action permutations',
      path: 'button-dropdown/permutations-main-action',
      screenshotType: 'permutations',
    },
    {
      description: 'ButtonDropdown dimmed category group at width 500',
      path: 'button-dropdown/simple',
      screenshotType: 'screenshotArea',
      setup: async page => {
        await page.click('#ButtonDropdown8');
        await page.keys(['ArrowDown', 'ArrowDown', 'Enter']);
      },
    },
    {
      description: 'ButtonDropdown dimmed category group at width 800',
      path: 'button-dropdown/simple',
      screenshotType: 'screenshotArea',
      setup: async page => {
        await page.click('#ButtonDropdown8');
        await page.keys(['ArrowDown', 'ArrowDown', 'Enter']);
      },
    },
    {
      description: 'ButtonDropdown with disabled reason at width 500',
      path: 'button-dropdown/disabled-reason',
      screenshotType: 'screenshotArea',
      setup: async page => {
        await page.click('[data-testid="buttonDropdown"]');
        await page.keys(['ArrowDown', 'ArrowDown', 'ArrowDown']);
      },
    },
    {
      description: 'ButtonDropdown with disabled reason at width 800',
      path: 'button-dropdown/disabled-reason',
      screenshotType: 'screenshotArea',
      setup: async page => {
        await page.click('[data-testid="buttonDropdown"]');
        await page.keys(['ArrowDown', 'ArrowDown', 'ArrowDown']);
      },
    },
    {
      description: 'ButtonDropdown with disabled reason for selectable item at width 500',
      path: 'button-dropdown/disabled-reason',
      screenshotType: 'screenshotArea',
      setup: async page => {
        await page.click('[data-testid="buttonDropdownSelectableItems"]');
      },
    },
    {
      description: 'ButtonDropdown with disabled reason for selectable item at width 800',
      path: 'button-dropdown/disabled-reason',
      screenshotType: 'screenshotArea',
      setup: async page => {
        await page.click('[data-testid="buttonDropdownSelectableItems"]');
      },
    },
    {
      description: 'ButtonDropdown expandable groups show icons at width 500',
      path: 'button-dropdown/icon-expandable',
      screenshotType: 'screenshotArea',
      configuration: { width: 500 },
      queryParams: { expandableGroups: 'true' },
      setup: async (page, wrapper) => {
        await page.click(wrapper.findButtonDropdown().toSelector());
        await page.click('[data-testid="category1"]');
      },
    },
    {
      description: 'ButtonDropdown non-expandable groups show icons at width 500',
      path: 'button-dropdown/icon-expandable',
      screenshotType: 'screenshotArea',
      configuration: { width: 500 },
      queryParams: { expandableGroups: 'false' },
      setup: async (page, wrapper) => {
        await page.click(wrapper.findButtonDropdown().toSelector());
      },
    },
    {
      description: 'ButtonDropdown expandable groups show icons at width 800',
      path: 'button-dropdown/icon-expandable',
      screenshotType: 'screenshotArea',
      configuration: { width: 800 },
      queryParams: { expandableGroups: 'true' },
      setup: async (page, wrapper) => {
        await page.click(wrapper.findButtonDropdown().toSelector());
        await page.click('[data-testid="category1"]');
      },
    },
    {
      description: 'ButtonDropdown non-expandable groups show icons at width 800',
      path: 'button-dropdown/icon-expandable',
      screenshotType: 'screenshotArea',
      configuration: { width: 800 },
      queryParams: { expandableGroups: 'false' },
      setup: async (page, wrapper) => {
        await page.click(wrapper.findButtonDropdown().toSelector());
      },
    },
    {
      description: 'ButtonDropdown expandable groups with custom renderItem width 500',
      path: 'button-dropdown/custom-render-item',
      screenshotType: 'screenshotArea',
      configuration: { width: 500 },
      queryParams: { expandableGroups: 'true' },
      setup: async (page, wrapper) => {
        await page.click(wrapper.findButtonDropdown().toSelector());
        await page.click('[data-testid="group"]');
      },
    },
    {
      description: 'ButtonDropdown non-expandable groups with custom renderItem width 500',
      path: 'button-dropdown/custom-render-item',
      screenshotType: 'screenshotArea',
      configuration: { width: 500 },
      queryParams: { expandableGroups: 'false' },
      setup: async (page, wrapper) => {
        await page.click(wrapper.findButtonDropdown().toSelector());
      },
    },
    {
      description: 'ButtonDropdown expandable groups with custom renderItem width 1000',
      path: 'button-dropdown/custom-render-item',
      screenshotType: 'screenshotArea',
      configuration: { width: 1000 },
      queryParams: { expandableGroups: 'true' },
      setup: async (page, wrapper) => {
        await page.click(wrapper.findButtonDropdown().toSelector());
        await page.click('[data-testid="group"]');
      },
    },
    {
      description: 'ButtonDropdown non-expandable groups with custom renderItem width 1000',
      path: 'button-dropdown/custom-render-item',
      screenshotType: 'screenshotArea',
      configuration: { width: 1000 },
      queryParams: { expandableGroups: 'false' },
      setup: async (page, wrapper) => {
        await page.click(wrapper.findButtonDropdown().toSelector());
      },
    },
  ],
};

export default suite;
