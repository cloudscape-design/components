// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import Skeleton from '../../../lib/components/skeleton';
import createWrapper from '../../../lib/components/test-utils/dom';

function renderSkeleton(props: React.ComponentProps<typeof Skeleton> = {}) {
  const { container } = render(<Skeleton {...props} />);
  return createWrapper(container).findSkeleton()!;
}

describe('Skeleton Component', () => {
  it('renders with default props', () => {
    const wrapper = renderSkeleton();
    expect(wrapper.getElement()).toBeInTheDocument();
    expect(wrapper.getElement().tagName).toBe('DIV');
    expect(wrapper.getElement()).toHaveAttribute('aria-hidden', 'true');
  });

  it('applies width prop', () => {
    const wrapper = renderSkeleton({ width: '200px' });
    expect(wrapper.getElement()).toHaveStyle({ inlineSize: '200px' });
  });

  it('applies height prop', () => {
    const wrapper = renderSkeleton({ height: '100px' });
    expect(wrapper.getElement()).toHaveStyle({ blockSize: '100px' });
  });

  it('applies both width and height', () => {
    const wrapper = renderSkeleton({ width: '50%', height: '4em' });
    expect(wrapper.getElement()).toHaveStyle({ inlineSize: '50%', blockSize: '4em' });
  });

  it('does not set inline dimensions when props are not provided', () => {
    const wrapper = renderSkeleton();
    expect(wrapper.getElement().style.inlineSize).toBe('');
    expect(wrapper.getElement().style.blockSize).toBe('');
  });
});
