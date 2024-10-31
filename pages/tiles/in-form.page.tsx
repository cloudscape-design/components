// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { Button, Container, Form, FormField, Header, Input, Link, SpaceBetween, Textarea, Tiles } from '~components';

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

export default function TilesInFormPage() {
  const [inputValue, setInputValue] = useState<number>(0);
  const [textAreaValue, setTextAreaValue] = useState<string>('');
  const [formTileValue, setFormTileValue] = useState<string>('first');

  return (
    <article>
      <h1>Selectable tiles in form example</h1>
      <ScreenshotArea>
        <Form
          actions={
            <Button href="#" disabled={true}>
              Call to action
            </Button>
          }
        >
          <SpaceBetween size="l">
            <Container header={<Header variant="h2">Selectable tiles in form example</Header>}>
              <SpaceBetween size="l">
                <FormField label="Potential solution">
                  <Input
                    ariaLabel="test input"
                    type="number"
                    step={0.2}
                    value={`${inputValue}`}
                    onChange={event => setInputValue(Number(event.detail.value))}
                  />
                </FormField>
                <FormField label="Text area">
                  <Textarea
                    value={textAreaValue}
                    ariaLabel="textarea"
                    onChange={event => setTextAreaValue(event.detail.value)}
                  />
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
                    value={formTileValue}
                    onChange={({ detail }) => setFormTileValue(detail.value)}
                    items={TILE_OPTIONS}
                  />
                </FormField>
              </SpaceBetween>
            </Container>
          </SpaceBetween>
        </Form>
      </ScreenshotArea>
    </article>
  );
}
