// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { Ref, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import { useInternalI18n } from '../i18n/context.js';
import InternalIcon from '../icon/internal.js';
import { getBaseProps } from '../internal/base-component/index.js';
import ButtonTrigger from '../internal/components/button-trigger/index.js';
import Dropdown from '../internal/components/dropdown/index.js';
import { useFormFieldContext } from '../internal/context/form-field-context.js';
import ResetContextsForModal from '../internal/context/reset-contexts-for-modal.js';
import { fireNonCancelableEvent } from '../internal/events/index.js';
import checkControlled from '../internal/hooks/check-controlled/index.js';
import useForwardFocus from '../internal/hooks/forward-focus/index.js';
import useBaseComponent from '../internal/hooks/use-base-component/index.js';
import { useFocusTracker } from '../internal/hooks/use-focus-tracker.js';
import { useMergeRefs } from '../internal/hooks/use-merge-refs/index.js';
import { useMobile } from '../internal/hooks/use-mobile/index.js';
import { usePrevious } from '../internal/hooks/use-previous/index.js';
import { useUniqueId } from '../internal/hooks/use-unique-id/index.js';
import { isDevelopment } from '../internal/is-development.js';
import { KeyCode } from '../internal/keycode.js';
import { applyDisplayName } from '../internal/utils/apply-display-name.js';
import { formatDateTimeWithOffset } from '../internal/utils/date-time/format-date-time-with-offset.js';
import { normalizeLocale } from '../internal/utils/locale/index.js';
import { joinStrings } from '../internal/utils/strings/join-strings.js';
import { DateRangePickerDropdown } from './dropdown.js';
import { DateRangePickerProps } from './interfaces.js';
import { normalizeTimeOffset } from './time-offset.js';
import { formatInitialValue, formatValue } from './utils.js';

import styles from './styles.css.js';
import testutilStyles from './test-classes/styles.css.js';

export { DateRangePickerProps };

function renderDateRange({
  locale,
  range,
  placeholder = '',
  formatRelativeRange,
  absoluteFormat,
  hideTimeOffset,
  timeOffset,
}: {
  locale?: string;
  range: null | DateRangePickerProps.Value;
  placeholder?: string;
  formatRelativeRange: DateRangePickerProps.I18nStrings['formatRelativeRange'];
  absoluteFormat: DateRangePickerProps.AbsoluteFormat;
  hideTimeOffset?: boolean;
  timeOffset: { startDate?: number; endDate?: number };
}) {
  const firstPart = range
    ? range.type === 'relative'
      ? formatRelativeRange?.(range) ?? ''
      : formatDateTimeWithOffset({
          date: range.startDate,
          timeOffset: timeOffset.startDate,
          hideTimeOffset,
          format: absoluteFormat,
          locale,
        })
    : placeholder;

  const secondPart =
    range?.type === 'absolute'
      ? formatDateTimeWithOffset({
          date: range.endDate,
          timeOffset: timeOffset.endDate,
          hideTimeOffset,
          format: absoluteFormat,
          locale,
        })
      : '';

  return (
    <span className={(!range && styles['label-text']) || undefined} aria-disabled={!range}>
      <span className={range?.type === 'absolute' ? styles['label-token-nowrap'] : undefined}>{firstPart}</span>
      <span>{secondPart && ' — '}</span>
      <span className={styles['label-token-nowrap']}>{secondPart}</span>
    </span>
  );
}

