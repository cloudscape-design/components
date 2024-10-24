// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import {
  Button,
  Container,
  Form,
  FormField,
  Header,
  Link,
  RadioGroup,
  RadioGroupProps,
  SpaceBetween,
  Tiles,
} from '~components';

import ScreenshotArea from '../utils/screenshot-area';

const TILE_OPTIONS = [
  {
    label: 'First option',
    value: 'first',
    description: 'This is the first option, that is set ad default. This is the most common choice.',
  },
  {
    label: 'Second option',
    value: 'second',
    description: 'This is the second option. Not often selected and is only for those daring enough to chose it.',
  },
  {
    label: 'Third option',
    value: 'third',
    description: 'This is the third option. Only those who like tricycles chose this',
  },
  {
    label: 'Fourth option',
    value: 'fourth',
    description: 'This is the fourth option. This option is rarely selected and mostly for show.',
  },
];

const items: RadioGroupProps.RadioButtonDefinition[] = [
  { value: 'none', label: 'None' },
  {
    value: 'top-margin',
    label: 'Add spacing to top',
    description: 'Keep tile spacing as is, add more space to the top of the columns',
  },
  {
    value: 'tile-padding',
    label: 'Shrink tile spacing',
    description: 'Move tiles closer together, while still adding some spacing to the top of the column',
  },
];

function FormPanel({
  selectedTile,
  onTileSelect,
}: {
  selectedTile: string;
  onTileSelect: (newSelectedTile: string) => void;
}) {
  const [appliedFix, setAppliedFix] = useState('none');

  return (
    <Container header={<Header>Selectable tiles in form example</Header>}>
      <SpaceBetween size="l">
        <FormField label="Potential solution">
          <RadioGroup value={appliedFix} items={items} onChange={({ detail }) => setAppliedFix(detail.value)} />
        </FormField>
        <FormField
          label="Available tiles"
          info={
            <Link variant="info" href="#">
              Info
            </Link>
          }
          stretch={true}
        >
          <Tiles
            toAllTiles={appliedFix === 'tile-padding'}
            toTopOfColumn={appliedFix === 'top-margin'}
            value={selectedTile}
            onChange={({ detail }) => onTileSelect(detail.value)}
            items={TILE_OPTIONS}
          />
        </FormField>
      </SpaceBetween>
    </Container>
  );
}

export default function TilesInFormPage() {
  const [formTileValue, setFormTileValue] = useState<string>('first');
  return (
    <article>
      <Header>Tiles inside a form</Header>
      <ScreenshotArea>
        <Form
          actions={
            <Button href="#" disabled={true}>
              Call to action
            </Button>
          }
        >
          <SpaceBetween size="l">
            <FormPanel selectedTile={formTileValue} onTileSelect={setFormTileValue} />
          </SpaceBetween>
        </Form>
      </ScreenshotArea>
    </article>
  );
}
