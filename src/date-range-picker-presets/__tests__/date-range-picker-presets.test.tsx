// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, render } from '@testing-library/react';

import DateRangePickerPresets, { DateRangePickerPresetsProps } from '../../../lib/components/date-range-picker-presets';
import createWrapper from '../../../lib/components/test-utils/dom';
import DateRangePickerPresetsWrapper from '../../../lib/components/test-utils/dom/date-range-picker-presets';

const i18nStrings: DateRangePickerPresetsProps['i18nStrings'] = {
  formatRelativeRange: ({ amount, unit }) => `Last ${amount} ${amount === 1 ? unit : `${unit}s`}`,
  formatUnit: (unit, value) => (value === 1 ? unit : `${unit}s`),
  relativeRangeSelectionHeading: 'Choose a range',
  customRelativeRangeOptionLabel: 'Custom range',
  customRelativeRangeOptionDescription: 'Set a custom range in the past',
  customRelativeRangeDurationLabel: 'Duration',
  customRelativeRangeDurationPlaceholder: 'Enter duration',
  customRelativeRangeUnitLabel: 'Unit of time',
};

const relativeOptions: DateRangePickerPresetsProps['relativeOptions'] = [
  { key: 'last-5-minutes', amount: 5, unit: 'minute', type: 'relative' },
  { key: 'last-1-hour', amount: 1, unit: 'hour', type: 'relative' },
  { key: 'last-6-hours', amount: 6, unit: 'hour', type: 'relative' },
];

function renderPresets(props: Partial<DateRangePickerPresetsProps> = {}) {
  const { container } = render(
    <DateRangePickerPresets value={null} relativeOptions={relativeOptions} i18nStrings={i18nStrings} {...props} />
  );
  return createWrapper(container).findComponent('div', DateRangePickerPresetsWrapper)!;
}

