/**
 * @jest-environment node
 */
/* eslint-disable header/header */
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import Icon from '../../../lib/components/icon';

import styles from '../../../lib/components/icon/styles.css.js';

test('renders with a normal size when rendering outside the DOM', () => {
  const content = renderToStaticMarkup(<Icon size="inherit" name="settings" />);
  expect(content).toContain(styles['size-normal']);
  expect(content).not.toContain('style=');
});
