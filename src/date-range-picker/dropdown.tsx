// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useRef, useState } from 'react';
import { DateRangePickerProps } from './interfaces';
import Calendar from './calendar';
import { ButtonProps } from '../button/interfaces';
import { InternalButton } from '../button/internal';
import FocusLock from '../internal/components/focus-lock';
import InternalBox from '../box/internal';
import InternalSpaceBetween from '../space-between/internal';

import styles from './styles.css.js';
import RelativeRangePicker from './relative-range';
import ModeSwitcher from './mode-switcher';
import clsx from 'clsx';
import InternalAlert from '../alert/internal';
import LiveRegion from '../internal/components/live-region';
import { getDefaultMode, joinAbsoluteValue, splitAbsoluteValue } from './utils';
import { useInternalI18n } from '../i18n/context';

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
    | 'dateOnly'
    | 'timeInputFormat'
    | 'rangeSelectorMode'
  > {
  onClear: () => void;
  onApply: (value: null | DateRangePickerProps.Value) => DateRangePickerProps.ValidationResult;
  startOfWeek: number | undefined;
  onDropdownClose: () => void;
  isSingleGrid: boolean;
  i18nStrings?: DateRangePickerProps.I18nStrings;

  ariaLabelledby?: string;
  ariaDescribedby?: string;
  customAbsoluteRangeControl: DateRangePickerProps.AbsoluteRangeControl | undefined;
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
  customAbsoluteRangeControl,
}: DateRangePickerDropdownProps) {
  const i18n = useInternalI18n('date-range-picker');

  const [rangeSelectionMode, setRangeSelectionMode] = useState<'absolute' | 'relative'>(
    getDefaultMode(value, relativeOptions, rangeSelectorMode)
  );

  const [selectedAbsoluteRange, setSelectedAbsoluteRange] = useState<DateRangePickerProps.PendingAbsoluteValue>(() =>
    splitAbsoluteValue(value?.type === 'absolute' ? value : null)
  );

  const [selectedRelativeRange, setSelectedRelativeRange] = useState<DateRangePickerProps.RelativeValue | null>(
    value?.type === 'relative' ? value : null
  );

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
    const newValue =
      rangeSelectionMode === 'relative' ? selectedRelativeRange : joinAbsoluteValue(selectedAbsoluteRange);
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
        rangeSelectionMode === 'relative' ? selectedRelativeRange : joinAbsoluteValue(selectedAbsoluteRange);

      const newValidationResult = isValidRange(visibleRange);
      setValidationResult(newValidationResult || VALID_RANGE);
    }
  }, [
    applyClicked,
    isValidRange,
    rangeSelectionMode,
    selectedRelativeRange,
    selectedAbsoluteRange,
    setValidationResult,
  ]);

  useEffect(() => scrollableContainerRef.current?.focus(), [scrollableContainerRef]);

  return (
    <>
      <FocusLock className={styles['focus-lock']} autoFocus={true}>
        <div
          ref={scrollableContainerRef}
          className={styles.dropdown}
          tabIndex={0}
          role="dialog"
          aria-modal="true"
          aria-label={i18nStrings?.ariaLabel}
          aria-labelledby={ariaLabelledby ?? i18nStrings?.ariaLabelledby}
          aria-describedby={ariaDescribedby ?? i18nStrings?.ariaDescribedby}
        >
          <div
            className={clsx(styles['dropdown-content'], {
              [styles['one-grid']]: isSingleGrid,
            })}
          >
            <InternalSpaceBetween size="l">
              <InternalBox padding={{ top: 'm', horizontal: 'l' }}>
                <InternalSpaceBetween direction="vertical" size="s">
                  {rangeSelectorMode === 'default' && (
                    <ModeSwitcher
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
                      value={selectedAbsoluteRange}
                      setValue={setSelectedAbsoluteRange}
                      locale={locale}
                      startOfWeek={startOfWeek}
                      isDateEnabled={isDateEnabled}
                      i18nStrings={i18nStrings}
                      dateOnly={dateOnly}
                      timeInputFormat={timeInputFormat}
                      customAbsoluteRangeControl={customAbsoluteRangeControl}
                    />
                  )}

                  {rangeSelectionMode === 'relative' && (
                    <RelativeRangePicker
                      isSingleGrid={isSingleGrid}
                      options={relativeOptions}
                      dateOnly={dateOnly}
                      initialSelection={selectedRelativeRange}
                      onChange={range => setSelectedRelativeRange(range)}
                      i18nStrings={i18nStrings}
                    />
                  )}
                </InternalSpaceBetween>

                <InternalBox
                  className={styles['validation-section']}
                  margin={!validationResult.valid ? { top: 's' } : undefined}
                >
                  {!validationResult.valid && (
                    <>
                      <InternalAlert
                        type="error"
                        statusIconAriaLabel={i18n('i18nStrings.errorIconAriaLabel', i18nStrings?.errorIconAriaLabel)}
                      >
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
                      {i18n('i18nStrings.clearButtonLabel', i18nStrings?.clearButtonLabel)}
                    </InternalButton>
                  </div>
                )}
                <div className={styles['footer-button-wrapper']}>
                  <InternalSpaceBetween size="xs" direction="horizontal">
                    <InternalButton
                      onClick={closeDropdown}
                      className={styles['cancel-button']}
                      variant="link"
                      formAction="none"
                    >
                      {i18n('i18nStrings.cancelButtonLabel', i18nStrings?.cancelButtonLabel)}
                    </InternalButton>

                    <InternalButton
                      onClick={onApply}
                      className={styles['apply-button']}
                      ref={applyButtonRef}
                      formAction="none"
                    >
                      {i18n('i18nStrings.applyButtonLabel', i18nStrings?.applyButtonLabel)}
                    </InternalButton>
                  </InternalSpaceBetween>
                </div>
              </div>
            </InternalSpaceBetween>
          </div>
        </div>
      </FocusLock>
    </>
  );
}
