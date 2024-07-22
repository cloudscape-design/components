/**
 * @jest-environment node
 */
/* eslint-disable header/header */
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import Grid from '../../../lib/components/grid';

import styles from '../../../lib/components/grid/styles.css.js';

test('renders static grid server-side', () => {
  const content = renderToStaticMarkup(
    <Grid gridDefinition={[{ colspan: 4 }, { colspan: 8 }]}>
      <div>One</div>
      <div>Two</div>
    </Grid>
  );
  expect(content).toContain(styles['colspan-4']);
  expect(content).toContain(styles['colspan-8']);
});

test('does not render responsive grid server-side', () => {
  const content = renderToStaticMarkup(
    <Grid gridDefinition={[{ colspan: { default: 6, xxs: 12 } }, { colspan: { default: 6, xxs: 12 } }]}>
      <div>One</div>
      <div>Two</div>
    </Grid>
  );
  expect(content).not.toContain(styles['colspan-6']);
  expect(content).not.toContain(styles['colspan-12']);
});
