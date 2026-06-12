// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Expandable section',
  componentName: 'expandable-section',
  tests: [
    {
      description: 'permutations',
      path: 'expandable-section/permutations',
      screenshotType: 'permutations',
    },
    {
      description: 'container variant',
      path: 'expandable-section/container-variant.permutations',
      screenshotType: 'permutations',
    },
    {
      description: 'focus - container variant with only heading',
      path: 'expandable-section/focus',
      screenshotType: 'screenshotArea',
      queryParams: { headerText: 'Header text', variant: 'container' },
      setup: async page => {
        await page.click('#focus-target');
        await page.focusNextElement();
      },
    },
    {
      description: 'focus - default variant with only heading',
      path: 'expandable-section/focus',
      screenshotType: 'screenshotArea',
      queryParams: { headerText: 'Header text', variant: 'default' },
      setup: async page => {
        await page.click('#focus-target');
        await page.focusNextElement();
      },
    },
    {
      description: 'focus - footer variant with only heading',
      path: 'expandable-section/focus',
      screenshotType: 'screenshotArea',
      queryParams: { headerText: 'Header text', variant: 'footer' },
      setup: async page => {
        await page.click('#focus-target');
        await page.focusNextElement();
      },
    },
    {
      description: 'focus - navigation variant with only heading',
      path: 'expandable-section/focus',
      screenshotType: 'screenshotArea',
      queryParams: { headerText: 'Header text', variant: 'navigation' },
      setup: async page => {
        await page.click('#focus-target');
        await page.focusNextElement();
      },
    },
    {
      description: 'focus - container variant with heading and description',
      path: 'expandable-section/focus',
      screenshotType: 'screenshotArea',
      queryParams: { headerText: 'Header text', headerDescription: 'Header description', variant: 'container' },
      setup: async page => {
        await page.click('#focus-target');
        await page.focusNextElement();
      },
    },
    {
      description: 'focus - default variant with heading and description',
      path: 'expandable-section/focus',
      screenshotType: 'screenshotArea',
      queryParams: { headerText: 'Header text', headerDescription: 'Header description', variant: 'default' },
      setup: async page => {
        await page.click('#focus-target');
        await page.focusNextElement();
      },
    },
    {
      description: 'focus - footer variant with heading and description',
      path: 'expandable-section/focus',
      screenshotType: 'screenshotArea',
      queryParams: { headerText: 'Header text', headerDescription: 'Header description', variant: 'footer' },
      setup: async page => {
        await page.click('#focus-target');
        await page.focusNextElement();
      },
    },
    {
      description: 'focus - container variant with interactive elements',
      path: 'expandable-section/focus',
      screenshotType: 'screenshotArea',
      queryParams: { headerText: 'Header text', hasHeaderInfo: 'true', hasHeaderActions: 'true', variant: 'container' },
      setup: async page => {
        await page.click('#focus-target');
        await page.focusNextElement();
      },
    },
    {
      description: 'focus - container variant with interactive elements and description',
      path: 'expandable-section/focus',
      screenshotType: 'screenshotArea',
      queryParams: {
        headerText: 'Header text',
        headerDescription: 'Header description',
        hasHeaderInfo: 'true',
        hasHeaderActions: 'true',
        variant: 'container',
      },
      setup: async page => {
        await page.click('#focus-target');
        await page.focusNextElement();
      },
    },
    {
      description: 'stacked variant',
      path: 'expandable-section/stacked-variant.permutations',
      screenshotType: 'permutations',
    },
  ],
};

export default suite;
