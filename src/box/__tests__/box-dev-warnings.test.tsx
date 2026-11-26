// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import Box from '../../../lib/components/box';

jest.mock('@cloudscape-design/component-toolkit/internal', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit/internal'),
  warnOnce: jest.fn(),
}));

beforeEach(() => {
  document.body.classList.remove('awsui-one-theme', 'awsui-visual-refresh');
});

afterEach(() => {
  document.body.classList.remove('awsui-one-theme', 'awsui-visual-refresh');
  (warnOnce as jest.Mock).mockReset();
});

describe('Box dev warnings', () => {
  test('warns when visualAccent is used under Visual Refresh', () => {
    document.body.classList.add('awsui-visual-refresh');

    render(<Box visualAccent={{ color: 'indigo' }} />);

    expect(warnOnce).toHaveBeenCalledTimes(1);
    expect(warnOnce).toHaveBeenCalledWith(
      'Box',
      '`visualAccent` is supported only in One Theme and has no effect under Visual Refresh.'
    );
  });

  test('does not warn when visualAccent is used in One Theme', () => {
    document.body.classList.add('awsui-one-theme');

    render(<Box visualAccent={{ color: 'indigo' }} />);

    expect(warnOnce).not.toHaveBeenCalled();
  });

  test('does not warn when visualAccent is not provided', () => {
    render(<Box />);

    expect(warnOnce).not.toHaveBeenCalled();
  });
});
