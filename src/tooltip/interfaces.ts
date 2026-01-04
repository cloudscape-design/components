// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { NonCancelableEventHandler } from '../internal/events';
import { PopoverProps } from '../popover/interfaces';

export interface TooltipProps {
  /**
   * Content to display in the tooltip.
   * Accepts any valid React node including strings, numbers, elements, and fragments.
   */
  content: React.ReactNode;

  /**
   * Function that returns the element to track for positioning the tooltip.
   * Can return null if the element is not yet mounted or available.
   */
  getTrack: () => null | HTMLElement | SVGElement;

  /**
   * Unique identifier for the tooltip instance. Changing this value will cause the tooltip
   * to recalculate its position, similar to how React's key prop works.
   * If not provided and content is a string or number, it will be used as key.
   * For complex content (elements, fragments), you should provide an explicit trackKey.
   */
  trackKey?: string | number;

  /**
   * Position of the tooltip relative to the tracked element.
   * @defaultValue 'top'
   */
  position?: TooltipProps.Position;
  /**
   * Callback fired when the user presses the Escape key while the tooltip is visible.
   */
  onEscape?: NonCancelableEventHandler;
}
export namespace TooltipProps {
  /**
   * Position of the tooltip relative to the tracked element.
   */
  export type Position = PopoverProps.Position;
}

/**
 * A utility hook for creating accessible descriptions for tooltips.
 *
 * This hook provides a way to add hidden descriptions to elements that work with screen readers
 * while also supporting visual tooltips for sighted users. It creates a unique ID and returns
 * props to connect an element to its description via aria-describedby.
 *
 * @param description - The description text to be announced by screen readers
 *
 * @returns An object with the following properties:
 * - `targetProps`: Props to spread onto the target element (contains aria-describedby)
 * - `descriptionEl`: A hidden span element containing the description text
 * - `descriptionId`: The unique ID used for the description
 *
 * @example
 * ```tsx
 * import Tooltip, { useHiddenDescription } from '@cloudscape-design/components/tooltip';
 *
 * function MyComponent() {
 *   const [show, setShow] = useState(false);
 *   const { targetProps, descriptionEl } = useHiddenDescription(
 *     'This button saves your changes'
 *   );
 *
 *   return (
 *     <div>
 *       <button
 *         {...targetProps}
 *         onMouseEnter={() => setShow(true)}
 *         onFocus={() => setShow(true)}
 *       >
 *         Save
 *       </button>
 *       {descriptionEl}
 *       {show && <Tooltip content="This button saves your changes" />}
 *     </div>
 *   );
 * }
 * ```
 */
export declare function useHiddenDescription(description?: string): {
  targetProps: { 'aria-describedby'?: string };
  descriptionEl: React.ReactElement | null;
  descriptionId: string;
};

/**
 * Internal tooltip props - includes props not exposed in public API.
 * @internal
 */
export interface InternalTooltipProps extends TooltipProps {
  /**
   * Whether to dismiss the tooltip when the user scrolls.
   * @internal
   */
  __dismissOnScroll?: boolean;

  /**
   * Callback fired when the tooltip is dismissed due to scroll.
   * @internal
   */
  __onDismissOnScroll?: NonCancelableEventHandler;

  /**
   * Additional CSS class for the tooltip container.
   * @internal
   */
  className?: string;
}
