// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Icon } from '~components';
import ActionCard, { ActionCardProps } from '~components/action-card';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

const onClick = () => {};

const icon = <Icon name="angle-right" />;

const permutations = createPermutations<ActionCardProps>([
  // Header + description + children combinations
  {
    header: [<b key="h">Card header</b>, undefined],
    description: ['A description of the action card', undefined],
    children: ['Card content', undefined],
    onClick: [onClick],
  },
  // Disabled state
  {
    header: [<b key="h">Card header</b>],
    description: ['A description of the action card'],
    children: ['Card content'],
    disabled: [false, true],
    onClick: [onClick],
  },
  // Icon with position and alignment variations
  {
    header: [<b key="h">Card header</b>],
    description: ['A description of the action card'],
    icon: [icon],
    iconVerticalAlignment: ['top', 'center'],
    onClick: [onClick],
  },
  // Icon with children content
  {
    header: [<b key="h">Card header</b>],
    children: ['Card content'],
    icon: [icon],
    iconVerticalAlignment: ['top', 'center'],
    disabled: [false, true],
    onClick: [onClick],
  },
  // Padding variations
  {
    header: [<b key="h">Card header</b>],
    description: ['A description'],
    children: ['Card content'],
    disableHeaderPaddings: [false, true],
    disableContentPaddings: [false, true],
    onClick: [onClick],
  },
  // Long content wrapping
  {
    header: [
      <b key="h">
        A very long header text that should wrap to multiple lines to test the layout behavior of the action card
        component
      </b>,
    ],
    description: [
      'A very long description text that should wrap to multiple lines to test the layout behavior of the action card component when content overflows',
    ],
    children: [
      'Very long content that should wrap to multiple lines to test the layout behavior of the action card component when the content area has a lot of text',
    ],
    icon: [icon],
    iconVerticalAlignment: ['top', 'center'],
    onClick: [onClick],
  },
  // Minimal: content only
  {
    children: ['Minimal card with content only'],
    onClick: [onClick],
  },
  // Header only
  {
    header: [<b key="h">Header only card</b>],
    onClick: [onClick],
  },
  // All content slots with disabled padding and disabled state
  {
    header: [<b key="h">Full card</b>],
    description: ['Description text'],
    children: ['Card content'],
    icon: [icon],
    disabled: [true],
    disableHeaderPaddings: [true],
    disableContentPaddings: [true],
    onClick: [onClick],
  },
  // Variant variations
  {
    header: [<b key="h">Card header</b>],
    description: ['A description of the action card'],
    children: ['Card content'],
    variant: ['default', 'embedded'],
    onClick: [onClick],
  },
  // Variant with icon
  {
    header: [<b key="h">Card header</b>],
    description: ['A description of the action card'],
    icon: [icon],
    variant: ['default', 'embedded'],
    onClick: [onClick],
  },
]);

export default function ActionCardPermutations() {
  return (
    <>
      <h1>Action card permutations</h1>
      <ScreenshotArea disableAnimations={true}>
        <PermutationsView
          permutations={permutations}
          render={permutation => (
            <div style={{ maxInlineSize: '400px' }}>
              <ActionCard {...permutation} />
            </div>
          )}
        />
      </ScreenshotArea>
    </>
  );
}
