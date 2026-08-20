// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { CalendarProps } from '../calendar/interfaces';
import { DateRangePickerProps } from '../date-range-picker/interfaces';
import { BaseComponentProps } from '../types/base-component';
import { NonCancelableEventHandler } from '../types/events';

export interface DateRangePickerPresetsProps extends BaseComponentProps, Pick<CalendarProps, 'granularity'> {
  /**
   * The current relative-range value. When `null` or `undefined`, no preset is selected.
   */
  value: DateRangePickerProps.RelativeValue | null;

  /**
   * A list of relative time ranges shown as preset options.
   */
  relativeOptions: ReadonlyArray<DateRangePickerProps.RelativeOption>;

  /**
   * Fired whenever the user selects or modifies a relative range.
   * The event `detail.value` contains the newly chosen range.
   */
  onChange?: NonCancelableEventHandler<DateRangePickerPresetsProps.ChangeDetail>;

  /**
   * Hides time-based units (seconds, minutes, hours) from the custom-range unit
   * selector and restricts presets to date-only units.
   *
   * Default: `false`.
   */
  dateOnly?: boolean;

  /**
   * An object containing all the necessary localized strings required by the component.
   * Shares the same shape as `DateRangePickerProps.I18nStrings`.
   * @i18n
   */
  i18nStrings?: DateRangePickerProps.I18nStrings;

  /**
   * Specifies which time units to allow in the custom relative range control.
   * When omitted, all units appropriate for the `dateOnly` / `granularity` setting are shown.
   */
  customRelativeRangeUnits?: DateRangePickerProps.TimeUnit[];

  /**
   * Specifies custom content to fully override the presets UI.
   * When provided, all default preset and custom-range controls are replaced.
   */
  renderContent?: DateRangePickerProps.RelativeRangeControl;
}

export namespace DateRangePickerPresetsProps {
  export interface ChangeDetail {
    /**
     * The newly selected relative range.
     */
    value: DateRangePickerProps.RelativeValue;
  }

  export interface Ref {
    /**
     * Sets browser focus onto the first interactive element inside the component.
     */
    focus(): void;
  }
}
