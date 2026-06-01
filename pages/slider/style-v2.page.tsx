// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';

import { Box, Checkbox, Container, Slider, SpaceBetween } from '~components';

import { SimplePage } from '../app/templates';

import styles from './style-v2.scss';

export default function StyleV2SliderPage() {
  const [volume, setVolume] = useState(60);
  const [quality, setQuality] = useState(80);
  const [danger, setDanger] = useState(25);
  const [stepped, setStepped] = useState(50);
  const [disabled, setDisabled] = useState(false);

  return (
    <SimplePage
      title="Slider with Style API v2"
      screenshotArea={{}}
      settings={
        <Checkbox checked={disabled} onChange={({ detail }) => setDisabled(detail.checked)}>
          disabled
        </Checkbox>
      }
    >
      <div>
        <Container header="Success variant" variant="stacked">
          <SpaceBetween size="xs">
            <Box variant="small">Volume: {volume}%</Box>
            <Slider
              value={volume}
              onChange={({ detail }) => setVolume(detail.value)}
              min={0}
              max={100}
              disabled={disabled}
              classNames={{ root: styles['slider-success'] }}
            />
          </SpaceBetween>
        </Container>
        <Container header="Accent variant" variant="stacked">
          <SpaceBetween size="xs">
            <Box variant="small">Quality: {quality}%</Box>
            <Slider
              value={quality}
              onChange={({ detail }) => setQuality(detail.value)}
              min={0}
              max={100}
              disabled={disabled}
              classNames={{ root: styles['slider-accent'] }}
            />
          </SpaceBetween>
        </Container>
        <Container header="Danger variant" variant="stacked">
          <SpaceBetween size="xs">
            <Box variant="small">Risk tolerance: {danger}%</Box>
            <Slider
              value={danger}
              onChange={({ detail }) => setDanger(detail.value)}
              min={0}
              max={100}
              disabled={disabled}
              classNames={{ root: styles['slider-danger'] }}
            />
          </SpaceBetween>
        </Container>
        <Container header="Stepped with tick marks and reference values" variant="stacked">
          <SpaceBetween size="xs">
            <Box variant="small">Value: {stepped}</Box>
            <Slider
              value={stepped}
              onChange={({ detail }) => setStepped(detail.value)}
              min={0}
              max={100}
              step={10}
              tickMarks={true}
              referenceValues={[25, 75]}
              disabled={disabled}
            />
          </SpaceBetween>
        </Container>
      </div>
    </SimplePage>
  );
}
