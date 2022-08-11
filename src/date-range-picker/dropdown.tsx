// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';
import { DateRangePickerProps, Focusable } from './interfaces';
import Calendar from './calendar';
import { ButtonProps } from '../button/interfaces';
import { InternalButton } from '../button/internal';
import FocusLock from '../internal/components/focus-lock';
import InternalBox from '../box/internal';
import SpaceBetween from '../space-between/index.js';

import styles from './styles.css.js';
import RelativeRangePicker from './relative-range';
import ModeSwitcher from './mode-switcher';
import clsx from 'clsx';
import InternalAlert from '../alert/internal';
import LiveRegion from '../internal/components/live-region';
import useFocusVisible from '../internal/hooks/focus-visible';

const VALID_RANGE: DateRangePickerProps.ValidRangeResult = { valid: true };

/**
 * This function fills in a start and end time if they are missing.
 */
function fillMissingTime(value: DateRangePickerProps.AbsoluteValue | null) {
  if (!value) {
    return value;
  }
  const [startDate, startTime] = value.startDate.split('T');
  const [endDate, endTime] = value.endDate.split('T');
  return {
    ...value,
    startDate: startTime ? value.startDate : `${startDate}T00:00:00`,
    endDate: endTime ? value.endDate : `${endDate}T23:59:59`,
  };
}

export interface DateRangePickerDropdownProps
  extends Pick<
    Required<DateRangePickerProps>,
    | 'locale'
    | 'isDateEnabled'
    | 'isValidRange'
    | 'value'
    | 'relativeOptions'
    | 'showClearButton'
    | 'i18nStrings'
    | 'dateOnly'
    | 'timeInputFormat'
    | 'rangeSelectorMode'
  > {
  onClear: () => void;
  onApply: (value: null | DateRangePickerProps.Value) => DateRangePickerProps.ValidationResult;
  startOfWeek: number | undefined;
  onDropdownClose: () => void;
  isSingleGrid: boolean;

  ariaLabelledby?: string;
  ariaDescribedby?: string;
}

function getDefaultMode(
  value: null | DateRangePickerProps.Value,
  relativeOptions: readonly DateRangePickerProps.RelativeOption[],
  rangeSelectorMode: DateRangePickerProps.RangeSelectorMode
) {
  if (value && value.type) {
    return value.type;
  }
  if (rangeSelectorMode === 'relative-only') {
    return 'relative';
  }
  if (rangeSelectorMode === 'absolute-only') {
    return 'absolute';
  }
  return relativeOptions.length > 0 ? 'relative' : 'absolute';
}

