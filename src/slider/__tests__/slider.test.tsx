// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';
import SliderWrapper from '../../../lib/components/test-utils/dom/slider';
import createWrapper from '../../../lib/components/test-utils/dom';
import Slider, { SliderProps } from '../../../lib/components/slider';
import styles from '../../../lib/components/slider/styles.css.js';

const renderSlider = (sliderProps: SliderProps): SliderWrapper => {
  const { container } = render(<Slider {...sliderProps} />);
  return createWrapper(container).findSlider()!;
};

describe('Slider value', () => {
  test('Input has correct value', () => {
    const wrapper = renderSlider({ min: 0, max: 100, value: 50 });
    const input = wrapper.getNativeInput()?.getElement();

    expect(input).toHaveAttribute('value', '50');
  });

  test('Range clamps at 100% if value is greater than max', () => {
    const wrapper = renderSlider({ min: 0, max: 100, value: 150 });
    const range = wrapper.findByClassName(styles['slider-range'])?.getElement();

    expect(range).toHaveStyle('width: 100%');
  });

  test('Range clamps at 0% if value is less than min', () => {
    const wrapper = renderSlider({ min: 0, max: 100, value: -10 });
    const range = wrapper.findByClassName(styles['slider-range'])?.getElement();

    expect(range).toHaveStyle('width: 0%');
  });
});

describe('Slider labels', () => {
  test('Renders correct number of reference values', () => {
    const wrapper = renderSlider({ min: 0, max: 100, value: 50, referenceValues: [25, 50, 75] });
    const labels = wrapper.findAllByClassName(styles['labels-reference']);

    expect(labels).toHaveLength(3);
  });

  test('Renders a maximum of 9 labels', () => {
    const wrapper = renderSlider({
      min: 0,
      max: 100,
      value: 50,
      referenceValues: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95],
    });
    const labels = wrapper.findAllByClassName(styles['labels-reference']);

    expect(labels).toHaveLength(9);
  });

  test('Does not render labels that are too close together', () => {
    const wrapper = renderSlider({
      min: 0,
      max: 100,
      value: 50,
      referenceValues: [50, 51],
    });
    const labels = wrapper.findAllByClassName(styles['labels-reference']);

    expect(labels).toHaveLength(1);
    expect(labels[0].getElement()).toHaveTextContent('50');
    expect(labels[0].getElement()).not.toHaveTextContent('51');
  });

  test('Renders correctly formatted label', () => {
    const wrapper = renderSlider({
      min: 0,
      max: 100,
      value: 50,
      referenceValues: [50],
      valueFormatter: () => `Value`,
    });
    const labels = wrapper.findAllByClassName(styles['labels-reference']);

    expect(labels).toHaveLength(1);
    expect(labels[0].getElement()).toHaveTextContent('Value');
    expect(labels[0].getElement()).not.toHaveTextContent('50');
  });
});

describe('Slider a11y', () => {
  test('Renders correct aria label', () => {
    const wrapper = renderSlider({ min: 0, max: 100, value: 50, ariaLabel: 'aria label' });
    const input = wrapper.getNativeInput()?.getElement();

    expect(input).toHaveAttribute('aria-label', 'aria label');
  });

  test('Renders correct arialabelledby', () => {
    const wrapper = renderSlider({ min: 0, max: 100, value: 50, ariaLabelledby: 'testid' });
    const input = wrapper.getNativeInput()?.getElement();

    expect(input).toHaveAttribute('aria-labelledby', 'testid');
  });
});
