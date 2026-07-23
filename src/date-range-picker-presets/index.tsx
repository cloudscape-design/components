// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React, { Ref, useRef } from 'react';

import { DateRangePickerProps } from '../date-range-picker/interfaces';
import RelativeRangePicker from '../date-range-picker/relative-range';
import { getBaseProps } from '../internal/base-component';
import { fireNonCancelableEvent } from '../internal/events';
import useForwardFocus from '../internal/hooks/forward-focus';
import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { DateRangePickerPresetsProps } from './interfaces';

export { DateRangePickerPresetsProps };

const DateRangePickerPresets = React.forwardRef(
  (
    {
      value = null,
      relativeOptions = [],
      onChange,
      dateOnly = false,
      i18nStrings,
      customRelativeRangeUnits,
      renderContent,
      granularity = 'day',
      ...rest
    }: DateRangePickerPresetsProps,
    ref: Ref<DateRangePickerPresetsProps.Ref>
  ) => {
    const { __internalRootRef } = useBaseComponent('DateRangePickerPresets', {
      props: { dateOnly, granularity },
    });

    const innerRef = useRef<HTMLDivElement>(null);
    useForwardFocus(ref, innerRef as React.RefObject<HTMLElement>);

    const baseProps = getBaseProps(rest);

    const handleChange = (range: DateRangePickerProps.RelativeValue) => {
      fireNonCancelableEvent(onChange, { value: range });
    };

    return (
      <div ref={__internalRootRef} {...baseProps}>
        <div ref={innerRef}>
          <RelativeRangePicker
            dateOnly={dateOnly}
            options={relativeOptions}
            initialSelection={value}
            onChange={handleChange}
            i18nStrings={i18nStrings}
            isSingleGrid={false}
            customUnits={customRelativeRangeUnits}
            granularity={granularity}
            renderRelativeRangeContent={renderContent}
          />
        </div>
      </div>
    );
  }
);

applyDisplayName(DateRangePickerPresets, 'DateRangePickerPresets');
export default DateRangePickerPresets;
