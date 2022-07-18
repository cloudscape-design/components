// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef } from 'react';
import { DateRangePickerProps } from './interfaces';
import Calendar, { DayIndex } from './calendar';
import { ButtonProps } from '../button/interfaces';
import { InternalButton } from '../button/internal';
import TabTrap from '../internal/components/tab-trap';
import InternalBox from '../box/internal';
import SpaceBetween from '../space-between/index.js';

import styles from './styles.css.js';
import RelativeRangePicker from './relative-range';
import ModeSwitcher from './mode-switcher';
import clsx from 'clsx';
import InternalAlert from '../alert/internal';
import LiveRegion from '../internal/components/live-region';
import { useDateRangePicker } from './use-date-range-picker';

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
  startOfWeek: DayIndex;
  onDropdownClose: () => void;
  isSingleGrid: boolean;

  ariaLabelledby?: string;
  ariaDescribedby?: string;
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
  const {
    focusVisible,
    focusRefs,
    scrollableContainerRef,
    rangeSelectionMode,
    setRangeSelectionMode,
    selectedAbsoluteRange,
    setSelectedAbsoluteRange,
    selectedRelativeRange,
    setSelectedRelativeRange,
    applyClicked,
    setApplyClicked,
    validationResult,
    setValidationResult,
    VALID_RANGE,
  } = useDateRangePicker({
    value,
    relativeOptions,
    rangeSelectorMode,
    isValidRange,
  });

  const applyButtonRef = useRef<ButtonProps.Ref>(null);

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
  }, [
    applyClicked,
    isValidRange,
    rangeSelectionMode,
    selectedRelativeRange,
    selectedAbsoluteRange,
    VALID_RANGE,
    setValidationResult,
  ]);

  useEffect(() => scrollableContainerRef.current?.focus(), [scrollableContainerRef]);

  return (
    <>
      <TabTrap focusNextCallback={() => applyButtonRef.current?.focus()} />
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
                  <InternalButton onClick={onClear} className={styles['clear-button']} variant="link" formAction="none">
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

          <TabTrap focusNextCallback={() => scrollableContainerRef.current?.focus()} />
        </div>
      </div>
    </>
  );
}
