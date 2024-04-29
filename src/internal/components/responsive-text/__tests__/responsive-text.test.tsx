// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';
import ResponsiveText from '../../../../../lib/components/internal/components/responsive-text';
import { getTextWidth } from '../../../../../lib/components/internal/components/responsive-text/responsive-text-utils';
import { getIsRtl } from '../../../../../lib/components/internal/direction';

jest.mock('../../../../../lib/components/internal/components/responsive-text/responsive-text-utils', () => ({
  ...jest.requireActual('../../../../../lib/components/internal/components/responsive-text/responsive-text-utils'),
  getTextWidth: jest.fn().mockReturnValue(0),
}));

jest.mock('../../../../../lib/components/internal/direction', () => ({
  ...jest.requireActual('../../../../../lib/components/internal/direction'),
  isRtl: jest.fn().mockReturnValue(false),
}));

describe('responsive SVG text tests', () => {
  test.each([{ rtl: false }, { rtl: true }])('renders full text, rtl="$rtl"', ({ rtl }) => {
    jest.mocked(getTextWidth).mockReturnValueOnce(100);
    jest.mocked(getIsRtl).mockReturnValue(rtl);

    const { container } = render(
      <ResponsiveText x={0} y={0} maxWidth={100}>
        Short text
      </ResponsiveText>
    );

    expect(container).toHaveTextContent('Short text');
  });

  test('renders truncated text', () => {
    jest.mocked(getTextWidth).mockReturnValueOnce(101);
    jest.mocked(getIsRtl).mockReturnValue(false);

    const { container } = render(
      <ResponsiveText x={0} y={0} maxWidth={100}>
        Long text
      </ResponsiveText>
    );

    expect(container).toHaveTextContent('Long tex…');
  });

  test('renders truncated text RTL', () => {
    jest.mocked(getTextWidth).mockReturnValueOnce(101);
    jest.mocked(getIsRtl).mockReturnValue(true);

    const { container } = render(
      <ResponsiveText x={0} y={0} maxWidth={100}>
        Long text
      </ResponsiveText>
    );

    expect(container).toHaveTextContent('ong text…');
  });
});
