// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';

import ButtonDropdown, { ButtonDropdownProps } from '~components/button-dropdown';
import { Box, SpaceBetween } from '~components';
import createPermutations from '../utils/permutations';
import ScreenshotArea from '../utils/screenshot-area';
import PermutationsView from '../utils/permutations-view';

const launchInstanceItem = {
  text: 'Launch instance',
  iconName: 'add-plus',
} as const;

const launchInstanceFromTemplateItem = {
  text: 'Launch instance from template',
  iconName: 'file',
} as const;

const viewInstancesItem = {
  text: 'View instances',
  href: 'https://instances.com',
  external: true,
  externalIconAriaLabel: '(opens in new tab)',
} as const;

const permutations = createPermutations<ButtonDropdownProps>([
  {
    mainAction: [
      { ...launchInstanceItem },
      { ...launchInstanceItem, disabled: true },
      { ...launchInstanceItem, loading: true, loadingText: 'Loading' },
    ],
    items: [
      [
        { id: '1', ...launchInstanceFromTemplateItem },
        { id: '2', ...viewInstancesItem },
      ],
    ],
    disabled: [false, true],
    loading: [false, true],
    variant: ['primary', 'normal'],
  },
  {
    mainAction: [{ ...viewInstancesItem }, { ...viewInstancesItem, disabled: true }],
    items: [
      [
        { id: '1', ...launchInstanceItem },
        { id: '2', ...launchInstanceFromTemplateItem },
      ],
    ],
    variant: ['primary', 'normal'],
  },
]);

export default function () {
  return (
    <>
      <Box variant="h1">ButtonDropdown with main action permutations</Box>
      <ScreenshotArea>
        <PermutationsView
          permutations={permutations}
          render={({ items, ...rest }) => {
            const propertyKeys = Object.keys(rest) as (keyof Omit<ButtonDropdownProps, 'items'>)[];
            const propertiesString = propertyKeys.map(key => `${key}=${JSON.stringify(rest[key])}`).join(', ');
            return (
              <SpaceBetween size="s">
                <Box variant="code">
                  <span style={{ whiteSpace: 'nowrap' }}>{propertiesString}</span>
                </Box>
                <Box>
                  <ButtonDropdown
                    variant="primary"
                    ariaLabel="Instance actions"
                    loadingText="Loading"
                    items={items}
                    {...rest}
                  />
                </Box>
              </SpaceBetween>
            );
          }}
        />
      </ScreenshotArea>
    </>
  );
}
