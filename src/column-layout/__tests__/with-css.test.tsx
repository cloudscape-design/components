// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import ColumnLayout, { ColumnLayoutProps } from '../../../lib/components/column-layout';
import createWrapper from '../../../lib/components/test-utils/dom';

import styles from '../../../lib/components/column-layout/flexible-column-layout/styles.css.js';

jest.mock('@cloudscape-design/component-toolkit', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit'),
  useContainerQuery: () => [500, () => {}],
}));

function renderColumnLayout(props: ColumnLayoutProps = {}) {
  const renderResult = render(<ColumnLayout {...props} />);
  const wrapper = createWrapper(renderResult.container).find(`.${styles['css-grid']}`)!;
  return {
    wrapper,
    getGridColumns: () => getComputedStyle(wrapper.getElement()).getPropertyValue('grid-template-columns'),
  };
}

describe('ColumnLayout (with CSS grid) component', () => {
  it('renders with children', () => {
    const { wrapper, getGridColumns } = renderColumnLayout({
      minColumnWidth: 100,
      columns: 2,
      children: (
        <>
          <div />
          <div />
          <div />
          <div />
        </>
      ),
    });

    expect(wrapper.getElement().childElementCount).toBe(4);
    expect(getGridColumns()).toBe('repeat(2, minmax(0, 1fr))');
  });

  it('wraps columns if necessary', () => {
    const { getGridColumns } = renderColumnLayout({
      minColumnWidth: 100,
      columns: 8,
      children: (
        <>
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
        </>
      ),
    });

    expect(getGridColumns()).toBe('repeat(4, minmax(0, 1fr))');
  });

  it('uses flexible layout for more than 4 columns without explicit minColumnWidth', () => {
    const { wrapper, getGridColumns } = renderColumnLayout({
      columns: 5,
      children: (
        <>
          <div />
          <div />
          <div />
          <div />
          <div />
        </>
      ),
    });

    expect(wrapper.getElement().childElementCount).toBe(5);
    expect(getGridColumns()).toBe('repeat(5, minmax(0, 1fr))');
  });
});
