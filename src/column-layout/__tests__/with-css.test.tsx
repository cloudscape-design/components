// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';
import ColumnLayout, { ColumnLayoutProps } from '../../../lib/components/column-layout';
import createWrapper from '../../../lib/components/test-utils/dom';
import styles from '../../../lib/components/column-layout/styles.css.js';
import customCssProps from '../../internal/generated/custom-css-properties';

jest.mock('../../../lib/components/internal/hooks/container-queries/use-container-query', () => ({
  useContainerQuery: () => [500, () => {}],
}));

export function renderColumnLayout(props: ColumnLayoutProps = {}) {
  const renderResult = render(<ColumnLayout {...props} />);
  const wrapper = createWrapper(renderResult.container).find(`.${styles['css-grid']}`)!;
  return {
    wrapper,
    getColumnCount: () =>
      parseInt(getComputedStyle(wrapper.getElement()).getPropertyValue(customCssProps.columnLayoutColumnCount)),
  };
}

describe('ColumnLayout (with CSS grid) component', () => {
  it('renders with children', () => {
    const { wrapper, getColumnCount } = renderColumnLayout({
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
    expect(getColumnCount()).toBe(2);
  });

  it('wraps columns if necessary', () => {
    const { getColumnCount } = renderColumnLayout({
      minColumnWidth: 200,
      columns: 4,
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

    expect(getColumnCount()).toBe(2);
  });
});
