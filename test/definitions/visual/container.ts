// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Container and header',
  componentName: 'container',
  tests: [
    {
      description: 'simple',
      path: 'container/simple',
      screenshotType: 'screenshotArea',
    },
    {
      description: 'fit height with footer',
      path: 'container/fit-height',
      screenshotType: 'screenshotArea',
    },
    {
      description: 'fit height without footer',
      path: 'container/fit-height',
      screenshotType: 'screenshotArea',
      queryParams: { hideFooters: 'true' },
    },
    {
      description: 'correctly displays container with side media',
      path: 'container/media',
      screenshotType: 'screenshotArea',
      queryParams: { position: 'side', width: '33%', content: '16-9' },
    },
    {
      description: 'correctly displays container with top media',
      path: 'container/media',
      screenshotType: 'screenshotArea',
      queryParams: { position: 'top', height: '150px', content: '4-3' },
    },
    {
      description: 'media with position: side permutations at 465',
      path: 'container/media-side-permutations',
      screenshotType: 'permutations',
      configuration: { width: 465 },
    },
    {
      description: 'media with position: side permutations at 688',
      path: 'container/media-side-permutations',
      screenshotType: 'permutations',
      configuration: { width: 688 },
    },
    {
      description: 'media with position: side permutations at 1120',
      path: 'container/media-side-permutations',
      screenshotType: 'permutations',
      configuration: { width: 1120 },
    },
    {
      description: 'media with position: top permutations at 465',
      path: 'container/media-top-permutations',
      screenshotType: 'permutations',
      configuration: { width: 465 },
    },
    {
      description: 'media with position: top permutations at 688',
      path: 'container/media-top-permutations',
      screenshotType: 'permutations',
      configuration: { width: 688 },
    },
    {
      description: 'media with position: top permutations at 1120',
      path: 'container/media-top-permutations',
      screenshotType: 'permutations',
      configuration: { width: 1120 },
    },
    {
      description: 'stacked',
      path: 'container/stacked-components',
      screenshotType: 'screenshotArea',
    },
    {
      description: 'style-custom',
      path: 'container/style-custom',
      screenshotType: 'screenshotArea',
    },
  ],
};

export default suite;
