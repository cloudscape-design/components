// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import createWrapper from '../../../lib/components/test-utils/dom';
import { SimpleTooltip } from '../simple-tooltip';

describe('SimpleTooltip', () => {
  it('renders children correctly', () => {
    const { container } = render(
      <SimpleTooltip content="Tooltip text">
        <button>Hover me</button>
      </SimpleTooltip>
    );

    const wrapper = createWrapper(container);
    expect(wrapper.findButton()!.getElement()).toHaveTextContent('Hover me');
  });

  it('renders tooltip content when hovered', () => {
    const { container } = render(
      <SimpleTooltip content="Tooltip text">
        <button>Hover me</button>
      </SimpleTooltip>
    );

    const wrapper = createWrapper(container);
    expect(wrapper.getElement()).toHaveTextContent('Tooltip text');
  });

  it('handles React node content', () => {
    const { container } = render(
      <SimpleTooltip content={<strong>Bold tooltip</strong>}>
        <button>Hover me</button>
      </SimpleTooltip>
    );

    const wrapper = createWrapper(container);
    expect(wrapper.getElement()).toHaveTextContent('Bold tooltip');
  });

  it('supports all positions', () => {
    const positions: Array<'top' | 'right' | 'bottom' | 'left'> = ['top', 'right', 'bottom', 'left'];

    positions.forEach(position => {
      const { container } = render(
        <SimpleTooltip content="Tooltip text" position={position}>
          <button>Hover me</button>
        </SimpleTooltip>
      );

      const wrapper = createWrapper(container);
      expect(wrapper.getElement()).toHaveTextContent('Tooltip text');
    });
  });
});
