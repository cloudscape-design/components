// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { ButtonGroupProps } from '../../../lib/components/button-group';
import InternalButtonGroup from '../../../lib/components/button-group/internal';
import styles from '../../../lib/components/button-group/styles.selectors.js';

const items: ButtonGroupProps.ItemOrGroup[] = [
  { id: 'item1', text: 'Item 1' },
  { id: 'item2', text: 'Item 2' },
  { id: 'item3', text: 'Item 3' },
  { id: 'item4', text: 'Item 4' },
  { id: 'item5', text: 'Item 5' },
  { id: 'item6', text: 'Item 6' },
];

describe('InternalButtonGroup Component', () => {
  it('focuses the correct item using imperative handle', () => {
    const TestComponent = () => {
      const ref = useRef<ButtonGroupProps.Ref>(null);

      return (
        <div>
          <button onClick={() => ref.current?.focus('item2')}>Focus Item 2</button>
          <InternalButtonGroup ref={ref} items={items} limit={5} />
        </div>
      );
    };

    render(<TestComponent />);

    fireEvent.click(screen.getByText('Focus Item 2'));
    const button = screen.getByTestId('item2');
    expect(button).toHaveFocus();
  });

  it('focuses on the more items', () => {
    const TestComponent = () => {
      const ref = useRef<ButtonGroupProps.Ref>(null);

      return (
        <div>
          <button onClick={() => ref.current?.focus('item6')}>Focus Item 6</button>
          <InternalButtonGroup ref={ref} items={items} limit={2} />
        </div>
      );
    };

    const { container } = render(<TestComponent />);
    fireEvent.click(screen.getByText('Focus Item 6'));
    const button = container.querySelector(`.${styles['more-button']} button`);
    expect(button).toHaveFocus();
  });
});
