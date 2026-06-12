// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Flashbar stacked notifications',
  componentName: 'flashbar',
  tests: [
    {
      description: '380px, collapsed',
      path: 'flashbar/collapsible.visual-tests',
      screenshotType: 'screenshotArea',
      configuration: { width: 380 },
    },
    {
      description: '380px, collapsed, notifications bar button focused',
      path: 'flashbar/collapsible.visual-tests',
      screenshotType: 'screenshotArea',
      configuration: { width: 380 },
      setup: async page => {
        await page.click('#focus-target');
        await page.focusNextElement();
      },
    },
    {
      description: '380px, expanded',
      path: 'flashbar/collapsible.visual-tests',
      screenshotType: 'screenshotArea',
      configuration: { width: 380 },
      setup: async page => {
        await page.click('#focus-target');
        await page.focusNextElement();
        await page.keys(['Space']);
        await new Promise(resolve => setTimeout(resolve, 500));
      },
    },
    {
      description: '450px, collapsed',
      path: 'flashbar/collapsible.visual-tests',
      screenshotType: 'screenshotArea',
      configuration: { width: 450 },
    },
    {
      description: '450px, collapsed, notifications bar button focused',
      path: 'flashbar/collapsible.visual-tests',
      screenshotType: 'screenshotArea',
      configuration: { width: 450 },
      setup: async page => {
        await page.click('#focus-target');
        await page.focusNextElement();
      },
    },
    {
      description: '450px, expanded',
      path: 'flashbar/collapsible.visual-tests',
      screenshotType: 'screenshotArea',
      configuration: { width: 450 },
      setup: async page => {
        await page.click('#focus-target');
        await page.focusNextElement();
        await page.keys(['Space']);
        await new Promise(resolve => setTimeout(resolve, 500));
      },
    },
    {
      description: '600px, collapsed',
      path: 'flashbar/collapsible.visual-tests',
      screenshotType: 'screenshotArea',
      configuration: { width: 600 },
    },
    {
      description: '600px, collapsed, notifications bar button focused',
      path: 'flashbar/collapsible.visual-tests',
      screenshotType: 'screenshotArea',
      configuration: { width: 600 },
      setup: async page => {
        await page.click('#focus-target');
        await page.focusNextElement();
      },
    },
    {
      description: '600px, expanded',
      path: 'flashbar/collapsible.visual-tests',
      screenshotType: 'screenshotArea',
      configuration: { width: 600 },
      setup: async page => {
        await page.click('#focus-target');
        await page.focusNextElement();
        await page.keys(['Space']);
        await new Promise(resolve => setTimeout(resolve, 500));
      },
    },
    {
      description: '1200px, collapsed',
      path: 'flashbar/collapsible.visual-tests',
      screenshotType: 'screenshotArea',
      configuration: { width: 1200 },
    },
    {
      description: '1200px, collapsed, notifications bar button focused',
      path: 'flashbar/collapsible.visual-tests',
      screenshotType: 'screenshotArea',
      configuration: { width: 1200 },
      setup: async page => {
        await page.click('#focus-target');
        await page.focusNextElement();
      },
    },
    {
      description: '1200px, expanded',
      path: 'flashbar/collapsible.visual-tests',
      screenshotType: 'screenshotArea',
      configuration: { width: 1200 },
      setup: async page => {
        await page.click('#focus-target');
        await page.focusNextElement();
        await page.keys(['Space']);
        await new Promise(resolve => setTimeout(resolve, 500));
      },
    },
  ],
};

export default suite;
