// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { Box, Container, RadioGroup, SelectProps, Timeline } from '~components';

import { i18nStrings, steps } from './common';

// import styles from './styles.scss';

const variantOptions: Array<SelectProps.Option> = [
  { value: 'vertical', label: 'Vertical' },
  { value: 'horizontal', label: 'Horizontal' },
];

export default function TimelinePage() {
  const [direction, setDirection] = useState('vertical');

  return (
    <Box margin="xl">
      <RadioGroup
        value={direction}
        onChange={event => setDirection(event.detail.value)}
        ariaControls="language-settings"
        items={variantOptions as any}
      />
      <br />
      <Container>
        <Timeline id="timeline" variant={direction} steps={steps} i18nStrings={i18nStrings} />
      </Container>
    </Box>
  );
}
