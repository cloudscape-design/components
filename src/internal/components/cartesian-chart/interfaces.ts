// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseComponentProps } from '../../base-component';
import { NonCancelableEventHandler } from '../../events';

export interface CartesianChartProps<T extends ChartDataTypes, Series> extends BaseComponentProps {
  /**
   * Determines the type of scale for values on the x axis.
   */
  xScaleType?: ScaleType;

  /**
   * Determines the type of scale for values on the y axis.
   */
  yScaleType?: 'linear' | 'log';

  /**
   * Determines the domain of the x axis, i.e. the range of values that will be visible in the chart.
   * For numerical and time-based data this is represented as an array with two values: `[minimumValue, maximumValue]`.
   * For categorical data this is represented as an array of strings that determine the categories to display.
   *
   * It is recommended to set this explicitly. If not, the component will determine a domain that fits all data points.
   * When controlling this directly, make sure to update the value based on filtering changes.
   */
  xDomain?: T extends unknown ? ReadonlyArray<T> : ReadonlyArray<T>;

  /**
   * Determines the domain of the y axis, i.e. the range of values that will be visible in the chart.
   * The domain is defined by a tuple: `[minimumValue, maximumValue]`.
   *
   * It is recommended to set this explicitly. If not, the component will determine a domain that fits all data points.
   * When controlling this directly, make sure to update the value based on filtering changes.
   */
  yDomain?: ReadonlyArray<number>;

  /**
   * The title of the x axis.
   */
  xTitle?: string;

  /**
   * The title of the y axis.
   */
  yTitle?: string;

  /**
   * Optional title for the legend.
   */
  legendTitle?: string;

  /**
   * ARIA label that is assigned to the chart itself. It should match the visible label on the page, e.g. in the container header.
   * Do not use `ariaLabel` and `ariaLabelledby` at the same time.
   */
  ariaLabel?: string;

  /**
   * Sets `aria-labelledby` on the chart itself.
   * If there is a visible label for the chart on the page, e.g. in the container header, set this property to the ID of that header element.
   * Do not use `ariaLabel` and `ariaLabelledby` at the same time.
   */
  ariaLabelledby?: string;

  /**
   * A description of the chart that assistive technologies can use (through `aria-describedby`).
   * Provide a concise summary of the data visualized in the chart.
   */
  ariaDescription?: string;

  /**
   * An object containing all the necessary localized strings required by the component.
   * @i18n
   */
  i18nStrings?: CartesianChartProps.I18nStrings<T>;

  /**
   * An optional pixel value number that fixes the height of the chart area.
   * If not set explicitly, the component will use a default height that is defined internally.
   */
  height?: number;

  /**
   * Determines the maximum width the detail popover will be limited to.
   */
  detailPopoverSize?: 'small' | 'medium' | 'large';

  /**
   * Additional content that is displayed at the bottom of the detail popover.
   */
  detailPopoverFooter?: CartesianChartProps.DetailPopoverFooter<T>;

  /**
   * When set to `true`, the legend beneath the chart is not displayed.
   * It is highly recommended to keep this set to `false`.
   */
  hideLegend?: boolean;

  /**
   * When set to `true`, the default filtering dropdown is not displayed.
   * It is still possible to render additional filters with the `additionalFilters` slot.
   */
  hideFilter?: boolean;

  /**
   * Additional filters that are added above the chart component.
   * Make sure to update the `data` property when any of your custom filters change the data to be displayed.
   */
  additionalFilters?: React.ReactNode;

  /**
   * The currently highlighted data series, usually through hovering over a series or the legend.
   * A value of `null` means no series is highlighted.
   *
   * - If you do not set this property, series are highlighted automatically when hovering over one of the triggers (uncontrolled behavior).
   * - If you explicitly set this property, you must set an `onHighlightChange` listener to update this property when a series should be highlighted (controlled behavior).
   */
  highlightedSeries?: Series | null;

  /**
   * An array of series objects that determines which of the data series are currently displayed, i.e. not filtered out.
   * - If you do not set this property, series are shown and hidden automatically when using the default filter component (uncontrolled behavior).
   * - If you explicitly set this property, you must set an `onFilterChange` listener to update this property when the visible series should change, or when one of your custom filters changes the number of visible series (controlled behavior).
   */
  visibleSeries?: ReadonlyArray<Series>;

  /**
   * Specifies the current status of loading data.
   * * `loading`: data fetching is in progress.
   * * `finished`: data has loaded successfully.
   * * `error`: an error occurred during fetch. You should provide user an option to recover.
   **/
  statusType?: 'loading' | 'finished' | 'error';

  /**
   * Content that is displayed when the data passed to the component is empty.
   */
  empty?: React.ReactNode;

  /**
   * Content that is displayed when there is no data to display due to the built-in filtering.
   */
  noMatch?: React.ReactNode;

  /**
   * Text that is displayed when the chart is loading, i.e. when `statusType` is set to `"loading"`.
   * @i18n
   */
  loadingText?: string;

  /**
   * Text that is displayed when the chart is in error state, i.e. when `statusType` is set to `"error"`.
   * @i18n
   */
  errorText?: string;

  /**
   * Text for the recovery button that is displayed next to the error text.
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
   * Called when the values of the internal filter component changed.
   * This will **not** be called for any custom filter components you have defined in `additionalFilters`.
   */
  onFilterChange?: NonCancelableEventHandler<CartesianChartProps.FilterChangeDetail<Series>>;

  /**
   * Called when the highlighted series has changed because of user interaction.
   */
  onHighlightChange?: NonCancelableEventHandler<CartesianChartProps.HighlightChangeDetail<Series>>;
}

export namespace CartesianChartProps {
  export interface FilterChangeDetail<Series> {
    visibleSeries: ReadonlyArray<Series>;
  }

  export interface HighlightChangeDetail<Series> {
    highlightedSeries: Series | null;
  }

  export interface TickFormatter<T> {
    (value: T): string;
  }

  export interface ValueFormatter<YType, XType = null> {
    (yValue: YType, xValue: XType): string;
  }

  export interface DetailPopoverFooter<T> {
    (xValue: T): React.ReactNode;
  }

  export interface I18nStrings<T> {
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

    /** Name of the ARIA role description of the chart, e.g. "line chart" */
    chartAriaRoleDescription?: string;

    /** Name of the ARIA role description of the x axis, e.g. "x axis" */
    xAxisAriaRoleDescription?: string;

    /** Name of the ARIA role description of the y axis, e.g. "y axis" */
    yAxisAriaRoleDescription?: string;

    /** Function to format the displayed label of an x axis tick. */
    xTickFormatter?: TickFormatter<T>;

    /** Function to format the displayed label of a y axis tick. */
    yTickFormatter?: TickFormatter<number>;
  }
}

export type ChartDataTypes = number | string | Date;

export type ScaleType = 'linear' | 'log' | 'time' | 'categorical';
export type XScaleType = 'linear' | 'log' | 'time' | 'categorical';
export type YScaleType = 'linear' | 'log';
export type ScaleRange = [number, number];

export type ChartDomain<T extends ChartDataTypes> = T extends unknown ? ReadonlyArray<T> : ReadonlyArray<T>;
export type XDomain<T extends ChartDataTypes> = ChartDomain<T>;
export type YDomain = ChartDomain<number>;
