// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ReactNode } from 'react';
import { BaseComponentProps } from '../internal/base-component';
import { NonCancelableEventHandler } from '../internal/events';
import { PopoverProps } from '../popover/interfaces';

export interface SeriesInfo {
  label: string;
  color: string;
  index: number;
  markerType: 'line' | 'rectangle';
}

export interface ChartDetailPair {
  key: ReactNode;
  value: ReactNode;
}

export interface PieChartProps<T extends PieChartProps.Datum = PieChartProps.Datum> extends BaseComponentProps {
  /**
   * An array that represents the source of data for the displayed segments.
   * Each element can have the following properties:
   *
   * * `title` (string) - A human-readable title for this data point.
   * * `value` (number) - Numeric value that determines the segment size.
   *                        A segment with a value of zero (0) or lower (negative number) won't have a segment.
   * * `color`: (string) - (Optional) Color value for this segment that takes priority over the automatically assigned color.
   *                        Can be any valid CSS color identifier.
   *
   * As long as your data object implements the properties above, you can also define additional properties
   * that are relevant to your data visualization.
   * The full data object will be passed down to events and properties like `detailPopoverContent`.
   */
  data: ReadonlyArray<T>;

  /**
   * Specifies the size of the pie or donut chart.
   * When used with `fitHeight`, this property defines the minimum size of the chart area.
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * Visual variant of the pie chart. Currently supports the default `pie` variant and the `donut` variant.
   * The donut variant provides a slot in the center of the chart that can contain additional information.
   * For more information, see `innerContent`.
   */
  variant?: 'pie' | 'donut';

  /**
   * A function that determines the details that are displayed in the popover when hovering over a segment.
   * The function is called with the data of the target segment and is expected to return an array of detail pairs.
   * By default, each segment displays two detail pairs: count and percentage.
   *
   * Each pair has the following properties:
   * * `key` (string) - Name of the detail or metric.
   * * `value` (string | number) - The value of this detail for the target segment.
   */
  detailPopoverContent?: PieChartProps.DetailPopoverContentFunction<T>;

  /**
   * Additional content that is displayed at the bottom of the detail popover.
   */
  detailPopoverFooter?: PieChartProps.DetailPopoverFooter<T>;

  /**
   * A function that determines the description of a segment that is displayed on the chart, unless `hideDescriptions` is set to `true`.
   * This is an optional description that explains the segment and is displayed underneath the label.
   * The function is called with the data object of each segment and is expected to return the description as a string.
   */
  segmentDescription?: PieChartProps.SegmentDescriptionFunction<T>;

  /**
   * Determines the maximum width of the popover.
   */
  detailPopoverSize?: PopoverProps.Size;

  /**
   * Hides legend beneath the chart when set to `true`.
   * We highly recommend that you leave this unspecified or set to `false`.
   */
  hideLegend?: boolean;

  /**
   * Hides label titles next to the chart segments when set to `true`.
   * We highly recommend that you leave this unspecified or set to `false`.
   */
  hideTitles?: boolean;

  /**
   * Hides the label descriptions next to the chart segments when set to `true`.
   */
  hideDescriptions?: boolean;

  /**
   * Hides the default filtering dropdown when set to `true`.
   * You can still display additional filters with the `additionalFilters` slot.
   */
  hideFilter?: boolean;

  /**
   * Additional metric number that's displayed in the center of the chart if `variant` is set to `donut`.
   */
  innerMetricValue?: string;

  /**
   * Additional description that's displayed in the center of the chart below `innerMetricValue` if `variant` is set to `donut`.
   * This is usually the unit of the `innerMetricValue`.
   */
  innerMetricDescription?: string;

  /**
   * Title for the legend.
   */
  legendTitle?: string;

  /**
   * Additional filters that you can add above the chart component.
   * Make sure you update the `data` property when any of your custom filters change the data that's displayed.
   */
  additionalFilters?: React.ReactNode;

  /**
   * Specifies the currently highlighted data segment. Highlighting is typically the result of
   * a user hovering over or selecting a segment in the chart or the legend.
   * A value of `null` means no segment is being highlighted.
   *
   * - If you don't set this property, segments are highlighted automatically when a user hovers over or selects one of the triggers (that is, uncontrolled behavior).
   * - If you explicitly set this property, you must set an `onHighlightChange` listener to update this property when a segment should be highlighted (that is, controlled behavior).
   */
  highlightedSegment?: T | null;

