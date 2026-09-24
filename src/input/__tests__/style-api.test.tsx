// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import Input from '../../../lib/components/input';
import createWrapper from '../../../lib/components/test-utils/dom';

function renderInput(element: React.ReactElement) {
  const { container } = render(element);
  return { container, wrapper: createWrapper(container).findInput()! };
}

describe('Input Style API v2', () => {
  test('applies styleClassNames to the root, input, label, searchIcon, and clearButton slots', () => {
    const { container, wrapper } = renderInput(
      <Input
        value="query"
        type="search"
        inlineLabelText="Label"
        onChange={() => {}}
        {...({
          styleClassNames: { root: 'a', input: 'b', label: 'c', searchIcon: 'd', clearButton: 'e', unknown: 'f' },
        } as any)}
      />
    );
    expect(wrapper.getElement()).toHaveClass('a');
    expect(wrapper.findNativeInput().getElement()).toHaveClass('b');
    expect(wrapper.findInlineLabel()!.getElement()).toHaveClass('c');
    expect(container.querySelector('.d')).toContainElement(container.querySelector('svg'));
    expect(wrapper.findClearButton()!.getElement()).toHaveClass('e');
    expect(container.querySelector('.f')).toBeNull();
  });

  test('applies the root class to the outermost element without an inline label', () => {
    const { wrapper } = renderInput(
      <Input value="" onChange={() => {}} {...({ styleClassNames: { root: 'a' } } as any)} />
    );
    expect(wrapper.getElement()).toHaveClass('a');
    expect(wrapper.getElement()).toContainElement(wrapper.findNativeInput().getElement());
  });

  test('does not leak the styleClassNames prop to the DOM', () => {
    const { container } = renderInput(
      <Input value="" onChange={() => {}} {...({ styleClassNames: { root: 'a', input: 'b' } } as any)} />
    );
    expect(container.querySelector('[styleClassNames]')).toBeNull();
  });
});
