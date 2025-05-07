// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext } from 'react';

import { Button, Checkbox, Icon, Link } from '~components';
import StructuredItem, { StructuredItemProps } from '~components/structured-item';

import AppContext, { AppContextType } from '../app/app-context';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

const longBreakable =
  'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat.';
const longUnbreakable =
  'Duis aute irure dolor in reprehenderitinvoluptatevelitessereprehenderitinvoluptatevelitessereprehenderitinvoluptatevelitessereprehenderitinvoluptatevelitesse';

/* eslint-disable react/jsx-key */
const permutations = createPermutations<StructuredItemProps & { viewportWidth: number }>([
  {
    label: [
      'Label',
      'Label that is a bit longer',
      <div>
        Label with info link | <Link variant="info">Info</Link>
      </div>,
    ],
    description: [null, 'Description', 'Description that is a bit longer', longBreakable, longUnbreakable],
    actions: [<Button variant="icon" iconName="settings" />, <Button>Longer button</Button>],
    icon: [<Icon name="star" />],
    // disableTypography: [true, false],
    viewportWidth: [100, 200, 300, 600],
  },
]);
/* eslint-enable react/jsx-key */

type PageContext = React.Context<
  AppContextType<{
    percentageWrapping: boolean;
  }>
>;

export default function ListItemPermutations() {
  const { urlParams, setUrlParams } = useContext(AppContext as PageContext);
  return (
    <>
      <h1>List item permutations</h1>

      <Checkbox
        checked={urlParams.percentageWrapping}
        onChange={event => {
          setUrlParams({ percentageWrapping: event.detail.checked });
          window.location.reload();
        }}
      >
        Percentage-based wrapping
      </Checkbox>

      <ScreenshotArea>
        <PermutationsView
          permutations={permutations}
          render={({ viewportWidth, ...permutation }) => (
            <div style={{ width: viewportWidth, borderRight: '1px solid red', overflow: 'hidden' }}>
              <StructuredItem {...permutation} percentageWrapping={urlParams.percentageWrapping} />
            </div>
          )}
        />
      </ScreenshotArea>
    </>
  );
}
