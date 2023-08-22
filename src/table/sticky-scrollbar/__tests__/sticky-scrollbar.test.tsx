// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { render } from '@testing-library/react';
import { StickyScrollbar } from '../../../../lib/components/table/sticky-scrollbar';
import { browserScrollbarSize } from '../../../../lib/components/internal/utils/browser-scrollbar-size';
import styles from '../../../../lib/components/table/sticky-scrollbar/styles.css.js';

jest.mock('../../../../lib/components/internal/utils/browser-scrollbar-size');
const browserScrollbarSizeMock = jest.mocked(browserScrollbarSize);

it('adds an offset if the scrollbar is an overlay', () => {
  const tableRef = { current: document.createElement('table') };
  const wrapperRef = { current: document.createElement('div') };

  browserScrollbarSizeMock.mockImplementationOnce(() => ({ height: 0, width: 100 }));
  const { container } = render(<StickyScrollbar tableRef={tableRef} wrapperRef={wrapperRef} />);
  expect(container.querySelector(`.${styles['sticky-scrollbar-offset']}`)).not.toBeNull();
});

it('does not add an offset if the scrollbar occupies space', () => {
  const tableRef = { current: document.createElement('table') };
  const wrapperRef = { current: document.createElement('div') };

  browserScrollbarSizeMock.mockImplementationOnce(() => ({ height: 20, width: 100 }));
  const { container } = render(<StickyScrollbar tableRef={tableRef} wrapperRef={wrapperRef} />);
  expect(container.querySelector(`.${styles['sticky-scrollbar-offset']}`)).toBeNull();
});