const DateRangePicker = React.forwardRef(
  (
    {
      locale = '',
      startOfWeek,
      isDateEnabled = () => true,
      dateDisabledReason,
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
      timeOffset,
      getTimeOffset,
      timeInputFormat = 'hh:mm:ss',
      expandToViewport = false,
      rangeSelectorMode = 'default',
      customAbsoluteRangeControl,
      absoluteFormat = 'iso',
      hideTimeOffset,
      customRelativeRangeUnits,
      granularity = 'day',
      ...rest
    }: DateRangePickerProps,
    ref: Ref<DateRangePickerProps.Ref>
  ) => {
    const { __internalRootRef } = useBaseComponent('DateRangePicker', {
      props: {
        absoluteFormat,
        dateOnly,
        expandToViewport,
        rangeSelectorMode,
        readOnly,
        showClearButton,
        timeInputFormat,
        hideTimeOffset,
        granularity,
      },
      metadata: { hasDisabledReasons: Boolean(dateDisabledReason) },
    });
    const isMonthOnly = granularity === 'month';
    const hideTime = dateOnly || isMonthOnly;
    checkControlled('DateRangePicker', 'value', value, 'onChange', onChange);

    const normalizedTimeOffset = hideTime
      ? { startDate: undefined, endDate: undefined }
      : normalizeTimeOffset(value, getTimeOffset, timeOffset);
    value = formatInitialValue(value, dateOnly, isMonthOnly, normalizedTimeOffset);
    const baseProps = getBaseProps(rest);
    const { invalid, warning, controlId, ariaDescribedby, ariaLabelledby } = useFormFieldContext({
      ariaLabelledby: rest.ariaLabelledby ?? i18nStrings?.ariaLabelledby,
      ariaDescribedby: rest.ariaDescribedby ?? i18nStrings?.ariaDescribedby,
      ...rest,
    });
    const isSingleGrid = useMobile();

    const triggerRef = useRef<HTMLButtonElement | null>(null);
    useForwardFocus(ref, triggerRef);

    const rootRef = useRef<HTMLDivElement>(null);
    const dropdownId = useUniqueId('date-range-picker-dropdown');
    const triggerContentId = useUniqueId('date-range-picker-trigger');

    useFocusTracker({ rootRef, onBlur, onFocus });

    const [isDropDownOpen, setIsDropDownOpen] = useState<boolean>(false);

    const normalizedLocale = normalizeLocale('DateRangePicker', locale);

    const closeDropdown = (focusTrigger = false) => {
      setIsDropDownOpen(false);
      if (focusTrigger) {
        triggerRef.current?.focus();
      }
    };

    const onWrapperKeyDownHandler = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.keyCode === KeyCode.escape) {
        if (isDropDownOpen) {
          event.stopPropagation();
        }
        closeDropdown(true);
      }
    };

    const onClear = () => {
      fireNonCancelableEvent(onChange, { value: null });
    };

    const onApply = (newValue: null | DateRangePickerProps.Value): DateRangePickerProps.ValidationResult => {
      const formattedValue = formatValue(newValue, {
        dateOnly,
        monthOnly: isMonthOnly,
        timeOffset: hideTime
          ? { startDate: undefined, endDate: undefined }
          : normalizeTimeOffset(newValue, getTimeOffset, timeOffset),
      });

      const validationResult = isValidRange(formattedValue);
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
      fireNonCancelableEvent(onChange, { value: formattedValue });
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

    const i18n = useInternalI18n('date-range-picker');
    const formatRelativeRange = i18n(
      'i18nStrings.formatRelativeRange',
      i18nStrings?.formatRelativeRange,
      format =>
        ({ amount, unit }) =>
          format({ amount, unit })
    );

    if (isDevelopment) {
      if (!formatRelativeRange && rangeSelectorMode !== 'absolute-only') {
        warnOnce(
          'DateRangePicker',
          'A function for i18nStrings.formatRelativeRange was not provided. Relative ranges will not be correctly rendered.'
        );
      }
    }

    const formattedDate: string | JSX.Element = renderDateRange({
      locale: normalizedLocale,
      range: value,
      placeholder,
      formatRelativeRange,
      absoluteFormat,
      hideTimeOffset: hideTime || hideTimeOffset,
      timeOffset: normalizedTimeOffset,
    });

    const trigger = (
      <ButtonTrigger
        ref={triggerRef}
        id={controlId}
        invalid={invalid}
        warning={warning}
        ariaLabelledby={joinStrings(ariaLabelledby, triggerContentId)}
        ariaLabel={i18nStrings?.ariaLabel}
        ariaDescribedby={ariaDescribedby}
        className={clsx(testutilStyles.label, styles.label, {
          [styles['label-enabled']]: !readOnly && !disabled,
        })}
        hideCaret={true}
        onClick={() => {
          setIsDropDownOpen(true);
        }}
        disabled={disabled}
        readOnly={readOnly}
        ariaHasPopup="dialog"
      >
        <span className={styles['trigger-flexbox']}>
          <span className={styles['icon-wrapper']}>
            <InternalIcon name="calendar" variant={disabled || readOnly ? 'disabled' : 'normal'} />
          </span>
          <span id={triggerContentId}>{formattedDate}</span>
        </span>
      </ButtonTrigger>
    );

    const mergedRef = useMergeRefs(rootRef, __internalRootRef);

    return (
      <div
        {...baseProps}
        ref={mergedRef}
        className={clsx(
          baseProps.className,
          styles.root,
          testutilStyles.root,
          absoluteFormat === 'long-localized' && !dateOnly && !isMonthOnly && styles.wide
        )}
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
          {/* Reset form field context to prevent a wrapper form field from labelling all inputs inside the dropdown. */}
          <ResetContextsForModal>
            {isDropDownOpen && (
              <DateRangePickerDropdown
                startOfWeek={startOfWeek}
                locale={normalizedLocale}
                isSingleGrid={isSingleGrid}
                onDropdownClose={() => closeDropdown(true)}
                value={value}
                showClearButton={showClearButton}
                isDateEnabled={isDateEnabled}
                dateDisabledReason={dateDisabledReason}
                i18nStrings={i18nStrings}
                onClear={onClear}
                onApply={onApply}
                getTimeOffset={getTimeOffset}
                timeOffset={timeOffset}
                relativeOptions={relativeOptions}
                isValidRange={isValidRange}
                dateOnly={dateOnly}
                timeInputFormat={timeInputFormat}
                rangeSelectorMode={rangeSelectorMode}
                ariaLabelledby={ariaLabelledby}
                ariaDescribedby={ariaDescribedby}
                customAbsoluteRangeControl={customAbsoluteRangeControl}
                customRelativeRangeUnits={customRelativeRangeUnits}
                granularity={granularity}
              />
            )}
          </ResetContextsForModal>
        </Dropdown>
      </div>
    );
  }
);

applyDisplayName(DateRangePicker, 'DateRangePicker');
export default DateRangePicker;
