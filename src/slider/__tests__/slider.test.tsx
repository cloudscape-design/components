// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { screen, render, act, fireEvent } from '@testing-library/react';

import SliderWrapper from '../../../lib/components/test-utils/dom/slider';
import createWrapper, { ElementWrapper } from '../../../lib/components/test-utils/dom';

import Slider, { SliderProps } from '../../../lib/components/slider';
import { warnOnce } from '@cloudscape-design/component-toolkit/internal';
import styles from '../../../lib/components/slider/styles.css.js';
import customCssProps from '../../../lib/components/internal/generated/custom-css-properties';
import TestI18nProvider from '../../../lib/components/i18n/testing';

jest.mock('@cloudscape-design/component-toolkit/internal', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit/internal'),
  warnOnce: jest.fn(),
}));

afterEach(() => {
  (warnOnce as jest.Mock).mockReset();
});

class SliderInternalWrapper extends SliderWrapper {
  findRange(): ElementWrapper<HTMLDivElement> {
    return this.findByClassName(styles['slider-range'])!;
  }

  findReferenceLabels(): ElementWrapper<HTMLSpanElement>[] {
    return this.findAllByClassName(styles['labels-reference'])!;
  }
}

const renderSlider = (sliderProps: SliderProps): SliderInternalWrapper => {
  const { container } = render(<Slider {...sliderProps} />);
  return new SliderInternalWrapper(container);
};

describe('Slider value', () => {
  test('Input has correct default value', () => {
    const wrapper = renderSlider({ min: 0, max: 100 });

    expect(wrapper.getInputValue()!).toBe('50');
  });

  test('Input has correct value', () => {
    const wrapper = renderSlider({ min: 0, max: 100, value: 50 });

    expect(wrapper.getInputValue()!).toBe('50');
  });

  test('Range clamps at 100% if value is greater than max', () => {
    const wrapper = renderSlider({ min: 0, max: 100, value: 150 });
    const rangeInlineSize = wrapper
      .findRange()
      .getElement()
      .style.getPropertyValue(customCssProps.sliderRangeInlineSize);

    expect(rangeInlineSize).toBe('100%');
  });

  test('Range clamps at 0% if value is less than min', () => {
    const wrapper = renderSlider({ min: 0, max: 100, value: -10 });
    const rangeInlineSize = wrapper
      .findRange()
      .getElement()
      .style.getPropertyValue(customCssProps.sliderRangeInlineSize);

    expect(rangeInlineSize).toBe('0%');
  });

  test('Shows warning when min is greater than max', () => {
    renderSlider({
      min: 0,
      max: -10,
    });

    expect(warnOnce).toHaveBeenCalledTimes(1);
    expect(warnOnce).toHaveBeenCalledWith('Slider', 'The min value cannot be greater than the max value.');
  });

  test('Shows warning when step is greater than max - min', () => {
    renderSlider({
      min: 0,
      max: 10,
      step: 50,
    });

    expect(warnOnce).toHaveBeenCalledTimes(1);
    expect(warnOnce).toHaveBeenCalledWith(
      'Slider',
      'The step value cannot be greater than the difference between the min and max.'
    );
  });

  test('Has correct value and shows warning when value is not a multiple of the step', () => {
    const wrapper = renderSlider({ min: 0, max: 100, value: 50, step: 30 });

    expect(wrapper.getInputValue()!).toBe('60');
    expect(warnOnce).toHaveBeenCalledTimes(1);
    expect(warnOnce).toHaveBeenCalledWith(
      'Slider',
      'Slider value must be a multiple of the step. The value will round to the nearest step value.'
    );
  });
});

