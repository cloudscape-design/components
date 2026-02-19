// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import CollectionPreferences from '~components/collection-preferences';

import { contentDisplayPreferenceI18nStrings } from '../common/i18n-strings';
import {
  baseProperties,
  contentDensityPreference,
  customPreference,
  pageSizePreference,
  wrapLinesPreference,
} from './shared-configs';

const shortOptionsList = [
  {
    id: 'root1',
    label: 'Root Item 1',
  },
  {
    id: 'root2',
    label: 'Root Item 2',
  },
  {
    id: 'child1',
    label: 'Child 1 of Root 1',
    parentId: 'root1',
  },
  {
    id: 'child2',
    label: 'Child 2 of Root 1',
    parentId: 'root1',
  },
  {
    id: 'grandchild1',
    label: 'Grandchild 1 of Child 1',
    parentId: 'child1',
  },
  {
    id: 'grandchild2',
    label: 'Grandchild 2 of Child 1',
    parentId: 'child1',
  },
  {
    id: 'greatgrandchild1',
    label: 'Great-Grandchild 1 (Level 4)',
    parentId: 'grandchild1',
  },
  {
    id: 'root3',
    label: 'Root Item 3',
  },
  {
    id: 'child3',
    label: 'Child of Root 3',
    parentId: 'root3',
  },
  {
    id: 'root4',
    label:
      'Root Item 4 - Long text to verify wrapping behavior and ensure that the reordering feature works correctly with extended content',
  },
  {
    id: 'child4',
    label: 'Child of Root 4',
    parentId: 'root4',
  },
  {
    id: 'grandchild3',
    label: 'Grandchild of Root 4',
    parentId: 'child4',
  },
  {
    id: 'root5',
    label: 'ExtremelyLongLabelTextWithoutSpacesToVerifyThatItWrapsToTheNextLine',
  },
];

export default function App() {
  return (
    <CollectionPreferences
      {...baseProperties}
      pageSizePreference={pageSizePreference}
      wrapLinesPreference={wrapLinesPreference}
      contentDensityPreference={contentDensityPreference}
      customPreference={customPreference}
      contentDisplayPreference={{
        title: 'Column preferences',
        description: 'Customize the columns visibility and order.',
        options: shortOptionsList,
        ...contentDisplayPreferenceI18nStrings,
      }}
    />
  );
}
