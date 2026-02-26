// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useEffect, useState } from 'react';

// NOTE: Ensure that direct or transitive dependencies never pull in
// intl-messageformat or any `@formatjs` dependencies! Otherwise, it
// would harm any bundle size improvements this component brings.
import { FormatFunction, InternalI18nContext } from '../context';
import { determineAppLocale } from '../utils/locales';

interface I18nFormatterInterface {
  format: FormatFunction;
}

export interface RemoteI18nProviderProps {
  /**
   * A format function, loaded dynamically from the result of this callback. If
   * the callback returns null, it means that the provider isn't available for
   * whatever reason, and nothing happens.
   */
  loadFormatter: (args: { locale: string }) => Promise<I18nFormatterInterface | null>;

  children: React.ReactNode;
}

/**
 * A lightweight implementation of the I18nProvider context wrapper that expects both the
 * messages and the formatting logic to be provided from a remote source. Explicitly does
 * nothing if it's wrapped by a LocalI18nProvider.
 */
export default function RemoteI18nProvider({ loadFormatter, children }: RemoteI18nProviderProps) {
  const wrapperContext = useContext(InternalI18nContext);
  const [formatFunction, setFormatFunction] = useState<FormatFunction | undefined>();

  // Ensure that every dependency of the effect below can never change.
  // The locale comes from the document, and the formatter only depends on that,
  // so it should never need to update either.
  const hasWrapperContext = !!wrapperContext;
  const [locale] = useState(() => determineAppLocale());
  const [staticLoadFormatter] = useState(() => loadFormatter);

  useEffect(() => {
    // Translations are already provided from a local provider, so skip.
    if (hasWrapperContext) {
      return;
    }

    staticLoadFormatter({ locale })
      .then(formatter => {
        if (formatter) {
          setFormatFunction(() => formatter.format.bind(formatter));
        }
        // If formatter isn't available, do nothing.
      })
      .catch(() => {
        // Do nothing. Failure in fetching the formatter should not be fatal.
      });
  }, [hasWrapperContext, locale, staticLoadFormatter]);

  const value = wrapperContext || (formatFunction && { locale, format: formatFunction });
  return <InternalI18nContext.Provider value={value}>{children}</InternalI18nContext.Provider>;
}
