/**
 * @jest-environment node
 */
/* eslint-disable header/header */
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { useIsomorphicLayoutEffect } from '..';

function TestComponent() {
  useIsomorphicLayoutEffect(() => {});
  return null;
}

test('should not raise a console error when server rendering', () => {
  const consoleErrorFn = jest.spyOn(console, 'error');
  renderToStaticMarkup(<TestComponent />);
  expect(consoleErrorFn).not.toHaveBeenCalled();
  consoleErrorFn.mockRestore();
});
