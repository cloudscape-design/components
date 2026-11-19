// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { SharedReactContexts } from '../../../../../lib/components/internal/plugins/controllers/shared-react-contexts';

test('returns the same context for the same React and the name', () => {
  const contexts = new SharedReactContexts();
  const first = contexts.createContext(React, 'testing');
  const second = contexts.createContext(React, 'testing');
  expect(first).toBeTruthy();
  expect(second).toBeTruthy();
  expect(first).toBe(second);
});

test('returns different contexts for different names', () => {
  const contexts = new SharedReactContexts();
  const first = contexts.createContext(React, 'testing1');
  const second = contexts.createContext(React, 'testing2');
  expect(first).toBeTruthy();
  expect(second).toBeTruthy();
  expect(first).not.toBe(second);
});

test('returns different contexts for different react instances', () => {
  const firstReact = { createContext: jest.fn().mockReturnValue({}) };
  const secondReact = { createContext: jest.fn().mockReturnValue({}) };
  const contexts = new SharedReactContexts();
  const first = contexts.createContext(firstReact as unknown as typeof React, 'testing');
  const second = contexts.createContext(secondReact as unknown as typeof React, 'testing');
  expect(first).toBeTruthy();
  expect(second).toBeTruthy();
  expect(firstReact.createContext).toHaveBeenCalledTimes(1);
  expect(secondReact.createContext).toHaveBeenCalledTimes(1);
  expect(first).not.toBe(second);
});
