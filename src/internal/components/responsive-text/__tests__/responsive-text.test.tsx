// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';
import ResponsiveText from '../../../../../lib/components/internal/components/responsive-text';
import { getTextWidth } from '../../../../../lib/components/internal/components/responsive-text/responsive-text-utils';

jest.mock('../../../../../lib/components/internal/components/responsive-text/responsive-text-utils', () => ({
  ...jest.requireActual('../../../../../lib/components/internal/components/responsive-text/responsive-text-utils'),
  getTextWidth: jest.fn().mockReturnValue(0),
}));

describe('responsive SVG text tests', () => {
  test('renders full text', () => {
    jest.mocked(getTextWidth).mockReturnValueOnce(100);

    const { container } = render(
      <ResponsiveText x={0} y={0} maxWidth={100}>
        Short text
      </ResponsiveText>
    );

    expect(container).toHaveTextContent('Short text');
  });

  test('renders truncated text', () => {
    jest.mocked(getTextWidth).mockReturnValueOnce(101);

    const { container } = render(
      <ResponsiveText x={0} y={0} maxWidth={100}>
        Long text
      </ResponsiveText>
    );

    expect(container).toHaveTextContent('Long tex…');
  });
});
