// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { renderToString } from 'react-dom/server';
import { render } from '@testing-library/react';

import { StickyScrollbar } from '../../../../../lib/components/internal/components/sticky-scrollbar';
import { browserScrollbarSize } from '../../../../../lib/components/internal/utils/browser-scrollbar-size';

import styles from '../../../../../lib/components/internal/components/sticky-scrollbar/styles.css.js';

jest.mock('../../../../../lib/components/internal/utils/browser-scrollbar-size');
const browserScrollbarSizeMock = jest.mocked(browserScrollbarSize);

it('adds an offset if the scrollbar is an overlay', () => {
  const tableRef = { current: document.createElement('table') };
  const wrapperRef = { current: document.createElement('div') };

  browserScrollbarSizeMock.mockImplementation(() => ({ height: 0, width: 100 }));
  const { container } = render(<StickyScrollbar tableRef={tableRef} wrapperRef={wrapperRef} />);
  expect(container.querySelector(`.${styles['sticky-scrollbar-offset']}`)).not.toBeNull();
});

it('adds an offset if the scrollbar occupies space but the table has sticky columns', () => {
  const tableRef = { current: document.createElement('table') };
  const wrapperRef = { current: document.createElement('div') };

  browserScrollbarSizeMock.mockImplementation(() => ({ height: 20, width: 100 }));
  const { container } = render(<StickyScrollbar tableRef={tableRef} wrapperRef={wrapperRef} hasStickyColumns={true} />);
  expect(container.querySelector(`.${styles['sticky-scrollbar-offset']}`)).not.toBeNull();
});

it('does not add an offset if the scrollbar occupies space', () => {
  const tableRef = { current: document.createElement('table') };
  const wrapperRef = { current: document.createElement('div') };

  browserScrollbarSizeMock.mockImplementation(() => ({ height: 20, width: 100 }));
  const { container } = render(<StickyScrollbar tableRef={tableRef} wrapperRef={wrapperRef} />);
  expect(container.querySelector(`.${styles['sticky-scrollbar-offset']}`)).toBeNull();
});

it('hydrates server-rendered markup without a mismatch and removes the offset if the scrollbar occupies space', () => {
  const tableRef = { current: document.createElement('table') };
  const wrapperRef = { current: document.createElement('div') };
  const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

  try {
    // The server can't measure the scrollbar, so it renders the overlay scrollbar markup.
    browserScrollbarSizeMock.mockImplementation(() => ({ height: 0, width: 0 }));
    const container = document.createElement('div');
    const serverDocument = new DOMParser().parseFromString(
      renderToString(<StickyScrollbar tableRef={tableRef} wrapperRef={wrapperRef} />),
      'text/html'
    );
    container.append(...Array.from(serverDocument.body.childNodes));
    document.body.appendChild(container);
    expect(container.querySelector(`.${styles['sticky-scrollbar-offset']}`)).not.toBeNull();

    // The client has classic scrollbars.
    browserScrollbarSizeMock.mockImplementation(() => ({ height: 20, width: 100 }));
    render(<StickyScrollbar tableRef={tableRef} wrapperRef={wrapperRef} />, { container, hydrate: true });

    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(container.querySelector(`.${styles['sticky-scrollbar-offset']}`)).toBeNull();
  } finally {
    consoleErrorSpy.mockRestore();
  }
});
