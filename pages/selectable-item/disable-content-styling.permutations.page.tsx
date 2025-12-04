// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import SelectableItem, { SelectableItemProps } from '~components/internal/components/selectable-item';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';
import { permutationsConfigs } from './common';

// Copy permutations and add selectable-items with no-content-styling.
const permutations = createPermutations<SelectableItemProps>(permutationsConfigs);

export default function DisableContentStylingSelectableItemPermutations() {
  return (
    <>
      <h1>Selectable item permutations</h1>
      <ScreenshotArea>
        <ul role="listbox" aria-label="list">
          <PermutationsView
            permutations={permutations}
            render={permutation => <SelectableItem {...permutation} disableContentStyling={true} />}
          />
        </ul>
      </ScreenshotArea>
    </>
  );
}
