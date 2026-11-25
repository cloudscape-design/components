// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TestDefinition, TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Table atomic components',
  componentName: 'table-root',
  tests: [
    {
      description: 'Rows',
      tests: [
        { description: 'simple', path: 'table-root/simple', screenshotType: 'screenshotArea' },
        {
          description: 'shaded rows',
          path: 'table-root/simple',
          screenshotType: 'screenshotArea',
          queryParams: { stripedRows: 'true' },
        },
      ],
    },
    {
      description: 'Column layout',
      tests: [
        {
          description: 'fixed, flexible and minimum width columns',
          path: 'table-root/column-sizing',
          screenshotType: 'screenshotArea',
          configuration: { width: 1200 },
        },
        ...(['grid', 'auto'] as const).map<TestDefinition>(layout => ({
          description: `full-width cells in ${layout} layout`,
          path: 'table-root/col-span',
          screenshotType: 'screenshotArea',
          queryParams: { layout, selectable: 'true', stripedRows: 'true' },
        })),
      ],
    },
    {
      description: 'Loading and empty states',
      tests: (['loading', 'empty'] as const).map<TestDefinition>(dataState => ({
        description: dataState,
        path: 'table-root/loading-and-empty',
        screenshotType: 'screenshotArea',
        queryParams: { dataState },
      })),
    },
    {
      description: 'Selection',
      tests: [
        ...(['multi', 'single'] as const).map<TestDefinition>(selectionMode => ({
          description: `${selectionMode} selection`,
          path: 'table-root/selection',
          screenshotType: 'screenshotArea',
          queryParams: { selectionMode },
        })),
        {
          description: 'selected rows with filled, underfilled and overflowing columns',
          path: 'table-root/selection-edge-cases',
          screenshotType: 'screenshotArea',
          configuration: { width: 1200 },
        },
      ],
    },
    {
      description: 'Sorting',
      tests: [
        { description: 'sortable and sorted columns', path: 'table-root/sorting', screenshotType: 'screenshotArea' },
        {
          description: 'keyboard focus on a sort button',
          path: 'table-root/sorting',
          screenshotType: 'screenshotArea',
          setup: async ({ page }) => {
            await page.click('h2');
            await page.keys(['Tab']);
          },
        },
      ],
    },
    {
      description: 'Sticky header',
      tests: (['grid', 'auto'] as const).map<TestDefinition>(layout => ({
        description: `mid-scroll in ${layout} layout`,
        path: 'table-root/sticky-header',
        screenshotType: 'viewport',
        queryParams: { layout },
        setup: async ({ page }) => {
          await page.windowScrollTo({ top: 600 });
        },
      })),
    },
    {
      description: 'sticky scrollbar on an overflowing table',
      path: 'table-root/sticky-scrollbar',
      screenshotType: 'screenshotArea',
      configuration: { width: 600, height: 800 },
    },
    { description: 'in app layout', path: 'table-root/in-app-layout', screenshotType: 'screenshotArea' },
  ],
};

export default suite;
