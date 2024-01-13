// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import ScreenshotArea from '../utils/screenshot-area';

import Checkbox from '~components/checkbox';
import FormField, { FormFieldProps } from '~components/form-field';
import Icon from '~components/icon';
import Input from '~components/input';
import RadioGroup from '~components/radio-group';
import Textarea from '~components/textarea';
import PermutationsView from '../utils/permutations-view';
import createPermutations from '../utils/permutations';
import Link from '~components/link';

/* eslint-disable react/jsx-key */
const permutations = createPermutations<FormFieldProps>([
  {
    label: ['Very long label description oh wow', 'Normal label', 'short'],
    i18nStrings: [{ errorIconAriaLabel: 'Error' }],
    errorText: [
      null,
      'An application with that name already exists',
      <div>
        Some <b>bold</b> validation message
      </div>,
    ],
    constraintText: [
      null,
      'Only normal characters are allowed',
      <div>
        Some <b>bold</b> instructional message
      </div>,
    ],
    description: [null, 'Enter your name'],
    children: ['Some control here'],
  },
  {
    label: ['Normal label'],
    i18nStrings: [{ errorIconAriaLabel: 'Error' }],
    errorText: [null, 'An application with that name already exists'],
    constraintText: [null, 'Only normal characters are allowed'],
    description: [null, 'Enter your name'],
    info: [<Link variant="info">info</Link>],
    children: [
      <div>Some plain text</div>,
      <Input value="" onChange={() => {}} placeholder="Main Instance" />,
      <Textarea value="" onChange={() => {}} placeholder="Sample JSON" />,
      <Checkbox checked={false} onChange={() => {}}>
        Use Elastic IP
      </Checkbox>,
      <RadioGroup
        value={null}
        onChange={() => {}}
        items={[
          { label: 'First Item', value: 'first' },
          { label: 'Second Item', value: 'second' },
        ]}
      />,
    ],
  },
  {
    label: ['Normal label'],
    errorText: [null],
    i18nStrings: [{ errorIconAriaLabel: 'Error' }],
    constraintText: [null],
    description: [
      <div>
        Icon at end of description{' '}
        <Link variant="primary" fontSize="body-s" external={true} href="#">
          External link
        </Link>
      </div>,
      <>
        <Icon name="external" size="small" /> Icon at start of description
      </>,
      <div>
        Icon in the middle of description{' '}
        <Link variant="primary" fontSize="body-s" external={true}>
          External link
        </Link>{' '}
        Icon in the middle of description
      </div>,
      <>
        Icon in the middle of long description. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
        laboris nisi ut aliquip ex ea commodo consequat.
        <Link variant="primary" fontSize="body-s" external={true} href="#">
          External link
        </Link>{' '}
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
        sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </>,
    ],
    children: [<div>Some plain text</div>],
  },
  {
    label: ['Normal label'],
    errorText: [null],
    i18nStrings: [{ errorIconAriaLabel: 'Error' }],
    constraintText: [null],
    description: [<div>Some plain text</div>],
    children: [
      'LongUnbreakableTextLongUnbreakableTextLongUnbreakableTextLongUnbreakableTextLongUnbreakableTextLongUnbreakableTextLongUnbreakableTextLongUnbreakableTextLongUnbreakableTextLongUnbreakableTextLongUnbreakableTextLongUnbreakableText',
    ],
  },
]);
/* eslint-enable react/jsx-key */

export default function FormFieldPermutations() {
  return (
    <>
      <h1>FormField permutations</h1>
      <ScreenshotArea>
        <PermutationsView permutations={permutations} render={permutation => <FormField {...permutation} />} />
      </ScreenshotArea>
    </>
  );
}
