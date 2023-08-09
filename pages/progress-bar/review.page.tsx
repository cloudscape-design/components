// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import ProgressBar, { ProgressBarProps } from '~components/progress-bar';
import SpaceBetween from '~components/space-between';
import Header from '~components/header';
import Button from '~components/button';
import Box from '~components/box';

export default function ProgressBarReview() {
  return (
    <Box padding="l">
      <SpaceBetween size="l">
        <Header variant="h1">Progress bar review</Header>
        <div>
          <Header variant="h2">With percentages (current)</Header>
          <ProgressBarFactory type="percentage" />
        </div>

        <div>
          <Header variant="h2">With ratio (new variant)</Header>
          <ProgressBarFactory type="ratio" />
        </div>
      </SpaceBetween>
    </Box>
  );
}

const ProgressBarFactory = ({ type }: ProgressBarProps) => {
  const [value, setValue] = useState(0);

  return (
    <>
      <ProgressBar
        status="in-progress"
        value={value}
        type={type}
        variant="standalone"
        label={`Progress bar with ${type}`}
      />
      <Button onClick={() => setValue(value + 5)}>Increment</Button>
    </>
  );
};
