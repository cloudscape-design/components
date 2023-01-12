// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';
import InternalContainer from '../../../lib/components/container/internal';
import { AppLayoutContext } from '../../../lib/components/internal/context/app-layout-context';

jest.mock('../../../lib/components/container/use-sticky-header', () => ({
  useStickyHeader: () => ({ isSticky: true }),
}));

const defaultContext = { stickyOffsetTop: 0, stickyOffsetBottom: 0, hasBreadcrumbs: false };

beforeEach(() => {
  jest.resetAllMocks();
});

test('should report sticky background in full-page variant', () => {
  const setHasStickyBackground = jest.fn();
  const { rerender } = render(
    <AppLayoutContext.Provider value={{ ...defaultContext, setHasStickyBackground }}>
      <InternalContainer variant="full-page">test content</InternalContainer>
    </AppLayoutContext.Provider>
  );
  expect(setHasStickyBackground).toHaveBeenCalledWith(true);
  setHasStickyBackground.mockReset();
  rerender(<></>);
  expect(setHasStickyBackground).toHaveBeenCalledWith(false);
});

test('should not report sticky state in default variant', () => {
  const setHasStickyBackground = jest.fn();
  const { rerender } = render(
    <AppLayoutContext.Provider value={{ ...defaultContext, setHasStickyBackground }}>
      <InternalContainer variant="default">test content</InternalContainer>
    </AppLayoutContext.Provider>
  );
  expect(setHasStickyBackground).not.toHaveBeenCalled();
  rerender(<></>);
  expect(setHasStickyBackground).not.toHaveBeenCalled();
});
