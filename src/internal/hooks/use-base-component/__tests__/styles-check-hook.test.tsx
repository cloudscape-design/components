// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import { render, waitFor } from '@testing-library/react';

import { useMissingStylesCheck } from '../../../../../lib/components/internal/hooks/use-base-component/styles-check';

function Test() {
  const ref = useRef<HTMLDivElement>(null);
  useMissingStylesCheck(ref);
  return <div></div>;
}

let consoleMock: jest.SpyInstance;
beforeEach(() => {
  globalThis.requestIdleCallback = cb => setTimeout(cb, 0);
  consoleMock = jest.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => {
  jest.restoreAllMocks();
});

test('emits style check error only once', async () => {
  const { rerender } = render(<Test key={1} />);

  await waitFor(
    () => {
      expect(consoleMock).toHaveBeenCalledTimes(1);
      expect(consoleMock).toHaveBeenCalledWith(expect.stringContaining('Missing AWS-UI CSS'));
    },
    { timeout: 2000 }
  );

  consoleMock.mockClear();
  rerender(<Test key={2} />);

  await new Promise(resolve => setTimeout(resolve, 1100));
  expect(consoleMock).toHaveBeenCalledTimes(0);
});
