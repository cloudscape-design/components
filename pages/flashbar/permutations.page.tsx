// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import ScreenshotArea from '../utils/screenshot-area';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import Flashbar, { FlashbarProps } from '~components/flashbar';
import Link from '~components/link';
import Box from '~components/box';
import Button from '~components/button';
import ExpandableSection from '~components/expandable-section';

const noop = () => void 0;

/* eslint-disable react/jsx-key */
const permutations = createPermutations<FlashbarProps.MessageDefinition>([
  {
    type: ['success', 'warning', 'error', 'info', 'in-progress'],
    buttonText: ['Go for it!'],
    dismissible: [true],
    onDismiss: [noop],
    dismissLabel: ['Dismiss'],
    header: [<span>Simple span content. The &apos;H&apos; in HTML stands for Pizza</span>],
    content: [<span>Simple span content</span>],
  },
  {
    type: ['success', 'error', 'warning', 'info', 'in-progress'],
    header: ['Flash header'],
    action: [
      <Button iconName="external" iconAlign="right">
        View results
      </Button>,
    ],
  },
  {
    type: ['success', 'warning', 'error', 'in-progress'],
    loading: [true, false],
    header: [
      <Link color="inverted" href="#" variant="primary">
        This is a link
      </Link>,
    ],
    content: [
      <Box variant="p" color="inherit" padding="n">
        <Link color="inverted" href="#">
          This is also a link, but in the content region
        </Link>
      </Box>,
    ],
  },
  {
    type: ['success', 'error', 'warning', 'info', 'in-progress'],
    header: [
      <span>
        Header with a button{' '}
        <Button href="#" iconName="external">
          Click me
        </Button>
      </span>,
    ],
    content: [
      <div>
        <p>Content with a button </p>
        <Button href="#" iconName="external">
          Click me
        </Button>
      </div>,
    ],
  },
  {
    buttonText: ['Go for it!'],
    header: ['header'],
    content: ['content'],
  },
  {
    header: ['header'],
    content: [
      <ExpandableSection defaultExpanded={true} headerText="Details">
        Expandable Section content
      </ExpandableSection>,
    ],
  },
]);
/* eslint-enable react/jsx-key */

export default function FlashbarPermutations() {
  return (
    <>
      <h1>Flashbar permutations</h1>
      <ScreenshotArea disableAnimations={true}>
        <PermutationsView
          permutations={permutations}
          render={permutation => (
            <Flashbar items={[{ ...permutation, statusIconAriaLabel: permutation.type ?? 'info' }]} />
          )}
        />
      </ScreenshotArea>
    </>
  );
}