describe('Slider labels', () => {
  test('Renders correct number of reference values', () => {
    const wrapper = renderSlider({ min: 0, max: 100, value: 50, referenceValues: [25, 50, 75] });

    expect(wrapper.findReferenceLabels()).toHaveLength(3);
  });

  test('Renders negative reference values correctly', () => {
    const wrapper = renderSlider({ min: -10, max: 10, value: 0, referenceValues: [-7, 7] });

    expect(wrapper.findReferenceLabels()).toHaveLength(2);
  });

  test('Renders a maximum of 9 labels', () => {
    const wrapper = renderSlider({
      min: 0,
      max: 100,
      value: 50,
      referenceValues: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95],
    });

    expect(wrapper.findReferenceLabels()).toHaveLength(9);
  });

  test('Renders correct order of labels in unordered list', () => {
    const wrapper = renderSlider({
      min: 0,
      max: 10,
      value: 5,
      referenceValues: [7, 5, 3],
    });

    // Each reference label is assigned a column in the grid layout. This column
    // represents where it will sit on the slider line, so order of values shouldn't matter.
    const getLabelColumn = (index: number) =>
      wrapper.findReferenceLabels()[index].getElement().style.getPropertyValue(customCssProps.sliderReferenceColumn);

    expect(getLabelColumn(0)).toBe('14');
    expect(getLabelColumn(1)).toBe('10');
    expect(getLabelColumn(2)).toBe('6');
  });

  test('Does not render labels that are too close together', () => {
    const wrapper = renderSlider({
      min: 0,
      max: 100,
      value: 50,
      referenceValues: [50, 51],
    });

    expect(wrapper.findReferenceLabels()).toHaveLength(1);
    expect(wrapper.findReferenceLabels()[0].getElement()).toHaveTextContent('50');
    expect(wrapper.findReferenceLabels()[0].getElement()).not.toHaveTextContent('51');
  });

  test('Does not render labels that are outside of range', () => {
    const wrapper = renderSlider({
      min: 0,
      max: 100,
      value: 50,
      referenceValues: [-50, 150],
    });

    expect(wrapper.findReferenceLabels()).toHaveLength(0);
  });

  test('Renders correctly formatted label', () => {
    const wrapper = renderSlider({
      min: 0,
      max: 100,
      value: 50,
      referenceValues: [50],
      valueFormatter: () => `Value`,
    });

    expect(wrapper.findReferenceLabels()).toHaveLength(1);
    expect(wrapper.findReferenceLabels()[0].getElement()).toHaveTextContent('Value');
    expect(wrapper.findReferenceLabels()[0].getElement()).not.toHaveTextContent('50');
  });

  test('Shows warning with non-integer reference values', () => {
    const wrapper = renderSlider({
      min: 0,
      max: 100,
      value: 50,
      referenceValues: [40.5],
    });

    expect(wrapper.findReferenceLabels().length).toBe(0);
    expect(warnOnce).toHaveBeenCalledTimes(1);
    expect(warnOnce).toHaveBeenCalledWith(
      'Slider',
      'All reference values must be integers. Non-integer values will not be displayed.'
    );
  });
});

describe('Slider ticks', () => {
  test('Does not show ticks if not stepped', () => {
    const wrapper = renderSlider({ min: 0, max: 100, value: 50, tickMarks: true });

    expect(wrapper.findByClassName(styles.ticks)).not.toBeInTheDocument();
  });

  test('Properly fills ticks', () => {
    const wrapper = renderSlider({ min: 0, max: 100, value: 50, tickMarks: true, step: 10 });

    const ticks = wrapper.findAllByClassName(styles.filled);
    expect(ticks).toHaveLength(6);
  });

  test('Properly fills ticks with error', () => {
    const wrapper = renderSlider({ min: 0, max: 100, value: 50, tickMarks: true, step: 10, invalid: true });

    const ticks = wrapper.findAllByClassName(styles.error);
    expect(ticks).toHaveLength(8);
  });

  test('Properly fills ticks with warning', () => {
    const wrapper = renderSlider({ min: 0, max: 100, value: 50, tickMarks: true, step: 10, warning: true });

    const ticks = wrapper.findAllByClassName(styles.warning);
    expect(ticks).toHaveLength(8);
  });

  test('Has correct amount of ticks', () => {
    const wrapper = renderSlider({ min: 0, max: 100, value: 50, tickMarks: true, step: 10 });

    const ticks = wrapper.findAllByClassName(styles.tick);
    const middleTicks = wrapper.findAllByClassName(styles.middle);
    expect(ticks).toHaveLength(13);
    expect(middleTicks).toHaveLength(11);
  });
});

describe('Slider events', () => {
  test('fire a change event with correct parameters', () => {
    const onChange = jest.fn();
    const wrapper = renderSlider({
      min: 0,
      max: 100,
      value: 50,
      onChange: event => onChange(event.detail),
    });

    wrapper.setInputValue('60');

    expect(onChange).toHaveBeenCalledWith({ value: 60 });
  });

  test('show tooltip on focus', () => {
    const wrapper = renderSlider({
      min: 0,
      max: 100,
      value: 50,
    });

    wrapper.focus();
    expect(wrapper.findRange().getElement()).toHaveClass(styles.active);
    expect(screen.queryByText('50')).toBeInTheDocument();

    wrapper.blur();
    expect(wrapper.findRange().getElement()).not.toHaveClass(styles.active);
    expect(screen.queryByText('50')).not.toBeInTheDocument();
  });

  test('show tooltip on mouse enter', () => {
    const wrapper = renderSlider({
      min: 0,
      max: 100,
      value: 50,
    });
    act(() => {
      fireEvent.mouseEnter(wrapper.findNativeInput()!.getElement());
    });
    expect(screen.queryByText('50')).toBeInTheDocument();

    act(() => {
      fireEvent.mouseLeave(wrapper.findNativeInput()!.getElement());
    });

    expect(screen.queryByText('50')).not.toBeInTheDocument();
  });
});

