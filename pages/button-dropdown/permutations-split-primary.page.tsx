// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';

import ButtonDropdown, { ButtonDropdownProps } from '~components/button-dropdown';
import { Box, SpaceBetween } from '~components';
import { toString } from 'lodash';
import createPermutations from '../utils/permutations';
import ScreenshotArea from '../utils/screenshot-area';
import PermutationsView from '../utils/permutations-view';

const launchInstanceItem: ButtonDropdownProps.Item = {
  id: 'launch-instance',
  text: 'Launch instance',
  iconName: 'add-plus',
};
const launchInstanceFromTemplateAItem: ButtonDropdownProps.Item = {
  id: 'launch-instance-from-template-a',
  text: 'Launch instance from template A',
  iconName: 'file',
};
const launchInstanceFromTemplateBItem: ButtonDropdownProps.Item = {
  id: 'launch-instance-from-template-b',
  text: 'Launch instance from template B',
  iconName: 'file',
};
const viewInstancesItem: ButtonDropdownProps.Item = {
  id: 'view-instances',
  text: 'View instances',
  href: 'https://instances.com',
  external: true,
  externalIconAriaLabel: '(opens in new tab)',
};

const permutations = createPermutations<ButtonDropdownProps & { TITLE: string; PROPERTY?: string }>([
  {
    TITLE: ['With 4 actions'],
    PROPERTY: ['disabled'],
    items: [[launchInstanceItem, launchInstanceFromTemplateAItem, launchInstanceFromTemplateBItem, viewInstancesItem]],
    disabled: [false, true],
  },
  {
    TITLE: ['With 4 actions'],
    PROPERTY: ['loading'],
    items: [[launchInstanceItem, launchInstanceFromTemplateAItem, launchInstanceFromTemplateBItem, viewInstancesItem]],
    loading: [false, true],
  },
  {
    TITLE: ['With template actions disabled'],
    items: [
      [
        launchInstanceItem,
        { ...launchInstanceFromTemplateAItem, disabled: true, disabledReason: 'Template A is unavailable' },
        { ...launchInstanceFromTemplateBItem, disabled: true, disabledReason: 'Template B is unavailable' },
        viewInstancesItem,
      ],
    ],
  },
  {
    TITLE: ['With launch actions disabled'],
    PROPERTY: ['loading'],
    items: [
      [
        { ...launchInstanceItem, disabled: true, disabledReason: 'No permission' },
        { ...launchInstanceFromTemplateAItem, disabled: true, disabledReason: 'No permission' },
        { ...launchInstanceFromTemplateBItem, disabled: true, disabledReason: 'No permission' },
        viewInstancesItem,
      ],
    ],
    loading: [false, true],
  },
  {
    TITLE: ['With external icon split action'],
    PROPERTY: ['loading'],
    items: [[viewInstancesItem, launchInstanceItem, launchInstanceFromTemplateAItem, launchInstanceFromTemplateBItem]],
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
                      ariaLabel="Instance actions"
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