describe('DateRangePickerPresets', () => {
  describe('rendering presets', () => {
    test('renders a radio group with all provided relative options', () => {
      const wrapper = renderPresets();
      const radioGroup = wrapper.findRelativeRangeRadioGroup()!;
      expect(radioGroup).not.toBeNull();
      // 3 options + 1 custom = 4 radio buttons
      expect(radioGroup.findButtons()).toHaveLength(4);
    });

    test('radio labels match formatRelativeRange output', () => {
      const wrapper = renderPresets();
      const radioGroup = wrapper.findRelativeRangeRadioGroup()!;
      const labels = radioGroup.findButtons().map(b => b.findLabel().getElement().textContent);
      expect(labels).toContain('Last 5 minutes');
      expect(labels).toContain('Last 1 hour');
      expect(labels).toContain('Last 6 hours');
    });

    test('renders a "Custom range" option appended to the presets', () => {
      const wrapper = renderPresets();
      const radioGroup = wrapper.findRelativeRangeRadioGroup()!;
      const lastLabel = radioGroup.findButtons().at(-1)!.findLabel().getElement().textContent;
      expect(lastLabel).toContain('Custom range');
    });

    test('renders with no preset options — custom range controls shown directly', () => {
      const wrapper = renderPresets({ relativeOptions: [] });
      // No radio group when there are no presets
      expect(wrapper.findRelativeRangeRadioGroup()).toBeNull();
      // Duration input and unit select are immediately visible
      expect(wrapper.findCustomRelativeRangeDuration()).not.toBeNull();
      expect(wrapper.findCustomRelativeRangeUnit()).not.toBeNull();
    });

    test('pre-selects the radio matching the provided value key', () => {
      const wrapper = renderPresets({
        value: { key: 'last-1-hour', amount: 1, unit: 'hour', type: 'relative' },
      });
      const radioGroup = wrapper.findRelativeRangeRadioGroup()!;
      const hourRadio = radioGroup.findInputByValue('last-1-hour')!.getElement() as HTMLInputElement;
      expect(hourRadio.checked).toBe(true);
    });

    test('does not show custom controls when a preset is selected', () => {
      const wrapper = renderPresets({
        value: { key: 'last-1-hour', amount: 1, unit: 'hour', type: 'relative' },
      });
      expect(wrapper.findCustomRelativeRangeDuration()).toBeNull();
      expect(wrapper.findCustomRelativeRangeUnit()).toBeNull();
    });
  });

  describe('onChange', () => {
    test('fires onChange when a preset radio is selected', () => {
      const onChange = jest.fn();
      const wrapper = renderPresets({ onChange });
      act(() => {
        wrapper.findRelativeRangeRadioGroup()!.findInputByValue('last-5-minutes')!.click();
      });
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: { value: { key: 'last-5-minutes', amount: 5, unit: 'minute', type: 'relative' } },
        })
      );
    });

    test('fires onChange with NaN amount when "Custom range" radio is selected', () => {
      const onChange = jest.fn();
      const wrapper = renderPresets({ onChange });
      act(() => {
        // Custom option is the last radio button
        wrapper.findRelativeRangeRadioGroup()!.findButtons().at(-1)!.findLabel().click();
      });
      expect(onChange).toHaveBeenCalledTimes(1);
      const { value } = onChange.mock.calls[0][0].detail;
      expect(value.type).toBe('relative');
      expect(isNaN(value.amount)).toBe(true);
    });

    test('fires onChange when duration input is changed in custom mode', () => {
      const onChange = jest.fn();
      const wrapper = renderPresets({ relativeOptions: [], onChange });
      act(() => {
        wrapper.findCustomRelativeRangeDuration()!.setInputValue('7');
      });
      expect(onChange).toHaveBeenCalled();
      const { value } = onChange.mock.calls[0][0].detail;
      expect(value.amount).toBe(7);
      expect(value.type).toBe('relative');
    });
  });

  describe('custom range controls', () => {
    test('shows duration and unit controls after selecting "Custom range"', () => {
      const wrapper = renderPresets();
      act(() => {
        wrapper.findRelativeRangeRadioGroup()!.findButtons().at(-1)!.findLabel().click();
      });
      expect(wrapper.findCustomRelativeRangeDuration()).not.toBeNull();
      expect(wrapper.findCustomRelativeRangeUnit()).not.toBeNull();
    });
  });

  describe('dateOnly prop', () => {
    test('does not show time-based units when dateOnly is true', () => {
      const wrapper = renderPresets({ relativeOptions: [], dateOnly: true });
      const unitSelect = wrapper.findCustomRelativeRangeUnit()!;
      // Open the dropdown and check options don't include minute/hour/second
      act(() => {
        unitSelect.openDropdown();
      });
      const optionTexts = unitSelect
        .findDropdown()!
        .findOptions()
        .map(o => o.getElement().textContent);
      expect(optionTexts.some(t => t?.includes('minute'))).toBe(false);
      expect(optionTexts.some(t => t?.includes('hour'))).toBe(false);
      expect(optionTexts.some(t => t?.includes('second'))).toBe(false);
    });
  });

  describe('granularity prop', () => {
    test('restricts units to month/year when granularity is "month"', () => {
      const wrapper = renderPresets({
        relativeOptions: [{ key: 'last-1-month', amount: 1, unit: 'month', type: 'relative' }],
        granularity: 'month',
      });
      const radioGroup = wrapper.findRelativeRangeRadioGroup()!;
      const labels = radioGroup.findButtons().map(b => b.findLabel().getElement().textContent);
      expect(labels).toContain('Last 1 month');
    });

    test('shows only month/year units in custom range when granularity is "month"', () => {
      const wrapper = renderPresets({ relativeOptions: [], granularity: 'month' });
      act(() => {
        wrapper.findCustomRelativeRangeUnit()!.openDropdown();
      });
      const optionTexts = wrapper
        .findCustomRelativeRangeUnit()!
        .findDropdown()!
        .findOptions()
        .map(o => o.getElement().textContent);
      expect(optionTexts.some(t => t?.includes('day'))).toBe(false);
      expect(optionTexts.some(t => t?.includes('hour'))).toBe(false);
    });
  });

  describe('renderContent prop', () => {
    test('renders custom content instead of default presets UI when renderContent is provided', () => {
      const renderContent: DateRangePickerPresetsProps['renderContent'] = () => (
        <div data-testid="custom-ui">Custom Presets UI</div>
      );
      const { container } = render(
        <DateRangePickerPresets
          value={null}
          relativeOptions={relativeOptions}
          i18nStrings={i18nStrings}
          renderContent={renderContent}
        />
      );
      expect(container.querySelector('[data-testid="custom-ui"]')).not.toBeNull();
      expect(container.querySelector('[data-testid="custom-ui"]')!.textContent).toBe('Custom Presets UI');
    });

    test('does not render the default radio group when renderContent is provided', () => {
      const renderContent: DateRangePickerPresetsProps['renderContent'] = () => <div>override</div>;
      const wrapper = renderPresets({ renderContent });
      expect(wrapper.findRelativeRangeRadioGroup()).toBeNull();
    });
  });
});
