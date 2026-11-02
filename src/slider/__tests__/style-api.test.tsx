// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import Slider from '../../../lib/components/slider';
import createWrapper from '../../../lib/components/test-utils/dom';

import styles from '../../../lib/components/slider/styles.css.js';

function renderSlider(element: React.ReactElement) {
  const { container } = render(element);
  return { container, wrapper: createWrapper(container).findSlider()! };
}

const slots = { root: 'a', handle: 'b', track: 'c', range: 'd' };

describe('Slider Style API v2 (implicit styleClassNames)', () => {
  test('applies styleClassNames to the root and handle slots only', () => {
    const { container, wrapper } = renderSlider(
      <Slider
        value={40}
        min={0}
        max={100}
        step={20}
        tickMarks={true}
        onChange={() => {}}
        {...({ styleClassNames: slots } as any)}
      />
    );

    expect(wrapper.getElement()).toHaveClass('a');
    expect(container.querySelector(`.${styles.thumb}`)).toHaveClass('b');
    expect(container.querySelector('.c')).toBeNull();
    expect(container.querySelector('.d')).toBeNull();
  });

  test('does not leak the styleClassNames prop to the DOM', () => {
    const { container } = renderSlider(
      <Slider value={40} min={0} max={100} onChange={() => {}} {...({ styleClassNames: slots } as any)} />
    );
    expect(container.querySelector('[styleClassNames]')).toBeNull();
  });
});
