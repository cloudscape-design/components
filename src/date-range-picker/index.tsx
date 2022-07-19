// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { Ref, useEffect, useRef, useState } from 'react';
import styles from './styles.css.js';
import { DateRangePickerProps } from './interfaces';
import { DayIndex } from './calendar';
import { normalizeLocale } from '../date-picker/calendar/utils/locales';
import { getWeekStartByLocale } from 'weekstart';
import useForwardFocus from '../internal/hooks/forward-focus';
import { KeyCode } from '../internal/keycode';
import clsx from 'clsx';
import { getBaseProps } from '../internal/base-component';
import checkControlled from '../internal/hooks/check-controlled';
import InternalBox from '../box/internal';
import { DateRangePickerEditor } from './editor';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import Dropdown from '../internal/components/dropdown';
import { useFocusTracker } from '../internal/hooks/use-focus-tracker';
import { useMobile } from '../internal/hooks/use-mobile';
import ButtonTrigger from '../internal/components/button-trigger';
import { useFormFieldContext } from '../internal/context/form-field-context';
import InternalIcon from '../icon/internal';
import { getBrowserTimezoneOffset, shiftTimeOffset, formatOffset } from './time-offset';
import useBaseComponent from '../internal/hooks/use-base-component';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import { fireNonCancelableEvent } from '../internal/events/index.js';
import { isDevelopment } from '../internal/is-development.js';
import { warnOnce } from '../internal/logging.js';
import { usePrevious } from '../internal/hooks/use-previous/index.js';
import { useUniqueId } from '../internal/hooks/use-unique-id';
import { useDateRangePicker } from './use-date-range-picker';

export { DateRangePickerProps };

function formatDateRange(
  range: null | DateRangePickerProps.Value,
  placeholder: string,
  formatRelativeRange: DateRangePickerProps.I18nStrings['formatRelativeRange'],
  timeOffset: number
) {
  if (!range) {
    return (
      <span className={styles['label-text']} aria-disabled={true}>
        {placeholder}
      </span>
    );
  }

  if (range.type === 'relative') {
    return (
      <InternalBox fontWeight="normal" display="inline" color="inherit">
        {formatRelativeRange(range)}
      </InternalBox>
    );
  }

  if (range.type === 'absolute') {
    const formattedOffset = isDateOnly(range) ? '' : formatOffset(timeOffset);
    return (
      <InternalBox fontWeight="normal" display="inline" color="inherit">
        <span className={styles['preferred-wordbreak']}>
          {range.startDate}
          {formattedOffset} &mdash;
        </span>{' '}
        <span className={styles['preferred-wordbreak']}>
          {range.endDate}
          {formattedOffset}
        </span>
      </InternalBox>
    );
  }
}

function isDateOnly(value: null | DateRangePickerProps.Value) {
  if (!value || value.type !== 'absolute') {
    return false;
  }
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  return dateRegex.test(value.startDate) && dateRegex.test(value.endDate);
}

