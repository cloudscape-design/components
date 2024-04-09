// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { KeyCode } from '@cloudscape-design/test-utils-core/utils';
import { renderSegmentedControl } from './utils';
import { SegmentedControlWrapper } from '../../../lib/components/test-utils/dom';
import SegmentedControl, { SegmentedControlProps } from '../../../lib/components/segmented-control';
import styles from '../../../lib/components/segmented-control/styles.css.js';

const defaultOptions: SegmentedControlProps.Option[] = [
  { text: 'Segment-1', iconName: 'settings', id: 'seg-1' },
  { text: '', iconName: 'settings', iconAlt: 'Icon for Segment-2', id: 'seg-2' },
  { text: 'Segment-3', id: 'seg-3', disabled: true },
  { text: 'Segment-4', iconName: 'settings', id: 'seg-4' },
];

const getSegmentWrapper = function (wrapper: SegmentedControlWrapper, segmentIndex: number) {
  return wrapper.findSegments()[segmentIndex];
};

test('renders segments', () => {
  const { segmentedControlWrapper } = renderSegmentedControl(
    <SegmentedControl selectedId="seg-1" options={defaultOptions} />
  );
  expect(segmentedControlWrapper.findSegments()).toHaveLength(4);
});

describe('Segmented-Control Properties', () => {
  test('does not have a label attribute by default without being set', () => {
    const { segmentedControlWrapper } = renderSegmentedControl(
      <SegmentedControl selectedId="seg-1" options={defaultOptions} />
    );
    expect(segmentedControlWrapper.findByClassName(styles['segment-part'])!.getElement()).not.toHaveAttribute(
      'aria-label'
    );
  });

  test('does have a label attribute when it is set', () => {
    const { segmentedControlWrapper } = renderSegmentedControl(
      <SegmentedControl selectedId="seg-1" options={defaultOptions} label="Some label" />
    );
    expect(segmentedControlWrapper.findByClassName(styles['segment-part'])!.getElement()).toHaveAttribute(
      'aria-label',
      'Some label'
    );
  });

  test('does not have ariaLabelledby attribute by default without being set', () => {
    const { segmentedControlWrapper } = renderSegmentedControl(
      <SegmentedControl selectedId="seg-1" options={defaultOptions} />
    );
    expect(segmentedControlWrapper.findByClassName(styles['segment-part'])!.getElement()).not.toHaveAttribute(
      'aria-labelledby'
    );
  });

  test('does have a ariaLabelledby attribute after it is set', () => {
    const { segmentedControlWrapper } = renderSegmentedControl(
      <SegmentedControl selectedId="seg-1" options={defaultOptions} ariaLabelledby="Some ariaLabelledby" />
    );
    expect(segmentedControlWrapper.findByClassName(styles['segment-part'])!.getElement()).toHaveAttribute(
      'aria-labelledby',
      'Some ariaLabelledby'
    );
  });
});

describe('Invidual Segment Properties', () => {
  test('each segment has button property attribute', () => {
    const { segmentedControlWrapper } = renderSegmentedControl(
      <SegmentedControl selectedId="seg-1" options={defaultOptions} />
    );
    expect(getSegmentWrapper(segmentedControlWrapper, 0).getElement()).toHaveAttribute('type', 'button');
  });

  test('each segment is not disabled by default', () => {
    const { segmentedControlWrapper } = renderSegmentedControl(
      <SegmentedControl selectedId="seg-1" options={defaultOptions} />
    );
    expect(getSegmentWrapper(segmentedControlWrapper, 0).getElement()).not.toHaveAttribute('disabled');
  });

  test('each segment is disabled if disabled is set as true', () => {
    const { segmentedControlWrapper } = renderSegmentedControl(
      <SegmentedControl selectedId="seg-1" options={defaultOptions} />
    );
    expect(getSegmentWrapper(segmentedControlWrapper, 2).getElement()).toHaveAttribute('disabled');
  });
});

describe('icon property', () => {
  test('renders icon when iconName is provided', () => {
    const { segmentedControlWrapper } = renderSegmentedControl(
      <SegmentedControl selectedId="seg-1" options={defaultOptions} />
    );
    expect(getSegmentWrapper(segmentedControlWrapper, 1).findIcon()).not.toBeNull();
  });
});

describe('Segment disabled property', () => {
  test('does not fire onChange event when disabled', () => {
    const onChange = jest.fn();
    const { segmentedControlWrapper } = renderSegmentedControl(
      <SegmentedControl selectedId="seg-1" options={defaultOptions} onChange={onChange} />
    );
    getSegmentWrapper(segmentedControlWrapper, 2).getElement().click();
    expect(onChange).not.toHaveBeenCalled();
  });

  test('does fire onChange event when not disabled', () => {
    const onChange = jest.fn();
    const { segmentedControlWrapper } = renderSegmentedControl(
      <SegmentedControl selectedId="seg-2" options={defaultOptions} onChange={onChange} />
    );
    getSegmentWrapper(segmentedControlWrapper, 0).getElement().click();
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ detail: { selectedId: 'seg-1' } }));
  });
});

describe('selected property', () => {
  test('finds the selected segment', () => {
    const { segmentedControlWrapper } = renderSegmentedControl(
      <SegmentedControl selectedId="seg-1" options={defaultOptions} />
    );
    expect(segmentedControlWrapper.findSelectedSegment()!.getElement()).toHaveTextContent('Segment-1');
  });

  test('does not fire onChange event when selected', () => {
    const onChange = jest.fn();
    const { segmentedControlWrapper } = renderSegmentedControl(
      <SegmentedControl selectedId="seg-1" options={defaultOptions} onChange={onChange} />
    );
    getSegmentWrapper(segmentedControlWrapper, 0).getElement().click();
    expect(onChange).not.toHaveBeenCalled();
  });

  test('does fire onChange event when not selected', () => {
    const onChange = jest.fn();
    const { segmentedControlWrapper } = renderSegmentedControl(
      <SegmentedControl selectedId="seg-2" options={defaultOptions} onChange={onChange} />
    );
    getSegmentWrapper(segmentedControlWrapper, 0).getElement().click();
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ detail: { selectedId: 'seg-1' } }));
  });

  test('does change focus when left/right arrow key is pressed', () => {
    const { segmentedControlWrapper } = renderSegmentedControl(
      <SegmentedControl selectedId="seg-1" options={defaultOptions} />
    );

    getSegmentWrapper(segmentedControlWrapper, 0).getElement().focus();
    getSegmentWrapper(segmentedControlWrapper, 0).keydown(KeyCode.right);
    expect(getSegmentWrapper(segmentedControlWrapper, 1).getElement()).toHaveFocus();
    getSegmentWrapper(segmentedControlWrapper, 1).keydown(KeyCode.right);
    expect(getSegmentWrapper(segmentedControlWrapper, 3).getElement()).toHaveFocus();
    getSegmentWrapper(segmentedControlWrapper, 3).keydown(KeyCode.left);
    expect(getSegmentWrapper(segmentedControlWrapper, 1).getElement()).toHaveFocus();
  });
});
