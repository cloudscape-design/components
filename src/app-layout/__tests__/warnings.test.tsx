// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';
import AppLayout from '../../../lib/components/app-layout';

let consoleWarnSpy: jest.SpyInstance;
beforeEach(() => {
  consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
});
afterEach(() => {
  consoleWarnSpy?.mockRestore();
});

const noop = () => undefined;

/**
 * This test suite is in a separate file, because it needs a clean messageCache (inside `warnOnce()`).
 * Otherwise, warnings would not appear at the expected time in the test, because they have been issued before.
 */
describe('AppLayout component', () => {
  test('warns when toolsOpen and toolsHide are both set', () => {
    const { rerender } = render(<AppLayout toolsHide={true} toolsOpen={false} onToolsChange={noop} />);
    expect(console.warn).not.toHaveBeenCalled();

    rerender(<AppLayout toolsHide={true} toolsOpen={true} onToolsChange={noop} />);

    expect(console.warn).toHaveBeenCalledTimes(1);
    expect(console.warn).toHaveBeenCalledWith(
      '[AwsUi] [AppLayout] You have enabled both the `toolsOpen` prop and the `toolsHide` prop. This is not supported. Set `toolsOpen` to `false` when you set `toolsHide` to `true`.'
    );
  });
});
