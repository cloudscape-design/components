// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import { isDevelopment } from '../is-development';

export interface GroupedControlWarningsProps {
  /**
   * Whether the control is currently rendered inside a control group.
   */
  isGrouped: boolean;
  /**
   * The public component name used as the prefix in the dev warning
   * (for example `'Input'` or `'Multiselect'`).
   */
  componentName: string;
  /**
   * The resolved value of the control's `invalid` prop.
   */
  invalid?: boolean;
  /**
   * The resolved value of the control's `warning` prop.
   */
  warning?: boolean;
  /**
   * The resolved value of the control's `readOnly` prop.
   */
  readOnly?: boolean;
  /**
   * The resolved value of the multiselect's `inlineTokens` prop. Only
   * meaningful for multiselect.
   */
  inlineTokens?: boolean;
  /**
   * The resolved value of the control's `expandToViewport` prop. Only
   * meaningful for the dropdown controls (autosuggest, select, multiselect);.
   */
  expandToViewport?: boolean;
}

/**
 * Emits development-only warnings for props that are unsupported when one of the
 * grouped-aware controls is rendered inside a control group.
 */
export function warnOnUnsupportedGroupedControlProps({
  isGrouped,
  componentName,
  invalid,
  warning,
  readOnly,
  inlineTokens,
  expandToViewport,
}: GroupedControlWarningsProps): void {
  if (!isDevelopment || !isGrouped) {
    return;
  }

  if (invalid) {
    warnOnce(
      componentName,
      'The `invalid` prop is ignored on controls inside a control group. Set the validation state on the control group instead.'
    );
  }

  if (warning) {
    warnOnce(
      componentName,
      'The `warning` prop is ignored on controls inside a control group. Set the validation state on the control group instead.'
    );
  }

  if (readOnly) {
    warnOnce(componentName, 'The `readOnly` prop is not supported on controls inside a control group.');
  }

  if (inlineTokens === false) {
    warnOnce(
      componentName,
      'The `inlineTokens` prop is ignored inside a control group; tokens are always shown inline.'
    );
  }

  if (expandToViewport === false) {
    warnOnce(
      componentName,
      'The `expandToViewport` prop is ignored inside a control group; the dropdown is always expanded to the viewport.'
    );
  }
}
