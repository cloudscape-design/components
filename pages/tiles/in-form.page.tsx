// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { Button, Checkbox, Container, Form, FormField, Header, Link, SpaceBetween, Tiles } from '~components';

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

function FormPanel({
  selectedTile,
  onTileSelect,
}: {
  selectedTile: string;
  onTileSelect: (newSelectedTile: string) => void;
}) {
  const [topMargin, setTopMargin] = useState<boolean>(false);
  const [toAllTiles, setToAllTiles] = useState<boolean>(false);

  return (
    <Container header={<Header>Selectable tiles in form example</Header>}>
      <SpaceBetween size="l">
        <FormField label="Column top">
          <Checkbox checked={topMargin} onChange={({ detail: { checked } }) => setTopMargin(checked)}>
            Set container top margin to 20px
          </Checkbox>
        </FormField>
        <FormField label="All tiles">
          <Checkbox checked={toAllTiles} onChange={({ detail: { checked } }) => setToAllTiles(checked)}>
            Set custom styling to all tiles
          </Checkbox>
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
            toAllTiles={toAllTiles}
            toTopOfColumn={topMargin}
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
