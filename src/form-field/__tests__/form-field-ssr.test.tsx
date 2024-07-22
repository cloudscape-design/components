/**
 * @jest-environment node
 */
/* eslint-disable header/header */
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import FormField from '../../../lib/components/form-field';

import styles from '../../../lib/components/grid/styles.css.js';

test('renders static grid in form field when stretch is true', () => {
  const content = renderToStaticMarkup(
    <FormField stretch={true}>
      <div> input </div>
    </FormField>
  );
  expect(content).toContain(styles['colspan-12']);
});
