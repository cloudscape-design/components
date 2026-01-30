// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext } from 'react';

import ButtonGroup from '~components/button-group';
import FormField from '~components/form-field';
import Icon from '~components/icon';
import Input from '~components/input';
import Card from '~components/internal/components/card';
import { InternalCardProps } from '~components/internal/components/card/interfaces';
import SpaceBetween from '~components/space-between';

import AppContext, { AppContextType } from '../app/app-context';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

type PageContext = React.Context<
  AppContextType<{
    containerWidth?: string;
  }>
>;

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
    header: [shortHeader],
    children: [shortContent],
    actions: [undefined, actions],
  },
  // Header variations
  {
    header: [undefined, shortHeader, longHeader],
    children: [shortContent],
  },
  // Description variations
  {
    header: [shortHeader],
    description: [undefined, shortDescription, longDescription],
    children: [shortContent],
  },
  // Children variations
  {
    header: [shortHeader],
    children: [undefined, shortContent, longContent],
  },
  // Icon variations
  {
    header: [shortHeader],
    icon: [undefined, icon],
    children: [shortContent],
  },
  // Combined variations
  {
    header: [shortHeader],
    description: [shortDescription],
    icon: [icon],
    children: [shortContent],
    actions: [actions],
  },
  {
    header: [longHeader],
    description: [longDescription],
    children: [longContent],
    actions: [actions],
  },
  // No children with actions
  {
    header: [shortHeader],
    description: [shortDescription],
    actions: [actions],
    children: [undefined],
  },
  // Selected state
  {
    header: [shortHeader],
    children: [shortContent],
    selected: [true],
  },
]);

export default function CardPermutations() {
  const { urlParams, setUrlParams } = useContext(AppContext as PageContext);
  const containerWidth = urlParams.containerWidth || '300';

  return (
    <>
      <h1>Internal Card permutations</h1>
      <SpaceBetween size="m">
        <FormField label="Container width (px)">
          <Input
            value={containerWidth}
            onChange={({ detail }) => setUrlParams({ containerWidth: detail.value })}
            type="number"
            inputMode="numeric"
          />
        </FormField>
      </SpaceBetween>
      <ScreenshotArea disableAnimations={true}>
        <div style={{ width: parseInt(containerWidth), padding: 8 }}>
          <PermutationsView permutations={permutations} render={permutation => <Card {...permutation} />} />
        </div>
      </ScreenshotArea>
    </>
  );
}
