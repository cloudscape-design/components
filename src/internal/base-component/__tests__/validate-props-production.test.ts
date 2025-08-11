// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { validateProps } from '../../../../lib/components/internal/base-component/index.js';
import { isDevelopment } from '../../../../lib/components/internal/is-development.js';

jest.mock('../../../../lib/components/internal/is-development', () => ({ isDevelopment: false }));

test('does nothing in production builds', () => {
  expect(isDevelopment).toBe(false);
  expect(() => validateProps('TestComponent', { variant: 'foo' }, ['variant'], {})).not.toThrow();
});
