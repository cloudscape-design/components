// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Alert, { AlertProps } from '~components/alert';
import Button from '~components/button';
import ExpandableSection from '~components/expandable-section';
import Link from '~components/link';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';
import { i18nStrings } from './common';

const longText =
  'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

const longTextWithLink = (
  <>
    Lorem ipsum dolor sit amet, <Link href="#">consectetur</Link> adipisicing{' '}
    <Link external={true} href="#">
      elit
    </Link>
    , sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
    exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
    voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
    culpa qui officia deserunt mollit anim id est laborum.
  </>
);

const longTextWithUnbreakableWord = (
  <>
    Lorem ipsum dolor sit amet,consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
    aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
    Duis aute irure dolor in
    reprehenderitinvoluptatevelitessereprehenderitinvoluptatevelitessereprehenderitinvoluptatevelitessereprehenderitinvoluptatevelitesse
    cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
    deserunt mollit anim id est laborum.
  </>
);

const longTextWithExpandableSection = (
  <>
    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
    aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
    <ExpandableSection headerText="Expand me" defaultExpanded={true}>
      Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
    </ExpandableSection>
  </>
);

const allTypes: AlertProps.Type[] = ['info', 'success', 'warning', 'error'];

/* eslint-disable react/jsx-key */
const permutations = createPermutations<AlertProps>([
  {
    i18nStrings: [i18nStrings],
    children: [longText, longTextWithLink],
    type: allTypes,
  },
  {
    i18nStrings: [i18nStrings],
    dismissible: [true],
    header: ['Default Example Header'],
    type: allTypes,
  },
  {
    i18nStrings: [i18nStrings],
    buttonText: ['Button text'],
    children: ['Default Example Body'],
    type: allTypes,
  },
  {
    i18nStrings: [i18nStrings],
    dismissible: [true],
    buttonText: ['Button text'],
    header: ['Default Example Header', longText],
    children: ['Default Example Body', longText],
    type: allTypes,
  },
  {
    i18nStrings: [i18nStrings],
    dismissible: [true, false],
    header: [undefined, 'Default Example Header'],
    children: ['Default Example Body', longText],
    action: [
      <Button iconName="external" iconAlign="right">
        Show more
      </Button>,
    ],
    type: allTypes,
  },
  {
    i18nStrings: [i18nStrings],
    header: ['With expandable section'],
    children: [longTextWithExpandableSection],
    type: ['info'],
  },
  {
    i18nStrings: [i18nStrings],
    header: ['With unbreakable word'],
    children: [longTextWithUnbreakableWord],
    type: ['info'],
    dismissible: [true, false],
    action: [undefined, <Button>Action</Button>],
  },
]);

export default function AlertScenario() {
  return (
    <article>
      <h1>Alert permutations</h1>
      <ScreenshotArea>
        <PermutationsView permutations={permutations} render={permutation => <Alert {...permutation} />} />
      </ScreenshotArea>
    </article>
  );
}
