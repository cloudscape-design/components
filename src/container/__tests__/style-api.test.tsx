// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import Container, { ContainerProps } from '../../../lib/components/container';
import createWrapper from '../../../lib/components/test-utils/dom';

function renderContainer(props: ContainerProps & { styleClassNames?: Record<string, string> } = {}) {
  const { container } = render(<Container {...props}>Content</Container>);
  return { container, wrapper: createWrapper(container).findContainer()! };
}

const styleClassNames = { root: 'a', header: 'b', footer: 'c', unknown: 'd' };

describe('Container Style API v2', () => {
  test('applies each slot class to its element and ignores unknown keys', () => {
    const { container, wrapper } = renderContainer({ header: 'Header', footer: 'Footer', styleClassNames });
    expect(wrapper.getElement()).toHaveClass('a');
    expect(wrapper.findHeader()!.getElement()).toHaveClass('b');
    expect(wrapper.findFooter()!.getElement()).toHaveClass('c');
    expect(container.querySelectorAll('.a, .b, .c')).toHaveLength(3);
    expect(container.querySelector('.d')).toBeNull();
  });

  test('applies the root class in the stacked variant and with media', () => {
    const { container, wrapper } = renderContainer({
      variant: 'stacked',
      media: { content: <img alt="" /> },
      styleClassNames,
    });
    expect(wrapper.getElement()).toHaveClass('a');
    expect(container.querySelectorAll('.a')).toHaveLength(1);
  });

  test('does not leak the styleClassNames prop to the DOM', () => {
    const { container } = renderContainer({ header: 'Header', footer: 'Footer', styleClassNames });
    expect(container.querySelector('[styleClassNames]')).toBeNull();
  });
});
