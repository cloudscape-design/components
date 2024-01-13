// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { Header } from '~components';
import Container from '~components/container';
import ExpandableSection, { ExpandableSectionProps } from '~components/expandable-section';
import Table from '~components/table';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

/* eslint-disable react/jsx-key */
const permutations = createPermutations<ExpandableSectionProps>([
  {
    defaultExpanded: [true, false],
    variant: ['default'],
    headerText: [
      'Default Example Header',
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      <div>
        Default example header <i>- optional</i>
      </div>,
    ],
    children: [
      'Sample content',
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    ],
  },
  {
    defaultExpanded: [true],
    variant: ['footer'],
    headerText: [
      'Footer Example Header',
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    ],
    children: [
      'Sample content',
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    ],
  },
  {
    defaultExpanded: [true, false],
    variant: ['container'],
    headerText: [
      'Container example header',
      <>
        Container example header <i>- optional</i>
      </>,
    ],
    children: [
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    ],
  },
  {
    defaultExpanded: [true],
    variant: ['container'],
    headerText: [
      'Container example header',
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    ],
    children: [
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    ],
    disableContentPaddings: [true],
    headerCounter: [undefined, '(0)'],
  },
  {
    defaultExpanded: [true],
    variant: ['container'],
    headerText: ['Container example header'],
    children: [
      <Container header="Container Header">Content</Container>,
      <Container header="Container Header" footer="Container Footer">
        Content
      </Container>,
      <>
        <span>some text</span>
        <Table items={[]} columnDefinitions={[{ header: 'Test', cell: () => '' }]} empty="There will be content" />
      </>,
    ],
    disableContentPaddings: [false],
  },
  {
    defaultExpanded: [true],
    variant: ['container'],
    // keep on variant='container' with header for screenshot test to check no style breaks
    header: [<Header variant="h2">Container example header</Header>],
    children: [
      <div style={{ overflow: 'hidden' }}>
        <Table
          variant="embedded"
          items={[]}
          columnDefinitions={[{ header: 'Test', cell: () => '' }]}
          empty="There will be content"
        />
      </div>,
    ],
    disableContentPaddings: [true],
  },
  {
    defaultExpanded: [true, false],
    variant: ['navigation'],
    headerText: [
      'Navigation Example Header',
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      <div>
        Navigation header <i>- optional</i>
      </div>,
    ],
    children: ['Navigation content'],
  },
  {
    defaultExpanded: [true],
    headerAriaLabel: ['Header with ARIA label (ARIA)'],
    variant: ['default', 'footer', 'navigation'],
    headerText: ['Header with ARIA label'],
    children: ['Sample content'],
  },
  {
    defaultExpanded: [false],
    variant: ['default', 'footer', 'navigation'],
    headerText: ['Custom heading tag override'],
    children: ['Sample content'],
    headingTagOverride: [undefined, 'h2', 'h3'],
  },
  {
    variant: ['default', 'container', 'footer'],
    headerText: ['With description'],
    children: ['Sample content'],
    headerDescription: [
      'Sample description',
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    ],
    defaultExpanded: [false, true],
  },
  {
    defaultExpanded: [false],
    variant: ['default', 'footer'],
    header: ['Deprecated header prop'],
    children: ['Sample content'],
  },
]);
/* eslint-enable react/jsx-key */

export default function ExpandableSectionPermutations() {
  return (
    <>
      <h1>Expandable Section permutations</h1>
      <ScreenshotArea>
        <PermutationsView permutations={permutations} render={permutation => <ExpandableSection {...permutation} />} />
      </ScreenshotArea>
    </>
  );
}
