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

  test('assigns data-testid to the columns', () => {
    const wrapper = renderGrid({
      gridDefinition: [{ testId: 'column-1' }, { testId: 'column-2' }],
      children: (
        <>
          <div>Column 1</div>
          <div>Column 2</div>
        </>
      ),
    });
    const [firstColumn, secondColumn] = wrapper
      .findAll(`.${styles['grid-column']}`)
      .map(columnWrapper => columnWrapper.getElement()!);

    expect(firstColumn).toHaveAttribute('data-testid', 'column-1');
    expect(secondColumn).toHaveAttribute('data-testid', 'column-2');
  });

  test('findColumn returns the correct column', () => {
    const wrapper = renderGrid({
      children: (
        <>
          <div>Column 1</div>
          <div>Column 2</div>
        </>
      ),
    });

    const column = wrapper.findColumn(2)!.getElement();
    expect(column).toHaveTextContent('Column 2');
  });

  test('findColumnByTestId returns the column with test id', () => {
    const wrapper = renderGrid({
      gridDefinition: [{ testId: 'column-1' }, { testId: 'column-2' }],
      children: (
        <>
          <div>Column 1</div>
          <div>Column 2</div>
        </>
      ),
    });

    const column = wrapper.findColumnByTestId('column-2')!.getElement();
    expect(column).toHaveTextContent('Column 2');
  });

  test('findColumnByTestId returns the column with test id, even if test id contains a quote character', () => {
    const wrapper = renderGrid({
      gridDefinition: [{ testId: '"column-test-id"' }],
      children: <div>Test column</div>,
    });

    const column = wrapper.findColumnByTestId('"column-test-id"')!.getElement();
    expect(column).toHaveTextContent('Test column');
  });
});
