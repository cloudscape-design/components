// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';

import ButtonDropdown, { ButtonDropdownProps } from '~components/button-dropdown';
import { Box, SpaceBetween } from '~components';
import { cloneDeep, toString } from 'lodash';
import createPermutations from '../utils/permutations';
import ScreenshotArea from '../utils/screenshot-area';
import PermutationsView from '../utils/permutations-view';

const defaultItems: ButtonDropdownProps['items'] = [
  {
    id: 'launch-instance',
    text: 'Launch instance',
    iconName: 'add-plus',
  },
  {
    id: 'launch-instance-from-template-a',
    text: 'Launch instance from template A',
    iconName: 'file',
  },
  {
    id: 'launch-instance-from-template-B',
    text: 'Launch instance from template B',
    iconName: 'file',
  },
  {
    id: 'view-instances',
    text: 'View instances',
    href: 'https://instances.com',
    external: true,
    externalIconAriaLabel: '(opens in new tab)',
  },
];

const itemsWithTemplatesDisabled = cloneDeep(defaultItems);
itemsWithTemplatesDisabled[1].disabled = true;
itemsWithTemplatesDisabled[1].disabledReason = 'Template A is unavailable';
itemsWithTemplatesDisabled[2].disabled = true;
itemsWithTemplatesDisabled[2].disabledReason = 'Template A is unavailable';

const itemsWithLaunchActionsDisabled = cloneDeep(defaultItems) as ButtonDropdownProps.ItemOrGroup[];
itemsWithLaunchActionsDisabled[0].disabled = true;
itemsWithLaunchActionsDisabled[0].disabledReason = 'No permission';
itemsWithLaunchActionsDisabled[1].disabled = true;
itemsWithLaunchActionsDisabled[1].disabledReason = 'No permission';
itemsWithLaunchActionsDisabled[2].disabled = true;
itemsWithLaunchActionsDisabled[2].disabledReason = 'No permission';
itemsWithLaunchActionsDisabled.unshift({ ...itemsWithLaunchActionsDisabled[0] });

const itemsWithViewInstancesActionFirst = cloneDeep(defaultItems) as ButtonDropdownProps.ItemOrGroup[];
itemsWithViewInstancesActionFirst.unshift(itemsWithViewInstancesActionFirst.pop() as ButtonDropdownProps.ItemOrGroup);

const permutations = createPermutations<ButtonDropdownProps & { TITLE: string; PROPERTY?: string }>([
  {
    TITLE: ['With 4 actions'],
    PROPERTY: ['disabled'],
    items: [defaultItems],
    disabled: [false, true],
  },
  {
    TITLE: ['With 4 actions'],
    PROPERTY: ['loading'],
    items: [defaultItems],
    loading: [false, true],
  },
  {
    TITLE: ['With template actions disabled'],
    items: [itemsWithTemplatesDisabled],
  },
  {
    TITLE: ['With launch actions disabled'],
    PROPERTY: ['loading'],
    items: [itemsWithLaunchActionsDisabled],
    loading: [false, true],
  },
  {
    TITLE: ['With external icon split action'],
    PROPERTY: ['loading'],
    items: [itemsWithViewInstancesActionFirst],
    loading: [false, true],
  },
]);

export default function () {
  return (
    <>
      <Box variant="h1">ButtonDropdown split-primary permutations</Box>
      <ScreenshotArea disableAnimations={true}>
        <PermutationsView
          permutations={permutations}
          render={permutation => {
            const propertyName = permutation.PROPERTY;
            const propertyValue = propertyName
              ? toString(permutation[propertyName as keyof ButtonDropdownProps])
              : undefined;

            return (
              <SpaceBetween size="s">
                <Box>
                  {permutation.TITLE}
                  {propertyName ? `: ${propertyName}=${propertyValue}` : ''}
                </Box>
                <Box>
                  {
                    <ButtonDropdown
                      variant="split-primary"
                      ariaLabel="More instance actions"
                      loadingText="Loading"
                      onItemClick={({ detail }) => alert(detail.id)}
                      {...permutation}
                    />
                  }
                </Box>
              </SpaceBetween>
            );
          }}
        />
      </ScreenshotArea>
    </>
  );
}
