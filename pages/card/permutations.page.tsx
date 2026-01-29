// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import ButtonGroup from '~components/button-group';
import Icon from '~components/icon';
import Card from '~components/internal/components/card';
import { InternalCardProps } from '~components/internal/components/card/interfaces';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

const shortHeader = 'Card Header';
const longHeader = 'This is a very long card header that might wrap to multiple lines on smaller viewports';
const shortDescription = 'Short description';
const longDescription =
  'This is a much longer description that provides more context and details about the card content. It might span multiple lines depending on the viewport width.';

const shortContent = 'Card content';
const longContent =
  'This is longer card content with multiple sentences. It provides more detailed information and might wrap across several lines. The content can include various types of information that users need to see.';

const actions = (
  <ButtonGroup
    variant="icon"
    items={[
      { type: 'icon-button', id: 'edit', iconName: 'edit', text: 'Edit' },
      { type: 'icon-button', id: 'delete', iconName: 'remove', text: 'Delete' },
    ]}
  />
);

const icon = <Icon name="settings" />;

const permutations = createPermutations<InternalCardProps & { width?: number }>([
  // Basic variations
  {
    width: [300],
    header: [shortHeader],
    children: [shortContent],
    actions: [undefined, actions],
  },
  // Header variations
  {
    width: [300],
    header: [undefined, shortHeader, longHeader],
    children: [shortContent],
  },
  // Description variations
  {
    width: [300],
    header: [shortHeader],
    description: [undefined, shortDescription, longDescription],
    children: [shortContent],
  },
  // Children variations
  {
    width: [300],
    header: [shortHeader],
    children: [undefined, shortContent, longContent],
  },
  // Icon variations
  {
    width: [300],
    header: [shortHeader],
    icon: [undefined, icon],
    children: [shortContent],
  },
  // Padding variations
  {
    width: [300],
    header: [shortHeader],
    children: [shortContent],
    disableContentPaddings: [false, true],
  },
  {
    width: [300],
    header: [shortHeader],
    children: [shortContent],
    disableHeaderPaddings: [false, true],
  },
  {
    width: [300],
    header: [shortHeader],
    children: [shortContent],
    reducedPadding: [false, true],
  },
  // Border radius variations
  {
    width: [300],
    header: [shortHeader],
    children: [shortContent],
    reducedBorderRadius: [false, true],
  },
  // Combined variations
  {
    width: [300],
    header: [shortHeader],
    description: [shortDescription],
    icon: [icon],
    children: [shortContent],
    actions: [actions],
  },
  {
    width: [300],
    header: [longHeader],
    description: [longDescription],
    children: [longContent],
    actions: [actions],
  },
  // Reduced styling with content
  {
    width: [300],
    header: [shortHeader],
    children: [shortContent],
    reducedBorderRadius: [true],
    reducedPadding: [true],
  },
  // No children with actions
  {
    width: [300],
    header: [shortHeader],
    description: [shortDescription],
    actions: [actions],
    children: [undefined],
  },
  // Active state
  {
    width: [300],
    header: [shortHeader],
    children: [shortContent],
    active: [false, true],
  },
]);

export default function CardPermutations() {
  return (
    <>
      <h1>Internal Card permutations</h1>
      <ScreenshotArea disableAnimations={true}>
        <PermutationsView
          permutations={permutations}
          render={({ width, ...permutation }) => (
            <div style={{ width, padding: 8 }}>
              <Card {...permutation} />
            </div>
          )}
        />
      </ScreenshotArea>
    </>
  );
}
