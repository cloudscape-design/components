// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';
import ResponsiveText from '../../../../../lib/components/internal/components/responsive-text';
import { getTextWidth } from '../../../../../lib/components/internal/components/responsive-text/responsive-text-utils';
import { isRtl } from '../../../../../lib/components/internal/direction';

jest.mock('../../../../../lib/components/internal/components/responsive-text/responsive-text-utils', () => ({
  ...jest.requireActual('../../../../../lib/components/internal/components/responsive-text/responsive-text-utils'),
  getTextWidth: jest.fn().mockReturnValue(0),
}));

jest.mock('../../../../../lib/components/internal/direction', () => ({
  isRtl: jest.fn().mockReturnValue(false),
}));

describe('responsive SVG text tests', () => {
  test.each([false, true])('renders full text', rtl => {
    jest.mocked(getTextWidth).mockReturnValueOnce(100);
    (isRtl as jest.Mock).mockReturnValue(rtl);

    const { container } = render(
      <ResponsiveText x={0} y={0} maxWidth={100}>
        Short text
      </ResponsiveText>
    );

    expect(container).toHaveTextContent('Short text');
  });

  test('renders truncated text', () => {
    jest.mocked(getTextWidth).mockReturnValueOnce(101);
    (isRtl as jest.Mock).mockReturnValue(false);

    const { container } = render(
      <ResponsiveText x={0} y={0} maxWidth={100}>
        Long text
      </ResponsiveText>
    );

    expect(container).toHaveTextContent('Long tex…');
  });

  test('renders truncated text RTL', () => {
    jest.mocked(getTextWidth).mockReturnValueOnce(101);
    (isRtl as jest.Mock).mockReturnValue(true);

    const { container } = render(
      <ResponsiveText x={0} y={0} maxWidth={100}>
        Long text
      </ResponsiveText>
    );

    expect(container).toHaveTextContent('ong text…');
  });
});