describe('Slider i18n', () => {
  test('supports providing valueTextRange from i18n provider', () => {
    const { container } = render(
      <TestI18nProvider
        messages={{
          slider: { 'i18nStrings.valueTextRange': `Custom {value}, between {previousValue} and {nextValue}` },
        }}
      >
        <Slider
          min={0}
          max={100}
          value={50}
          referenceValues={[25, 75]}
          valueFormatter={value => (value !== 50 ? `${value} is the value` : '')}
        />
      </TestI18nProvider>
    );

    expect(createWrapper(container).findSlider()?.findNativeInput()?.getElement()).toHaveAttribute(
      'aria-valuetext',
      'Custom 50, between 25 is the value and 75 is the value'
    );
  });
});

describe('Slider a11y', () => {
  test('Valides a11y', () => {
    const wrapper = renderSlider({
      min: 0,
      max: 100,
      value: 50,
      referenceValues: [25, 75],
      tickMarks: true,
      step: 10,
      ariaLabel: 'aria label',
    });

    expect(wrapper.getElement()).toValidateA11y;
  });

  test('Renders correct aria label', () => {
    const wrapper = renderSlider({ min: 0, max: 100, value: 50, ariaLabel: 'aria label' });
    const input = wrapper.findNativeInput()?.getElement();

    expect(input).toHaveAttribute('aria-label', 'aria label');
  });

  test('Renders correct arialabelledby', () => {
    const wrapper = renderSlider({ min: 0, max: 100, value: 50, ariaLabelledby: 'testid' });
    const input = wrapper.findNativeInput()?.getElement();

    expect(input).toHaveAttribute('aria-labelledby', 'testid');
  });

  test('Renders correct aria value text when has value', () => {
    const wrapper = renderSlider({
      min: 0,
      max: 100,
      value: 25,
      referenceValues: [25, 75],
      valueFormatter: value => `${value} is the value`,
    });
    const input = wrapper.findNativeInput()?.getElement();

    expect(input).toHaveAttribute('aria-valuetext', '25 is the value');
  });

  test('Renders correct aria value text when value is between two other formatted values', () => {
    const wrapper = renderSlider({
      min: 0,
      max: 100,
      value: 50,
      referenceValues: [25, 75],
      valueFormatter: value => (value !== 50 ? `${value} is the value` : ''),
      i18nStrings: {
        valueTextRange: (previousValue: string, value: number, nextValue: string) =>
          `${value}, between ${previousValue} and ${nextValue}`,
      },
    });
    const input = wrapper.findNativeInput()?.getElement();

    expect(input).toHaveAttribute('aria-valuetext', '50, between 25 is the value and 75 is the value');
  });

  test('Renders correct aria value text when value is between min and another formatted value', () => {
    const wrapper = renderSlider({
      min: 0,
      max: 100,
      value: 10,
      referenceValues: [25, 75],
      valueFormatter: value => (value !== 10 ? `${value} is the value` : ''),
      i18nStrings: {
        valueTextRange: (previousValue: string, value: number, nextValue: string) =>
          `${value}, between ${previousValue} and ${nextValue}`,
      },
    });
    const input = wrapper.findNativeInput()?.getElement();

    expect(input).toHaveAttribute('aria-valuetext', '10, between 0 is the value and 25 is the value');
  });

  test('Renders correct aria value text when value is between max and another formatted value', () => {
    const wrapper = renderSlider({
      min: 0,
      max: 100,
      value: 90,
      referenceValues: [25, 75],
      valueFormatter: value => (value !== 90 ? `${value} is the value` : ''),
      i18nStrings: {
        valueTextRange: (previousValue: string, value: number, nextValue: string) =>
          `${value}, between ${previousValue} and ${nextValue}`,
      },
    });
    const input = wrapper.findNativeInput()?.getElement();

    expect(input).toHaveAttribute('aria-valuetext', '90, between 75 is the value and 100 is the value');
  });

  test('Renders correct aria value text when value is between min and max without reference values', () => {
    const wrapper = renderSlider({
      min: 0,
      max: 100,
      value: 90,
      valueFormatter: value => (value !== 90 ? `${value} is the value` : ''),
      i18nStrings: {
        valueTextRange: (previousValue: string, value: number, nextValue: string) =>
          `${value}, between ${previousValue} and ${nextValue}`,
      },
    });
    const input = wrapper.findNativeInput()?.getElement();

    expect(input).toHaveAttribute('aria-valuetext', '90, between 0 is the value and 100 is the value');
  });

  test('Does not render aria value text with no value formatter', () => {
    const wrapper = renderSlider({ min: 0, max: 100, value: 50, referenceValues: [25, 75] });
    const input = wrapper.findNativeInput()?.getElement();

    expect(input).not.toHaveAttribute('aria-valuetext');
  });

  test('Labels are aria-hidden when just has numeric min and max', () => {
    const wrapper = renderSlider({ min: 0, max: 100, value: 50 });
    const labels = wrapper.findByClassName(styles.labels)!.getElement();

    expect(labels).toHaveAttribute('aria-hidden', 'true');
  });
});
