// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import ActionCard from '../../../lib/components/action-card';

jest.mock('@cloudscape-design/component-toolkit/internal', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit/internal'),
  warnOnce: jest.fn(),
}));

afterEach(() => {
  (warnOnce as jest.Mock).mockReset();
});

describe('ActionCard dev warnings', () => {
  test('warns when neither header nor ariaLabel is provided', () => {
    render(<ActionCard />);
    expect(warnOnce).toHaveBeenCalledTimes(1);
    expect(warnOnce).toHaveBeenCalledWith(
      'ActionCard',
      'An accessible name is required. Provide either a `header` or an `ariaLabel` prop so the action card has a meaningful label for screen reader users.'
    );
  });

  test('does not warn when header is provided', () => {
    render(<ActionCard header="My card" />);
    expect(warnOnce).not.toHaveBeenCalled();
  });

  test('does not warn when ariaLabel is provided', () => {
    render(<ActionCard ariaLabel="My card" />);
    expect(warnOnce).not.toHaveBeenCalled();
  });

  test('does not warn when both header and ariaLabel are provided', () => {
    render(<ActionCard header="My card" ariaLabel="My card label" />);
    expect(warnOnce).not.toHaveBeenCalled();
  });
});
