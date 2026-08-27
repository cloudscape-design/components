// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '~components/box';
import Button from '~components/button';
import Dialog from '~components/dialog';
import { DialogProps } from '~components/dialog/interfaces';
import FormField from '~components/form-field';
import Pagination from '~components/pagination';
import RadioGroup from '~components/radio-group';
import SpaceBetween from '~components/space-between';

import { SimplePage } from '../app/templates';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';

const footer = (
  <Box float="right">
    <SpaceBetween direction="horizontal" size="xs">
      <Button>Skip</Button>
      <Button variant="primary">Continue</Button>
    </SpaceBetween>
  </Box>
);

const headerActions = (
  <Pagination
    pagesVariant="compact"
    currentPageIndex={1}
    pagesCount={3}
    onChange={() => {}}
    ariaLabels={{
      nextPageLabel: 'Next question',
      previousPageLabel: 'Previous question',
      pageLabel: pageNumber => `Question ${pageNumber}`,
    }}
    i18nStrings={{ pagesCompactText: ({ currentPage, pagesCount }) => `${currentPage} of ${pagesCount}` }}
  />
);

const content = (
  <FormField label="Select the option that best matches your intent">
    <RadioGroup
      value={null}
      onChange={() => {}}
      items={[
        { value: 'reduce-dev', label: 'Reduce costs for development environments' },
        { value: 'optimize-prod', label: 'Optimize production workload spending' },
      ]}
    />
  </FormField>
);

const longContent = (
  <SpaceBetween size="m">
    {content}
    <Box variant="p">
      This longer content verifies wrapping, responsive width, section spacing, and focus movement between Dialog and
      the surrounding page.
    </Box>
  </SpaceBetween>
);

// The close button is always present. The closed playground state renders no Dialog,
// so neither is a permutation axis.
const permutations = createPermutations<DialogProps>([
  {
    onDismiss: [() => {}],
    i18nStrings: [{ dismissAriaLabel: 'Close' }],
    header: [
      "What's your main goal?",
      'Tell us which production workload and deployment environment you want to optimize first',
    ],
    headerActions: [undefined, headerActions],
    children: [undefined, content, longContent],
    footer: [undefined, footer],
  },
]);

export default function DialogPermutationsPage() {
  return (
    <SimplePage title="Dialog: Permutations" screenshotArea={{ disableAnimations: true }}>
      <div style={{ maxInlineSize: 520 }}>
        <PermutationsView permutations={permutations} render={dialogProps => <Dialog {...dialogProps} />} />
      </div>
    </SimplePage>
  );
}
