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
const longDescription = 'This is a long description that provides more context and details about the card content.';

const longContent =
  'This is long card content with multiple sentences. It provides more detailed information and might wrap across several lines.';

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
  // Variations of the header region
  {
    header: [shortHeader, longHeader, undefined],
    children: [longContent],
    description: [undefined, longDescription],
    actions: [undefined, actions],
    icon: [undefined, icon],
  },
  // Variations of header + content composition
  {
    header: [longHeader, undefined],
    children: [longContent, undefined],
    description: [shortDescription, undefined],
    actions: [actions],
    icon: [icon],
    disableHeaderPaddings: [false, true],
    disableContentPaddings: [false, true],
  },
]);

export default function CardPermutations() {
  const { urlParams, setUrlParams } = useContext(AppContext as PageContext);
  const containerWidth = urlParams.containerWidth || '400';

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