export function DateRangePickerDropdown({
  locale = '',
  startOfWeek,
  isDateEnabled,
  isValidRange,
  value,
  onClear: clearValue,
  onApply: applyValue,
  onDropdownClose,
  relativeOptions,
  showClearButton,
  isSingleGrid,
  i18nStrings,
  dateOnly,
  timeInputFormat,
  rangeSelectorMode,
  ariaLabelledby,
  ariaDescribedby,
}: DateRangePickerDropdownProps) {
  const focusVisible = useFocusVisible();
  const scrollableContainerRef = useRef<HTMLDivElement | null>(null);
  const applyButtonRef = useRef<ButtonProps.Ref>(null);

  const [rangeSelectionMode, setRangeSelectionMode] = useState<'absolute' | 'relative'>(
    getDefaultMode(value, relativeOptions, rangeSelectorMode)
  );

  const [selectedAbsoluteRange, setSelectedAbsoluteRange] = useState<DateRangePickerProps.AbsoluteValue | null>(
    value?.type === 'absolute' ? value : null
  );

  const [selectedRelativeRange, setSelectedRelativeRange] = useState<DateRangePickerProps.RelativeValue | null>(
    value?.type === 'relative' ? value : null
  );

  const [applyClicked, setApplyClicked] = useState<boolean>(false);

  const [validationResult, setValidationResult] = useState<
    DateRangePickerProps.ValidRangeResult | DateRangePickerProps.InvalidRangeResult
  >(VALID_RANGE);

  const closeDropdown = () => {
    setApplyClicked(false);
    onDropdownClose();
  };

  const onClear = () => {
    closeDropdown();
    clearValue();
  };

  const onApply = () => {
    const newValue = rangeSelectionMode === 'relative' ? selectedRelativeRange : fillMissingTime(selectedAbsoluteRange);
    const newValidationResult = applyValue(newValue);
    if (newValidationResult.valid === false) {
      setApplyClicked(true);
      setValidationResult(newValidationResult);
    } else {
      setApplyClicked(false);
      closeDropdown();
    }
  };

  useEffect(() => {
    if (applyClicked) {
      const visibleRange =
        rangeSelectionMode === 'relative' ? selectedRelativeRange : fillMissingTime(selectedAbsoluteRange);

      const newValidationResult = isValidRange(visibleRange);
      setValidationResult(newValidationResult || VALID_RANGE);
    }
  }, [applyClicked, isValidRange, rangeSelectionMode, selectedRelativeRange, selectedAbsoluteRange]);

  const focusRefs = {
    default: useRef<Focusable>(null),
    'absolute-only': useRef<Focusable>(null),
    'relative-only': useRef<Focusable>(null),
  };

  useEffect(() => scrollableContainerRef.current?.focus(), [scrollableContainerRef]);

  return (
    <>
      <FocusLock autoFocus={true}>
        <div
          {...focusVisible}
          ref={scrollableContainerRef}
          className={styles.dropdown}
          tabIndex={0}
          role="dialog"
          aria-modal="true"
          aria-label={i18nStrings.ariaLabel}
          aria-labelledby={ariaLabelledby ?? i18nStrings.ariaLabelledby}
          aria-describedby={ariaDescribedby ?? i18nStrings.ariaDescribedby}
        >
          <div
            className={clsx(styles['dropdown-content'], {
              [styles['one-grid']]: isSingleGrid,
            })}
          >
            <SpaceBetween size="l">
              <InternalBox padding={{ top: 'm', horizontal: 'l' }}>
                <SpaceBetween direction="vertical" size="s">
                  {rangeSelectorMode === 'default' && (
                    <ModeSwitcher
                      ref={focusRefs.default}
                      mode={rangeSelectionMode}
                      onChange={(mode: 'absolute' | 'relative') => {
                        setRangeSelectionMode(mode);
                        setApplyClicked(false);
                        setValidationResult(VALID_RANGE);
                      }}
                      i18nStrings={i18nStrings}
                    />
                  )}

                  {rangeSelectionMode === 'absolute' && (
                    <Calendar
                      ref={focusRefs['absolute-only']}
                      isSingleGrid={isSingleGrid}
                      initialEndDate={selectedAbsoluteRange?.endDate}
                      initialStartDate={selectedAbsoluteRange?.startDate}
                      locale={locale}
                      startOfWeek={startOfWeek}
                      isDateEnabled={isDateEnabled}
                      i18nStrings={i18nStrings}
                      onSelectDateRange={setSelectedAbsoluteRange}
                      dateOnly={dateOnly}
                      timeInputFormat={timeInputFormat}
                    />
                  )}

                  {rangeSelectionMode === 'relative' && (
                    <RelativeRangePicker
                      ref={focusRefs['relative-only']}
                      isSingleGrid={isSingleGrid}
                      options={relativeOptions}
                      dateOnly={dateOnly}
                      initialSelection={selectedRelativeRange}
                      onChange={range => setSelectedRelativeRange(range)}
                      i18nStrings={i18nStrings}
                    />
                  )}
                </SpaceBetween>

                <InternalBox
                  className={styles['validation-section']}
                  margin={!validationResult.valid ? { top: 's' } : undefined}
                >
                  {!validationResult.valid && (
                    <>
                      <InternalAlert type="error">
                        <span className={styles['validation-error']}>{validationResult.errorMessage}</span>
                      </InternalAlert>
                      <LiveRegion>{validationResult.errorMessage}</LiveRegion>
                    </>
                  )}
                </InternalBox>
              </InternalBox>

              <div
                className={clsx(styles.footer, {
                  [styles['one-grid']]: isSingleGrid,
                  [styles['has-clear-button']]: showClearButton,
                })}
              >
                {showClearButton && (
                  <div className={styles['footer-button-wrapper']}>
                    <InternalButton
                      onClick={onClear}
                      className={styles['clear-button']}
                      variant="link"
                      formAction="none"
                    >
                      {i18nStrings.clearButtonLabel}
                    </InternalButton>
                  </div>
                )}
                <div className={styles['footer-button-wrapper']}>
                  <SpaceBetween size="xs" direction="horizontal">
                    <InternalButton
                      onClick={closeDropdown}
                      className={styles['cancel-button']}
                      variant="link"
                      formAction="none"
                    >
                      {i18nStrings.cancelButtonLabel}
                    </InternalButton>

                    <InternalButton
                      onClick={onApply}
                      className={styles['apply-button']}
                      ref={applyButtonRef}
                      formAction="none"
                    >
                      {i18nStrings.applyButtonLabel}
                    </InternalButton>
                  </SpaceBetween>
                </div>
              </div>
            </SpaceBetween>
          </div>
        </div>
      </FocusLock>
    </>
  );
}
