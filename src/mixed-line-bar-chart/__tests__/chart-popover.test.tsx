// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import createWrapper from '../../../lib/components/test-utils/dom';
import ChartPopoverWrapper from '../../../lib/components/test-utils/dom/internal/chart-popover';
import MixedChartPopover, { MixedChartPopoverProps } from '../../../lib/components/mixed-line-bar-chart/chart-popover';
import { ChartDataTypes } from '../../../lib/components/mixed-line-bar-chart/interfaces';

const dummyRef = { current: null };
function renderChart<T extends ChartDataTypes>(props: Partial<MixedChartPopoverProps<T>>) {
  render(
    <MixedChartPopover
      popoverId={''}
      isOpen={props.isOpen ?? false}
      isPinned={props.isPinned ?? false}
      highlightDetails={props.highlightDetails ?? null}
      onDismiss={props.onDismiss || jest.fn()}
      containerRef={dummyRef}
      trackRef={dummyRef}
      footer={props.footer}
      size="small"
      setPopoverText={() => null}
    />
  );
  const root = createWrapper().findByClassName(ChartPopoverWrapper.rootSelector);
  return root ? new ChartPopoverWrapper(root.getElement()) : null;
}

test('not rendered when no position', () => {
  const wrapper = renderChart({ isOpen: true, highlightDetails: null });

  expect(wrapper).toBeNull();
});

test('not rendered when not open', () => {
  const wrapper = renderChart({
    isOpen: false,
    highlightDetails: { position: '1', details: [] },
  });

  expect(wrapper).toBeNull();
});

test('contains series details', () => {
  const wrapper = renderChart({
    isOpen: true,
    highlightDetails: {
      position: 'Potatoes',
      details: [
        {
          key: 'Series',
          value: '123',
        },
      ],
    },
  });

  expect(wrapper!.findHeader()!.getElement()).toHaveTextContent('Potatoes');
  expect(wrapper!.findContent()!.getElement()).toHaveTextContent('Series123');
});

test('can contain custom footer content', () => {
  const wrapper = renderChart({
    isOpen: true,
    highlightDetails: {
      position: 'Potatoes',
      details: [
        {
          key: 'Series',
          value: '123',
        },
      ],
    },
    footer: 'My custom footer',
  });

  expect(wrapper!.findContent()!.getElement()).toHaveTextContent('My custom footer');
});
