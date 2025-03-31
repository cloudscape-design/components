// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { render } from '@testing-library/react';

import { usePreventStickyClickScroll } from '../../../lib/components/table/use-prevent-sticky-click-scroll';

import bodyCellStyles from '../../../lib/components/table/body-cell/styles.css.js';

const TestComponent = () => {
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  usePreventStickyClickScroll(wrapperRef);

  return (
    <div ref={wrapperRef} data-testid="wrapper">
      <table data-testid="table-root">
        <tbody>
          <tr>
            <td className={bodyCellStyles['sticky-cell']}>
              <button data-testid="r0c0" type="button">
                r0c0
              </button>
            </td>
            <td>
              <button data-testid="r0c1" type="button">
                r0c1
              </button>
            </td>
            <td>
              <button data-testid="r0c2" type="button">
                r0c2
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

describe('usePreventStickyClickScroll', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not reset scroll when clicking inside non-sticky cell', () => {
    const { getByTestId } = render(<TestComponent />);
    const wrapper = getByTestId('wrapper');
    const cell1 = getByTestId('r0c1');

    // Imitate user scroll before clicking on a cell
    wrapper.scrollLeft = 20;
    wrapper.dispatchEvent(new Event('scroll'));

    // Imitate user click on a non-sticky cell
    cell1.click();

    // Imitate automatic browser scroll
    wrapper.scrollLeft = 0;
    wrapper.dispatchEvent(new Event('scroll'));

    expect(wrapper.scrollLeft).toBe(0);
  });

  it('does reset scroll when clicking inside sticky cell', async () => {
    const { getByTestId } = render(<TestComponent />);
    const wrapper = getByTestId('wrapper');
    const cell0 = getByTestId('r0c0');

    // Imitate user scroll before clicking on a cell
    wrapper.scrollLeft = 20;
    wrapper.dispatchEvent(new Event('scroll'));

    // Imitate user click on a sticky cell
    cell0.click();

    // Imitate automatic browser scroll
    wrapper.scrollLeft = 0;
    wrapper.dispatchEvent(new Event('scroll'));

    expect(wrapper.scrollLeft).toBe(20);

    // Imitate user scroll after timeout has passed
    await new Promise(resolve => setTimeout(resolve, 50));
    wrapper.scrollLeft = 0;
    wrapper.dispatchEvent(new Event('scroll'));

    expect(wrapper.scrollLeft).toBe(0);
  });
});
