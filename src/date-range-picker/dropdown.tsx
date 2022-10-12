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
import { useDateRangePicker } from './use-date-range-picker';

export const VALID_RANGE: DateRangePickerProps.ValidRangeResult = { valid: true };

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
    fillMissingTime,
    rangeSelectionMode,
    setRangeSelectionMode,
    selectedAbsoluteRange,
    setSelectedAbsoluteRange,
    selectedRelativeRange,
    setSelectedRelativeRange,
  } = useDateRangePicker({
    value,
    relativeOptions,
    rangeSelectorMode,
  });

  const focusVisible = useFocusVisible();
  const scrollableContainerRef = useRef<HTMLDivElement | null>(null);
  const applyButtonRef = useRef<ButtonProps.Ref>(null);

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
  }, [
    applyClicked,
    isValidRange,
    rangeSelectionMode,
    selectedRelativeRange,
    selectedAbsoluteRange,
    fillMissingTime,
    setValidationResult,
  ]);

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
                      <InternalAlert type="error" statusIconAriaLabel={i18nStrings.errorIconAriaLabel}>
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
