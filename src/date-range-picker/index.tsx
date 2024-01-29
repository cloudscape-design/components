// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { Ref, useEffect, useRef, useState } from 'react';
import styles from './styles.css.js';
import { DateRangePickerProps } from './interfaces';
import { normalizeLocale } from '../internal/utils/locale';
import useForwardFocus from '../internal/hooks/forward-focus';
import { KeyCode } from '../internal/keycode';
import clsx from 'clsx';
import { getBaseProps } from '../internal/base-component';
import checkControlled from '../internal/hooks/check-controlled';
import InternalBox from '../box/internal';
import { DateRangePickerDropdown } from './dropdown';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import Dropdown from '../internal/components/dropdown';
import { useFocusTracker } from '../internal/hooks/use-focus-tracker';
import { useMobile } from '../internal/hooks/use-mobile';
import ButtonTrigger from '../internal/components/button-trigger';
import { FormFieldContext, useFormFieldContext } from '../internal/context/form-field-context';
import InternalIcon from '../icon/internal';
import { normalizeTimeOffset, shiftTimeOffset } from './time-offset';
import useBaseComponent from '../internal/hooks/use-base-component';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import { fireNonCancelableEvent } from '../internal/events';
import { isDevelopment } from '../internal/is-development.js';
import { warnOnce } from '@cloudscape-design/component-toolkit/internal';
import { usePrevious } from '../internal/hooks/use-previous';
import { useUniqueId } from '../internal/hooks/use-unique-id';
import { joinStrings } from '../internal/utils/strings/join-strings';
import { formatDateRange, isIsoDateOnly } from '../internal/utils/date-time';
import { useInternalI18n } from '../i18n/context';
import { formatValue } from './utils';

export { DateRangePickerProps };

function renderDateRange({
  range,
  placeholder = '',
  formatRelativeRange,
  absoluteFormat,
  hideTimeOffset,
  timeOffset,
}: {
  range: null | DateRangePickerProps.Value;
  placeholder?: string;
  formatRelativeRange: DateRangePickerProps.I18nStrings['formatRelativeRange'];
  absoluteFormat?: DateRangePickerProps.AbsoluteFormat;
  hideTimeOffset?: boolean;
  timeOffset: { startDate?: number; endDate?: number };
}) {
  if (!range) {
    return (
      <span className={styles['label-text']} aria-disabled={true}>
        {placeholder}
      </span>
    );
  }

  const formatted =
    range.type === 'relative' ? (
      formatRelativeRange?.(range) ?? ''
    ) : (
      <BreakSpaces
        text={formatDateRange({
          startDate: range.startDate,
          endDate: range.endDate,
          timeOffset,
          hideTimeOffset,
          format: absoluteFormat,
        })}
      />
    );

  return (
    <InternalBox fontWeight="normal" display="inline" color="inherit" variant="span">
      {formatted}
    </InternalBox>
  );
}

function BreakSpaces({ text }: { text: string }) {
  const tokens = text.split(/( )/);
  return (
    <>
      {tokens.map((token, index) => (
        <React.Fragment key={index}>
          {token.length > 1 ? <span className={styles['label-token-nowrap']}>{token}</span> : token}
          {token === ' ' && <wbr />}
        </React.Fragment>
      ))}
    </>
  );
}

function isDateOnly(value: null | DateRangePickerProps.Value) {
  if (!value || value.type !== 'absolute') {
    return false;
  }
  return isIsoDateOnly(value.startDate) && isIsoDateOnly(value.endDate);
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
      timeOffset,
      getTimeOffset,
      timeInputFormat = 'hh:mm:ss',
      expandToViewport = false,
      rangeSelectorMode = 'default',
      customAbsoluteRangeControl,
      absoluteFormat,
      hideTimeOffset,
      ...rest
    }: DateRangePickerProps,
    ref: Ref<DateRangePickerProps.Ref>
  ) => {
    const { __internalRootRef } = useBaseComponent('DateRangePicker');
    checkControlled('DateRangePicker', 'value', value, 'onChange', onChange);

    const normalizedTimeOffset = normalizeTimeOffset(value, getTimeOffset, timeOffset);
    value = isDateOnly(value) ? value : shiftTimeOffset(value, normalizedTimeOffset);

    const baseProps = getBaseProps(rest);
    const { invalid, controlId, ariaDescribedby, ariaLabelledby } = useFormFieldContext({
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
      fireNonCancelableEvent(onChange, {
        value: formatValue(newValue, {
          dateOnly,
          timeOffset: normalizeTimeOffset(newValue, getTimeOffset, timeOffset),
        }),
      });
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
      range: value,
      placeholder,
      formatRelativeRange,
      absoluteFormat,
      hideTimeOffset,
      timeOffset: normalizedTimeOffset,
    });

    const trigger = (
      <div className={styles['trigger-wrapper']}>
        <ButtonTrigger
          ref={triggerRef}
          id={controlId}
          invalid={invalid}
          ariaLabelledby={joinStrings(ariaLabelledby, triggerContentId)}
          ariaLabel={i18nStrings?.ariaLabel}
          ariaDescribedby={ariaDescribedby}
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
          ariaHasPopup="dialog"
        >
          <span className={styles['trigger-flexbox']}>
            <span className={styles['icon-wrapper']}>
              <InternalIcon name="calendar" variant={disabled || readOnly ? 'disabled' : 'normal'} />
            </span>
            <span id={triggerContentId}>{formattedDate}</span>
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
          {/* Reset form field context to prevent a wrapper form field from labelling all inputs inside the dropdown. */}
          <FormFieldContext.Provider value={{}}>
            {isDropDownOpen && (
              <DateRangePickerDropdown
                startOfWeek={startOfWeek}
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
                customAbsoluteRangeControl={customAbsoluteRangeControl}
              />
            )}
          </FormFieldContext.Provider>
        </Dropdown>
      </div>
    );
  }
);

applyDisplayName(DateRangePicker, 'DateRangePicker');
export default DateRangePicker;
