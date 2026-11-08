// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import SegmentedControl, { SegmentedControlProps } from '../../../lib/components/segmented-control';
import createWrapper from '../../../lib/components/test-utils/dom';

import styles from '../../../lib/components/segmented-control/styles.css.js';

const options: SegmentedControlProps.Option[] = [
  { id: 'list', text: 'List' },
  { id: 'cards', text: 'Cards', disabled: true },
  { id: 'table', iconName: 'settings', iconAlt: 'Table' },
];

function renderSegmentedControl(styleClassNames: Record<string, unknown>) {
  const { container } = render(
    <SegmentedControl selectedId="list" options={options} label="View" {...{ styleClassNames }} />
  );
  return { container, wrapper: createWrapper(container).findSegmentedControl()! };
}

describe('SegmentedControl Style API v2', () => {
  test('applies the root, segment and divider slots and forwards select', () => {
    const { container, wrapper } = renderSegmentedControl({
      root: 'r',
      segment: 's',
      divider: 'd',
      select: { trigger: 't' },
    });
    expect(container.querySelector(`.${styles['segment-part']}`)).toHaveClass('r');
    const segments = wrapper.findSegments();
    expect(segments).toHaveLength(3);
    for (const segment of segments) {
      expect(segment.getElement()).toHaveClass('s');
      expect(segment.getElement()).toHaveClass('d');
    }
    expect(wrapper.findSelectedSegment()!.getElement()).toHaveClass('s');
    expect(wrapper.findSegmentById('cards')!.getElement()).toBeDisabled();
    expect(wrapper.findSegmentById('cards')!.getElement()).toHaveClass('s');
    expect(createWrapper(container).findSelect()!.findTrigger().getElement()).toHaveClass('t');
  });

  test('ignores unknown slots', () => {
    const { container } = renderSegmentedControl({ unknown: 'x' });
    expect(container.querySelector('.x')).toBeNull();
  });

  test('does not leak the styleClassNames prop to the DOM', () => {
    const { container } = renderSegmentedControl({ segment: 's' });
    expect(container.querySelector('[styleClassNames]')).toBeNull();
  });
});
