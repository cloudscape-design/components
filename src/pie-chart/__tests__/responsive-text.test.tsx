// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, waitFor } from '@testing-library/react';
import ResponsiveText from '../../../lib/components/pie-chart/responsive-text';
import { renderTextContent } from '../../../lib/components/internal/components/responsive-text/index';
import { isRtl } from '../../..//lib/components/internal/direction';

jest.mock('../../../lib/components/internal/components/responsive-text/index', () => ({
  ...jest.requireActual('../../../lib/components/internal/components/responsive-text/index'),
  renderTextContent: jest.fn(),
}));

jest.mock('../../../lib/components/internal/direction', () => ({
  ...jest.requireActual('../../../lib/components/internal/direction'),
  isRtl: jest.fn().mockReturnValue(false),
}));

afterEach(() => {
  jest.mocked(renderTextContent).mockReset();
  jest.mocked(isRtl).mockReset();
});

test.each([{ rtl: false }, { rtl: true }])('provides rtl="$rtl" to renderTextContent', async ({ rtl }) => {
  jest.mocked(isRtl).mockReturnValue(rtl);

  render(
    <ResponsiveText x={0} y={0} containerBoundaries={null}>
      Text
    </ResponsiveText>
  );

  await waitFor(() => {
    expect(renderTextContent).toHaveBeenCalledTimes(1);
    expect(renderTextContent).toHaveBeenCalledWith(expect.anything(), 'Text', 0, rtl);
  });
});
