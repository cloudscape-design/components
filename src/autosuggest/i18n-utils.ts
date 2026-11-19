// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useInternalI18n } from '../i18n/context';
import { AutosuggestProps } from './interfaces';

interface AutosuggestTokenI18n {
  tokenOverflowAriaLabel?: (hiddenCount: number) => string;
  tokenInsertedAriaLabel?: (value: string) => string;
  tokenDismissLabel?: (value: string) => string;
}

/**
 * Resolves token-mode strings: `i18nStrings` prop first, then the I18nProvider catalog.
 */
export function useAutosuggestTokenI18n(i18nStrings?: AutosuggestProps.I18nStrings): AutosuggestTokenI18n {
  const i18n = useInternalI18n('autosuggest');
  return {
    tokenOverflowAriaLabel: i18n(
      'i18nStrings.tokenOverflowAriaLabel',
      i18nStrings?.tokenOverflowAriaLabel,
      format => count => format({ count })
    ),
    tokenInsertedAriaLabel: i18n(
      'i18nStrings.tokenInsertedAriaLabel',
      i18nStrings?.tokenInsertedAriaLabel,
      format => value => format({ token__label: value })
    ),
    tokenDismissLabel: i18n(
      'i18nStrings.tokenDismissLabel',
      i18nStrings?.tokenDismissLabel,
      format => value => format({ token__label: value })
    ),
  };
}
