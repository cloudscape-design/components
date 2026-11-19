// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import createWrapper from '../../../lib/components/test-utils/dom';
import Toggle from '../../../lib/components/toggle';

function renderToggle(element: React.ReactElement) {
  const { container } = render(element);
  return { container, wrapper: createWrapper(container).findToggle()! };
}

describe('Toggle Style API v2', () => {
  test('applies styleClassNames to the control slot', () => {
    const { container, wrapper } = renderToggle(
      <Toggle checked={false} description="Description" {...{ styleClassNames: { control: 'a', unknown: 'b' } }}>
        Label
      </Toggle>
    );
    expect(wrapper.findNativeInput().getElement().parentElement).toHaveClass('a');
    expect(container.querySelector('.b')).toBeNull();
  });

  test('does not leak the styleClassNames prop to the DOM', () => {
    const { container } = renderToggle(
      <Toggle checked={false} {...{ styleClassNames: { control: 'a' } }}>
        Label
      </Toggle>
    );
    expect(container.querySelector('[styleClassNames]')).toBeNull();
  });
});
