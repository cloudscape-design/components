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

const slots = { track: 'a', range: 'b', handle: 'c', unknown: 'd' };

describe('Slider Style API v2 (implicit styleClassNames)', () => {
  test('applies styleClassNames to the track, range, and handle slots', () => {
    const { container } = renderSlider(
      <Slider value={40} min={0} max={100} onChange={() => {}} {...({ styleClassNames: slots } as any)} />
    );

    expect(container.querySelector(`.${styles['slider-track']}`)).toHaveClass('a');
    expect(container.querySelector(`.${styles['slider-range']}`)).toHaveClass('b');
    expect(container.querySelector(`.${styles.thumb}`)).toHaveClass('c');
    expect(container.querySelector('.d')).toBeNull();
  });

  test('applies the range slot to filled tick marks and the track slot to the remaining ones', () => {
    const { container } = renderSlider(
      <Slider
        value={100}
        min={0}
        max={100}
        step={50}
        tickMarks={true}
        onChange={() => {}}
        {...({ styleClassNames: slots } as any)}
      />
    );

    const ticks = Array.from(container.querySelectorAll(`.${styles.tick}`));
    expect(ticks.length).toBeGreaterThan(0);
    expect(
      ticks.filter(tick => tick.classList.contains(styles.filled)).every(tick => tick.classList.contains('b'))
    ).toBe(true);
    expect(
      ticks.filter(tick => !tick.classList.contains(styles.filled)).every(tick => tick.classList.contains('a'))
    ).toBe(true);
  });

  test('does not leak the styleClassNames prop to the DOM', () => {
    const { container } = renderSlider(
      <Slider value={40} min={0} max={100} onChange={() => {}} {...({ styleClassNames: slots } as any)} />
    );
    expect(container.querySelector('[styleClassNames]')).toBeNull();
  });
});
