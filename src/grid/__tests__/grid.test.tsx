// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import Grid, { GridProps } from '../../../lib/components/grid';
import createWrapper from '../../../lib/components/test-utils/dom';

import styles from '../../../lib/components/grid/styles.css.js';

function renderGrid(props: GridProps = {}) {
  const renderResult = render(<Grid {...props} />);
  return createWrapper(renderResult.container).findGrid()!;
}

function renderColumnInGrid(props: GridProps = {}) {
  const renderResult = render(
    <Grid {...props}>
      <div>One</div>
    </Grid>
  );
  return createWrapper(renderResult.container).findGrid()!.findColumn(1)!;
}

describe('Grid component', () => {
  test('has gutters by default', () => {
    const wrapper = renderGrid();
    expect(wrapper.getElement()).not.toHaveClass(styles['no-gutters']);
  });

  test('disables gutters when gutters=false', () => {
    const wrapper = renderGrid({ disableGutters: true });
    expect(wrapper.getElement()).toHaveClass(styles['no-gutters']);
  });

  test('does not arrange columns if a column definition is not provided', () => {
    // Select all classes that set colspan for any breakpoint.
    const colspanClasses = Object.entries(styles)
      .filter(([src]) => src.includes('colspan-'))
      .map(entry => entry[1]);

    const columnWrapper = renderColumnInGrid({ gridDefinition: [] });
    expect(columnWrapper.getElement()).not.toHaveClass(...colspanClasses);
  });

  test('ignores falsy values provided in children', () => {
    const wrapper = renderGrid({
      gridDefinition: [{ colspan: 12 }, { colspan: 12 }],
      children: [false, null, undefined, <div key={1}>one</div>, <div key={2}>two</div>],
    });
    expect(wrapper.getElement().childElementCount).toBe(2);
  });
});