const DateRangePicker = React.forwardRef(
  (
    {
      locale = '',
      startOfWeek,
      isDateEnabled = () => true,
      value,
      placeholder,
      readOnly = false,
      disabled = false,
      onChange,
      onBlur,
      onFocus,
      relativeOptions = [],
      i18nStrings,
      isValidRange = () => ({ valid: true }),
      showClearButton = true,
      dateOnly = false,
      timeOffset = getBrowserTimezoneOffset(),
      timeInputFormat = 'hh:mm:ss',
      expandToViewport = false,
      rangeSelectorMode = 'default',
      ...rest
    }: DateRangePickerProps,
    ref: Ref<DateRangePickerProps.Ref>
  ) => {
    const { formatValue } = useDateRangePicker({
      value,
      relativeOptions,
      rangeSelectorMode,
    });

    const { __internalRootRef } = useBaseComponent('DateRangePicker');
    checkControlled('DateRangePicker', 'value', value, 'onChange', onChange);

    value = isDateOnly(value) ? value : shiftTimeOffset(value, timeOffset);

    const baseProps = getBaseProps(rest);
    const { invalid, controlId, ariaDescribedby, ariaLabelledby } = useFormFieldContext({
      ariaLabelledby: rest.ariaLabelledby ?? i18nStrings.ariaLabelledby,
      ariaDescribedby: rest.ariaDescribedby ?? i18nStrings.ariaDescribedby,
      ...rest,
    });
    const isSingleGrid = useMobile();

    const triggerRef = useRef<HTMLButtonElement | null>(null);
    useForwardFocus(ref, triggerRef);

    const rootRef = useRef<HTMLDivElement>(null);
    const dropdownId = useUniqueId('date-range-picker-dropdown');

    useFocusTracker({ rootRef, onBlur, onFocus, viewportId: expandToViewport ? dropdownId : '' });

    const [isDropDownOpen, setIsDropDownOpen] = useState<boolean>(false);

    const normalizedLocale = normalizeLocale('DateRangePicker', locale ?? '');
    const normalizedStartOfWeek = (
      typeof startOfWeek === 'number' ? startOfWeek % 7 : getWeekStartByLocale(normalizedLocale)
    ) as DayIndex;

    const closeDropdown = (focusTrigger = false) => {
      setIsDropDownOpen(false);
      if (focusTrigger) {
        triggerRef.current?.focus();
      }
    };

    const onWrapperKeyDownHandler = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.keyCode === KeyCode.escape) {
        closeDropdown(true);
      }
    };

    const onClear = () => {
      fireNonCancelableEvent(onChange, { value: null });
    };

    const onApply = (newValue: null | DateRangePickerProps.Value): DateRangePickerProps.ValidationResult => {
      const validationResult = isValidRange(newValue);
      if (validationResult?.valid === false) {
        return validationResult;
      }

      if (isDevelopment) {
        if (newValue?.type === 'absolute') {
          const [startDateWithoutTime] = newValue.startDate.split('T');
          const [endDateWithoutTime] = newValue.endDate.split('T');
          if (!startDateWithoutTime || !endDateWithoutTime) {
            warnOnce(
              'DateRangePicker',
              'You have provided an `isValidRange` prop that did not catch a missing start or end date.'
            );
          }
        }
      }
      fireNonCancelableEvent(onChange, { value: formatValue(newValue, { dateOnly, timeOffset }) });
      return validationResult || { valid: true };
    };

    const prevDateOnly = usePrevious(dateOnly);
    useEffect(() => {
      if (prevDateOnly !== undefined && prevDateOnly !== dateOnly) {
        warnOnce(
          'DateRangePicker',
          `The provided \`dateOnly\` flag has been changed from "${prevDateOnly}" to "${dateOnly}" which can lead to unexpected value format. Consider using separate components.`
        );
      }
    }, [prevDateOnly, dateOnly]);

    if (value && value.type !== 'absolute' && value.type !== 'relative') {
      warnOnce('DateRangePicker', 'You provided an invalid value. Reverting back to default.');
      value = null;
    }

    if (
      (value?.type === 'absolute' && rangeSelectorMode === 'relative-only') ||
      (value?.type === 'relative' && rangeSelectorMode === 'absolute-only')
    ) {
      warnOnce(
        'DateRangePicker',
        'The provided value does not correspond to the current range selector mode. Reverting back to default.'
      );
      value = null;
    }

    const trigger = (
      <div className={styles['trigger-wrapper']}>
        <ButtonTrigger
          ref={triggerRef}
          id={controlId}
          invalid={invalid}
          ariaLabel={i18nStrings.ariaLabel}
          ariaDescribedby={ariaDescribedby}
          ariaLabelledby={ariaLabelledby}
          className={clsx(styles.label, {
            [styles['label-enabled']]: !readOnly && !disabled,
          })}
          hideCaret={true}
          onClick={() => {
            if (!readOnly && !disabled) {
              setIsDropDownOpen(true);
            }
          }}
          disabled={disabled}
          readOnly={readOnly}
          ariaHasPopup="true"
        >
          <span className={styles['trigger-flexbox']}>
            <span className={styles['icon-wrapper']}>
              <InternalIcon name="calendar" variant={disabled || readOnly ? 'disabled' : 'normal'} />
            </span>
            {formatDateRange(value, placeholder ?? '', i18nStrings.formatRelativeRange, timeOffset)}
          </span>
        </ButtonTrigger>
      </div>
    );

    const mergedRef = useMergeRefs(rootRef, __internalRootRef);

    return (
      <div
        {...baseProps}
        ref={mergedRef}
        className={clsx(baseProps.className, styles.root)}
        onKeyDown={onWrapperKeyDownHandler}
      >
        <Dropdown
          stretchWidth={true}
          stretchHeight={true}
          open={isDropDownOpen}
          onDropdownClose={() => closeDropdown()}
          trigger={trigger}
          stretchToTriggerWidth={false}
          expandToViewport={expandToViewport}
          dropdownId={dropdownId}
        >
          {isDropDownOpen && (
            <DateRangePickerEditor
              startOfWeek={normalizedStartOfWeek}
              locale={normalizedLocale}
              isSingleGrid={isSingleGrid}
              onDropdownClose={() => closeDropdown(true)}
              value={value}
              showClearButton={showClearButton}
              isDateEnabled={isDateEnabled}
              i18nStrings={i18nStrings}
              onClear={onClear}
              onApply={onApply}
              relativeOptions={relativeOptions}
              isValidRange={isValidRange}
              dateOnly={dateOnly}
              timeInputFormat={timeInputFormat}
              rangeSelectorMode={rangeSelectorMode}
              ariaLabelledby={ariaLabelledby}
              ariaDescribedby={ariaDescribedby}
            />
          )}
        </Dropdown>
      </div>
    );
  }
);

applyDisplayName(DateRangePicker, 'DateRangePicker');
export default DateRangePicker;
