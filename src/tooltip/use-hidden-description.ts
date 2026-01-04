// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';

// Simple unique ID generator for React < 18 compatibility
let idCounter = 0;
function generateUniqueId(prefix = 'tooltip-description') {
  return `${prefix}-${++idCounter}`;
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
 * function MyTooltipButton() {
 *   const [showTooltip, setShowTooltip] = useState(false);
 *   const { targetProps, descriptionEl } = useHiddenDescription(
 *     'This button saves your changes'
 *   );
 *
 *   return (
 *     <div>
 *       <button
 *         {...targetProps}
 *         onMouseEnter={() => setShowTooltip(true)}
 *         onFocus={() => setShowTooltip(true)}
 *       >
 *         Save
 *       </button>
 *       {descriptionEl}
 *       {showTooltip && (
 *         <Tooltip content="This button saves your changes" />
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export function useHiddenDescription(description?: string) {
  const [id] = React.useState(() => generateUniqueId());
  return {
    targetProps: {
      'aria-describedby': description ? id : undefined,
    },
    descriptionEl: description ? React.createElement('span', { id, hidden: true }, description) : null,
    descriptionId: id,
  };
}