  /**
   * An array of data segment objects that determines which data segments are currently visible (that is, not filtered out).
   *
   * - If you don't set this property, segments are filtered automatically when using the default filtering of the component (that is, uncontrolled behavior).
   * - If you explicitly set this property, you must set an `onFilterChange` listener to update this property when the list of filtered segments changes (that is, controlled behavior).
   */
  visibleSegments?: ReadonlyArray<T>;

  /**
   * Specifies the current status of loading data.
   * * `loading` - Indicates that data fetching is in progress.
   * * `finished` - Indicates that data has loaded successfully.
   * * `error` - Indicates that an error occurred during fetch. You should provide an option to enable the user to recover.
   **/
  statusType?: 'loading' | 'finished' | 'error';

  /**
   * Content that's displayed when the data passed to the component is empty.
   */
  empty?: React.ReactNode;

  /**
   * Content that's displayed when there is no data to display because it doesn't match the specified filter.
   */
  noMatch?: React.ReactNode;

  /**
   * Text that's displayed when the chart is loading (that is, when `statusType` is set to `loading`).
   * @i18n
   */
  loadingText?: string;

  /**
   * Text that's displayed when the chart is in error state (that is, when `statusType` is set to `error`).
   * @i18n
   */
  errorText?: string;

  /**
   * Text for the recovery button that's displayed next to the error text.
   * @i18n
   **/
  recoveryText?: string;

  /**
   * Called when the user clicks the recovery button that appears when there is an error state.
   * Use this to enable the user to retry a failed request or provide another option for the user
   * to recover from the error.
   */
  onRecoveryClick?: NonCancelableEventHandler;

  /**
   * Called when the highlighted segmented changes because of a user interaction.
   */
  onHighlightChange?: NonCancelableEventHandler<PieChartProps.HighlightChangeDetail<T>>;

  /**
   * Called when the values of the internal filter component changes.
   * This isn't called for any custom filter components you've defined in `additionalFilters`.
   */
  onFilterChange?: NonCancelableEventHandler<PieChartProps.FilterChangeDetail<T>>;

  /**
   * ARIA label that's assigned to the chart. It should match the visible label on the page
   * (for example, in the container header). Use either `ariaLabel` or `ariaLabelledby` (you can't use both).
   */
  ariaLabel?: string;

  /**
   * Sets `aria-labelledby` on the chart. If there is a visible label for the chart on the page
   * (for example, in the container header), set this property to the ID of that header element.
   * Use either `ariaLabel` or `ariaLabelledby` (you can't use both).
   */
  ariaLabelledby?: string;

  /**
   * A description of the chart that assistive technologies can use (through `aria-describedby` and `<title>`).
   * Provide a concise summary of the data visualized in the chart.
   */
  ariaDescription?: string;

  /**
   * An object that contains all of the localized strings required by the component.
   * @i18n
   */
  i18nStrings?: PieChartProps.I18nStrings;

  /**
   * Enable this property to make the chart fit into the available height of the parent container.
   */
  fitHeight?: boolean;
}

export namespace PieChartProps {
  export interface Datum {
    title: string;
    value: number;
    color?: string;
  }

  export type PieChartData = ReadonlyArray<Datum>;

  export interface DetailPopoverContentFunction<T = Datum> {
    (segment: T, visibleDataSum: number): ReadonlyArray<ChartDetailPair>;
  }

  export interface DetailPopoverFooter<T> {
    (segment: T): React.ReactNode;
  }

  export interface SegmentDescriptionFunction<T = Datum> {
    (segment: T, visibleDataSum: number): string;
  }

  export interface HighlightChangeDetail<T> {
    highlightedSegment: T | null;
  }

  export interface FilterChangeDetail<T> {
    visibleSegments: ReadonlyArray<T>;
  }

  export interface I18nStrings {
    /** Name of the "Value" key that is displayed in the details popover by default */
    detailsValue?: string;

    /** Name of the "Percentage" key that is displayed in the details popover by default */
    detailsPercentage?: string;

    /** Visible label of the default filter */
    filterLabel?: string;

    /** Placeholder text of the default filter */
    filterPlaceholder?: string;

    /** ARIA label for the default filter which is appended to any option that is selected */
    filterSelectedAriaLabel?: string;

    /** ARIA label that is associated with the legend in case there is no visible `legendTitle` defined */
    legendAriaLabel?: string;

    /** ARIA label for details popover dismiss button */
    detailPopoverDismissAriaLabel?: string;

    /** Name of the ARIA role description of the chart, e.g. "pie chart" */
    chartAriaRoleDescription?: string;

    /** Name of the ARIA role description of each segment, e.g. "segment" */
    segmentAriaRoleDescription?: string;
  }
}
